/**
 * MP3 DURATION WITHOUT A DECODER.
 *
 * Walks an MP3's frame headers and sums each frame's sample count, which gives the exact playing
 * length with no audio library and no ffmpeg. Used by sfx-report.js and by test-honeycomb.js, so
 * "is this sound short enough for the moment it plays at?" is a measurement rather than a guess.
 *
 * Loudness cannot be had this way -- that needs a decoder. `sfx-loudness.html` is the browser bench
 * for it; its readout fills tuning.audio.fileVolumeScaleMap.
 *
 * Exports: durationSeconds(filePath) -> number, or null when the file holds no readable frame.
 */
const fs = require("fs");

//MPEG audio frame header tables. Index order is what the two bits in the header mean, so a reserved
//value reads as null and the frame is skipped rather than mis-measured.
const VERSION_ARRAY = ["mpeg25", null, "mpeg2", "mpeg1"];
const LAYER_ARRAY = [null, 3, 2, 1];
const SAMPLE_RATE_MAP = {
	mpeg1: [44100, 48000, 32000, null],
	mpeg2: [22050, 24000, 16000, null],
	mpeg25: [11025, 12000, 8000, null],
};
const BITRATE_MAP = {
	//kbps by the header's four-bit index; 0 is "free" and 15 is invalid, both read as null.
	"mpeg1-1": [null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, null],
	"mpeg1-2": [null, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, null],
	"mpeg1-3": [null, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, null],
	"mpeg2-1": [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, null],
	"mpeg2-2": [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null],
	"mpeg2-3": [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null],
};
//Samples per frame: layer 1 is always 384; layer 2 is 1152; layer 3 is 1152 on MPEG-1 and 576 below it.
function samplesPerFrame(version, layer) {
	if (layer === 1) return 384;
	if (layer === 2) return 1152;
	return version === "mpeg1" ? 1152 : 576;
}

//Where the audio starts: past an ID3v2 tag if one is present.
function audioStart(buffer) {
	if (buffer.length < 10) return 0;
	if (buffer.toString("latin1", 0, 3) != "ID3") return 0;
	//A syncsafe 28-bit integer: seven bits per byte, high bit always clear.
	const size = ((buffer[6] & 0x7f) << 21) | ((buffer[7] & 0x7f) << 14) | ((buffer[8] & 0x7f) << 7) | (buffer[9] & 0x7f);
	return 10 + size;
}

function durationSeconds(filePath) {
	const buffer = fs.readFileSync(filePath);
	let position = audioStart(buffer);
	let samples = 0;
	let sampleRate = null;
	while (position + 4 <= buffer.length) {
		//A frame begins with eleven set bits.
		if (buffer[position] != 0xff || (buffer[position + 1] & 0xe0) != 0xe0) { position += 1; continue; }
		const version = VERSION_ARRAY[(buffer[position + 1] >> 3) & 0x03];
		const layer = LAYER_ARRAY[(buffer[position + 1] >> 1) & 0x03];
		if (version == null || layer == null) { position += 1; continue; }
		const bitrate = (BITRATE_MAP[version === "mpeg1" ? "mpeg1-" + layer : "mpeg2-" + layer] || [])[(buffer[position + 2] >> 4) & 0x0f];
		const rate = SAMPLE_RATE_MAP[version][(buffer[position + 2] >> 2) & 0x03];
		if (bitrate == null || rate == null) { position += 1; continue; }
		const padding = (buffer[position + 2] >> 1) & 0x01;
		const frameSamples = samplesPerFrame(version, layer);
		//Frame length in bytes, from the layer's own formula.
		const length = layer === 1
			? Math.floor((12 * bitrate * 1000 / rate + padding) * 4)
			: Math.floor(frameSamples / 8 * bitrate * 1000 / rate) + padding;
		if (length <= 4) { position += 1; continue; }
		samples += frameSamples;
		sampleRate = rate;
		position += length;
	}
	if (sampleRate == null || samples === 0) return null;
	return samples / sampleRate;
}

module.exports = { durationSeconds };
