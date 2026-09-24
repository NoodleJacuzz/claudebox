"""Builds system/ui/scrapbook at the same size as logbook/inventory/trophies."""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SIZE = (138, 158)
WEBP = os.path.join(ROOT, "images-webp", "system", "ui")
PNG = os.path.join(ROOT, "images-png", "system", "ui")

def load(rel):
    path = os.path.join(ROOT, "images-webp", rel)
    return Image.open(path).convert("RGBA")

def rounded(image, radius):
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.size[0] - 1, image.size[1] - 1), radius, fill=255)
    out = image.copy()
    out.putalpha(mask)
    return out

def polaroid(photo, box):
    inner = photo.resize(box, Image.LANCZOS)
    frame = Image.new("RGBA", (box[0] + 8, box[1] + 14), (250, 246, 236, 255))
    frame.paste(inner, (4, 4))
    return frame

book = load(os.path.join("system", "ui", "logbook.webp")).resize(SIZE, Image.LANCZOS)
book = ImageEnhance.Color(book).enhance(0.85)
book = ImageEnhance.Brightness(book).enhance(0.92)

canvas = Image.new("RGBA", SIZE, (0, 0, 0, 0))
canvas.paste(book, (0, 0), book)

photo_a = load(os.path.join("intro", "clothed", "happy.webp")).crop((80, 20, 280, 220))
photo_b = load(os.path.join("tink", "clothed", "happy.webp")).crop((80, 20, 280, 220))
card_a = polaroid(photo_a, (54, 54)).rotate(11, resample=Image.BICUBIC, expand=True)
card_b = polaroid(photo_b, (50, 50)).rotate(-8, resample=Image.BICUBIC, expand=True)

shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rectangle((18, 28, 92, 108), fill=(40, 24, 16, 70))
sdraw.rectangle((48, 48, 120, 128), fill=(40, 24, 16, 55))
shadow = shadow.filter(ImageFilter.GaussianBlur(3))
canvas = Image.alpha_composite(canvas, shadow)
canvas.paste(card_a, (14, 22), card_a)
canvas.paste(card_b, (46, 46), card_b)

tape = Image.new("RGBA", SIZE, (0, 0, 0, 0))
ImageDraw.Draw(tape).rectangle((58, 18, 78, 28), fill=(214, 176, 92, 180))
canvas = Image.alpha_composite(canvas, tape)

os.makedirs(WEBP, exist_ok=True)
os.makedirs(PNG, exist_ok=True)
canvas.save(os.path.join(WEBP, "scrapbook.webp"), "WEBP", quality=90, method=6)
canvas.save(os.path.join(PNG, "scrapbook.png"), "PNG")
print("wrote", SIZE, "scrapbook.webp / scrapbook.png")
