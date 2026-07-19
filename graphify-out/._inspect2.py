import json
from pathlib import Path
from collections import Counter

r = json.loads(Path('graphify-out/.graphify_incremental.json').read_text(encoding='utf-8'))
new_files = r.get('new_files', {})

def category_for(p):
    pl = p.replace('\\', '/')
    if '/dist/' in pl or pl.endswith('(dist)'): return 'build output (dist)'
    if '/.agents/' in pl: return '.agents skills'
    if '/.claude/skills/' in pl or '/.claude/' in pl: return '.claude config/skills'
    if '/.continue/' in pl: return '.continue skills'
    if '/public/' in pl and p.lower().endswith(('.png','.jpg','.mp3','.wav')): return 'portfolio assets (public)'
    if '/src/' in pl: return 'portfolio source (src)'
    if pl.endswith(('firebase.json','firebase.json')): return 'firebase config'
    return 'other root'

cat = Counter(category_for(p) for files in new_files.values() for p in files)
print('=== Changed files by category ===')
for c, n in cat.most_common():
    print(f'  {c}: {n}')

print()
print('total_words (changed):', r.get('total_words', 0))
print('new_total:', r.get('new_total', 0))

# Check dist contents
docs = new_files.get('document', [])
dist_files = [p for p in docs if '(dist)' in p or '/dist/' in p]
print()
print('dist docs:', len(dist_files))
for p in dist_files[:5]:
    print('  ', p)
