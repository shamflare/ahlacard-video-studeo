"""Remove the white background from the AhlaCard logo -> transparent PNG."""
import numpy as np
from PIL import Image
src = np.asarray(Image.open("public/brand/logo-original.jpg").convert("RGB")).astype(np.float32)
mn = src.min(axis=2)
a = np.clip((250.0 - mn) / 40.0, 0, 1)          # near-white -> transparent
safe = np.maximum(a, 1e-3)[..., None]
rgb = np.clip((src - 255.0 * (1 - a[..., None])) / safe, 0, 255)   # un-blend from white
out = np.dstack([rgb, a * 255]).astype(np.uint8)
im = Image.fromarray(out, "RGBA")
im = im.crop(im.getbbox())
im.save("public/brand/logo.png")
print(im.size)
