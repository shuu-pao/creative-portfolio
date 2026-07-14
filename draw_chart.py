import os, tempfile
from PIL import Image, ImageDraw

tmp = tempfile.gettempdir()
scale = 3
ox, oy = 40, 40  # margin
W = 156*scale + 80
H = 105*scale + 80

def px(x): return int((x-22)*scale + ox)
def py(y): return int((y-33)*scale + oy)

img = Image.new('RGB', (W,H), (8,12,28))
d = ImageDraw.Draw(img)

# emoji glyph boxes (fontSize 24 -> half ~13; glyph from baseline-24 to baseline+3)
boxes = {'Fire':(100,55),'Grass':(142,120),'Water':(58,120)}
for name,(cx,cy) in boxes.items():
    x0,x1 = px(cx-13), px(cx+13)
    y0,y1 = py(cy-24), py(cy+3)
    d.rectangle([x0,y0,x1,y1], outline=(120,120,120), width=2)

# arrows (computed via arrowGeometry)
lines = [
  ((109.8,70.1),(129,99.9)),     # Fire->Grass
  ((124,120),(82,120)),            # Grass->Water  <-- the one reported missing
  ((67.8,104.9),(87,75.1)),      # Water->Fire
]
colors = [(125,211,252),(255,214,10),(125,211,252)]  # highlight Grass->Water in yellow
for (a,b),c in zip(lines,colors):
    d.line([px(a[0]),py(a[1]),px(b[0]),py(b[1])], fill=c, width=6)

# labels
for name,(cx,cy) in boxes.items():
    d.text((px(cx)-6, py(cy)-30), name[0], fill=(255,255,255))

img.save(os.path.join(tmp,'chart_current.png'))
print("saved", os.path.join(tmp,'chart_current.png'))
