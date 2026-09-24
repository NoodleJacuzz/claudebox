"""Builds Honeycomb's looping music from the source songs.

    python "!designDocs/honeycomb/tools/music/build-music-loops.py"            build every track
    python "!designDocs/honeycomb/tools/music/build-music-loops.py" map        build one

Reads music-loops.json (the cut list), writes one .mp3 per track into `honeycomb sound/music/loop/`
and music-metrics.json beside this script. The game reads neither JSON file: the two numbers it needs
per track (loopSeconds, and the file name) are copied into tuning.audio.music, and suite block [123]
fails when tuning and music-metrics.json disagree.

THE SHAPE OF AN OUTPUT FILE, which the runtime in honeycomb-music.js depends on:

    [ one full pass of the loop, loopSeconds long ][ post-roll: the first postRollSeconds again ]

so file[t + loopSeconds] is the same audio as file[t] for every t inside the post-roll. The runtime
starts a second <audio> element from 0 while the first is inside its post-roll and swaps between two
copies of IDENTICAL audio, which is why the swap is inaudible even when a browser timer is late. Every
musical decision (which bars, which splice, how the old section rings out under the new one) is made
here, offline and sample-accurate; the browser is only ever asked to do the easy part.

Needs numpy, scipy and an ffmpeg. The ffmpeg bundled with the `imageio-ffmpeg` pip package is used when
there is none on PATH.
"""
import json, os, shutil, subprocess, sys, tempfile
import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
SPEC = json.load(open(os.path.join(HERE, "music-loops.json"), encoding="utf8"))
METRICS_PATH = os.path.join(HERE, "music-metrics.json")
CHANNELS = 2


def find_ffmpeg():
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("No ffmpeg on PATH and no imageio-ffmpeg package: pip install imageio-ffmpeg")


FFMPEG = find_ffmpeg()


def decode(path, rate):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", path, "-f", "f32le", "-ac", str(CHANNELS), "-ar", str(rate), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, CHANNELS).astype(np.float64)


def write_wav(path, audio, rate):
    from scipy.io import wavfile
    wavfile.write(path, rate, np.clip(audio, -1, 1).astype(np.float32))


def integrated_lufs(audio, rate):
    """EBU R128 integrated loudness, measured by ffmpeg's own meter rather than re-implemented."""
    with tempfile.TemporaryDirectory() as folder:
        wav = os.path.join(folder, "measure.wav")
        write_wav(wav, audio, rate)
        log = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", wav, "-af", "ebur128=peak=true", "-f", "null", "-"],
                             capture_output=True, text=True).stderr
    summary = log[log.rfind("Summary:"):]
    lufs = float(summary.split("I:")[1].split("LUFS")[0])
    peak = float(summary.split("Peak:")[1].split("dBFS")[0])
    return lufs, peak


