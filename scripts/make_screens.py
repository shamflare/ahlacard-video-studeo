"""Prepare the real ahlacard.com screenshots for the ad:
- drop the phone browser bar,
- drop the 'bills not enabled' notice (bills) and the dimmed area above the sheet (more),
- keep the bottom navigation bar, output a uniform 1080x1740 screen per page,
- export cropped UI details used as pop-out callouts."""
from PIL import Image
RAW = "public/screens/raw/"; OUT = "public/screens/"
H = 1740

def compose(name, parts):
    src = Image.open(RAW + name + ".jpg").convert("RGB")
    out = Image.new("RGB", (1080, H), src.getpixel((20, 460)))
    y = 0
    for a, b in parts:
        piece = src.crop((0, a, 1080, b)); out.paste(piece, (0, y)); y += b - a
    assert abs(y - H) <= 2, (name, y)
    out.save(OUT + name + ".jpg", quality=95)
    return src

def nav(src):  # bottom navigation bar rows
    return (src.height - 154, src.height)

for name, body in {
    "mobile": [(126, 1712 - 126 + 126)],
    "orders": [(126, 1712)],
}.items():
    s = Image.open(RAW + name + ".jpg")
    n = nav(s); top_h = H - (n[1] - n[0])
    compose(name, [(126, 126 + top_h), n])
s = Image.open(RAW + "bills.jpg"); n = nav(s)
compose("bills", [(126, 482), (600, 600 + (H - 356 - (n[1] - n[0]))), n])
compose("more", [(126, 345), (477, 1998)])

# Pop-out details (from the raw screenshots)
crops = {
    "games-tiles": ("games", (36, 1125, 1044, 1600)),
    "games-head": ("games", (30, 905, 1050, 1095)),
    "games-stats": ("games", (30, 690, 1050, 858)),
    "mobile-input": ("mobile", (30, 495, 1050, 915)),
    "bills-cats": ("bills", (0, 620, 1080, 830)),
    "orders-card": ("orders", (36, 1160, 1044, 1530)),
    "orders-total": ("orders", (430, 1030, 1050, 1130)),
    "orders-tabs": ("orders", (30, 760, 1050, 1000)),
    "more-grid": ("more", (36, 1180, 1044, 1960)),
    "tile-8ball": ("games", (36, 1125, 358, 1600)),
    "tile-4fun": ("games", (380, 1125, 702, 1600)),
    "tile-pubg": ("games", (722, 1125, 1044, 1600)),
}
for k, (src, box) in crops.items():
    Image.open(RAW + src + ".jpg").convert("RGB").crop(box).save(OUT + k + ".jpg", quality=95)
print("done")
