import json
from pathlib import Path
from collections import Counter

r = json.loads(Path('graphify-out/.graphify_incremental.json').read_text(encoding='utf-8'))
new_files = r.get('new_files', {})

docs = new_files.get('document', [])
def firstparts(p):
    parts = p.replace('\\', '/').split('/')
    return '/'.join(parts[:2])

cnt = Counter(firstparts(p) for p in docs)
print('Top doc directories:')
for d, c in cnt.most_common(12):
    print(f'  {d}: {c}')

print()
print('Sample docs:')
for p in docs[:8]:
    print('  ', p)

code = new_files.get('code', [])
print()
print('Code sample:')
for p in code[:8]:
    print('  ', p)

print()
print('Video:', new_files.get('video', []))
print('Image:', [Path(p).name for p in new_files.get('image', [])][:12])