def leveler_gain(audio, rate, used_mask, settings):
    """A slow gain ride that halves a song's long crescendo. Far too slow to pump: the loudness it reads
    is averaged over `windowSeconds` and the gain it writes is averaged again over half of that."""
    window = int(settings["windowSeconds"] * rate)
    highpassed = signal.sosfilt(signal.butter(2, 60, "hp", fs=rate, output="sos"), audio.mean(axis=1))
    power = signal.fftconvolve(highpassed ** 2, np.ones(window) / window, mode="same")
    level_db = 10 * np.log10(np.maximum(power, 1e-10))
    reference = level_db[used_mask].mean()
    gain_db = np.clip(-settings["ratio"] * (level_db - reference), -settings["maximumDb"], settings["maximumDb"])
    smooth = max(1, window // 2)
    gain_db = signal.fftconvolve(gain_db, np.ones(smooth) / smooth, mode="same")
    return 10 ** (gain_db / 20)


def build_loop(track, rate):
    source = decode(os.path.join(REPO, SPEC["sourceFolder"], track["source"]), rate)
    segments = [(int(round(s["from"] * rate)), int(round(s["to"] * rate)), int(round(s["tailSeconds"] * rate))) for s in track["segmentArray"]]

    if "leveler" in track:
        used = np.zeros(len(source), dtype=bool)
        for start, end, tail in segments:
            used[start:end] = True
        source = source * leveler_gain(source, rate, used, track["leveler"])[:, None]

    total = sum(end - start for start, end, tail in segments)
    loop = np.zeros((total, CHANNELS))
    entry = int(round(SPEC["entryFadeSeconds"] * rate))
    entry_ramp = np.sin(np.linspace(0, np.pi / 2, entry)) ** 2
    seam_array = []
    offset = 0
    for index, (start, end, tail) in enumerate(segments):
        body = source[start:end].copy()
        body[:entry] *= entry_ramp[:, None]
        loop[offset:offset + len(body)] += body
        offset += len(body)
        #THE OUTGOING MUSIC RINGS OUT UNDER THE NEXT ENTRY rather than being cut dead. `offset` is now
        #where the next segment starts, which for the last segment wraps round to sample 0.
        ring = source[end:end + tail] * (np.cos(np.linspace(0, np.pi / 2, tail)) ** 2)[:, None]
        where = (offset + np.arange(len(ring))) % total
        loop[where] += ring
        seam_array.append(offset % total)

    rotate = int(round(track.get("rotateSeconds", 0) * rate))
    loop = np.roll(loop, rotate, axis=0)
    seam_array = [(seam + rotate) % total for seam in seam_array]
    return loop, seam_array


def seam_click_ratio(loop, seam, rate):
    """How the largest sample-to-sample jump within 10ms of a seam compares with the jumps the music
    makes anyway over the surrounding two seconds. Near 1 is a seam that is not a click."""
    total = len(loop)
    step = np.abs(np.diff(loop.mean(axis=1), append=loop[:1].mean()))
    near = step[(seam + np.arange(-int(0.01 * rate), int(0.01 * rate))) % total].max()
    around = np.percentile(step[(seam + np.arange(-rate, rate)) % total], 99.9)
    return float(near / (around + 1e-12))


def build(track):
    rate = SPEC["sampleRate"]
    loop, seam_array = build_loop(track, rate)

    lufs, peak = integrated_lufs(loop, rate)
    gain_db = SPEC["targetLufs"] - lufs
    if peak + gain_db > SPEC["peakCeilingDb"]:
        gain_db = SPEC["peakCeilingDb"] - peak
    loop = loop * 10 ** (gain_db / 20)

    post_roll = int(round(SPEC["postRollSeconds"] * rate))
    full = np.concatenate([loop, loop[:post_roll]])
    end_fade = int(round(SPEC["endFadeSeconds"] * rate))
    full[-end_fade:] *= np.linspace(1, 0, end_fade)[:, None]

    out_folder = os.path.join(REPO, SPEC["outputFolder"])
    os.makedirs(out_folder, exist_ok=True)
    out_path = os.path.join(out_folder, track["index"] + ".mp3")
    with tempfile.TemporaryDirectory() as folder:
        wav = os.path.join(folder, "full.wav")
        write_wav(wav, full, rate)
        #CONSTANT bitrate on purpose: a browser seeks a CBR mp3 by arithmetic and lands where it says
        #it landed, where a VBR file with no seek table is a guess.
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", str(SPEC["bitrateKbps"]) + "k",
                        "-abr", "0", "-map_metadata", "-1", out_path], check=True)

    #FALSIFY THE PROMISE THE RUNTIME RELIES ON, against the file as a browser will decode it: the
    #post-roll has to be the same audio as the head of the file.
    decoded = decode(out_path, rate).mean(axis=1)
    head = decoded[rate // 2: post_roll - rate // 2]
    again = decoded[len(loop) + rate // 2: len(loop) + post_roll - rate // 2]
    count = min(len(head), len(again))
    identity = float(np.corrcoef(head[:count], again[:count])[0, 1])

    final_lufs, final_peak = integrated_lufs(loop, rate)
    return {
        "index": track["index"],
        "file": SPEC["outputFolder"] + "/" + track["index"] + ".mp3",
        "loopSeconds": round(len(loop) / rate, 4),
        "fileSeconds": round(len(full) / rate, 4),
        "postRollSeconds": SPEC["postRollSeconds"],
        "beats": round(len(loop) / rate * track["beatsPerMinute"] / 60, 3),
        "lufs": round(final_lufs, 2),
        "peakDb": round(final_peak, 2),
        "gainAppliedDb": round(gain_db, 2),
        "postRollIdentity": round(identity, 5),
        "seamClickRatioArray": [round(seam_click_ratio(loop, seam, rate), 2) for seam in seam_array],
        "seamSecondsArray": [round(seam / rate, 3) for seam in seam_array],
        "fileBytes": os.path.getsize(out_path),
    }


def main():
    wanted = sys.argv[1:]
    metrics = json.load(open(METRICS_PATH, encoding="utf8")) if os.path.exists(METRICS_PATH) else {"trackMap": {}}
    for track in SPEC["trackArray"]:
        if wanted and track["index"] not in wanted:
            continue
        result = build(track)
        metrics["trackMap"][track["index"]] = result
        print(json.dumps(result))
    json.dump(metrics, open(METRICS_PATH, "w", encoding="utf8"), indent="\t")
    #The same data as a script, because music-audition.html opens from disk and a file:// page may not
    #fetch a .json.
    with open(METRICS_PATH[:-2], "w", encoding="utf8") as script:
        script.write("//GENERATED by build-music-loops.py for music-audition.html. Do not edit.\nwindow.musicMetrics = " + json.dumps(metrics, indent="\t") + ";\n")
    print("wrote", METRICS_PATH, "and its .js twin")


if __name__ == "__main__":
    main()
