import os, tempfile
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

tmp = tempfile.gettempdir()
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 33 156 105" width="330" height="222">
  <rect x="22" y="33" width="156" height="105" fill="#0b1020"/>
  <line x1="109.8" y1="70.1" x2="129" y2="99.9" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round"/>
  <line x1="124" y1="120" x2="82" y2="120" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round"/>
  <line x1="67.8" y1="104.9" x2="87" y2="75.1" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round"/>
  <text x="100" y="62" text-anchor="middle" font-size="22" fill="#fff" font-family="sans-serif">F</text>
  <text x="142" y="127" text-anchor="middle" font-size="24" fill="#fff" font-family="sans-serif">G</text>
  <text x="58" y="127" text-anchor="middle" font-size="24" fill="#fff" font-family="sans-serif">W</text>
</svg>'''

sp = os.path.join(tmp,'current.svg'); pp = os.path.join(tmp,'current.png')
with open(sp,'w') as f: f.write(svg)
drawing = svg2rlg(sp)
drawing.scale(2,2)
renderPM.drawToFile(drawing, pp, fmt='PNG')
print("rendered", pp)
