import json
from pathlib import Path

r = json.loads(Path('graphify-out/.graphify_incremental.json').read_text(encoding='utf-8'))
new_files = r.get('new_files', {})

ROOT = str(Path('.').resolve()).replace('\\', '/').lower() + '/'

def rel(p):
    return p.replace('\\', '/').lower()

def is_excluded(p):
    pl = rel(p)
    if '(dist)' in pl or '/dist/' in pl:
        return True
    if '/.agents/' in pl or '/.claude/' in pl or '/.continue/' in pl:
        return True
    if pl.endswith('.mp3'):
        return True
    return False

def is_included(p):
    pl = rel(p)
    if is_excluded(p):
        return False
    # under src/ or public/
    if '/src/' in pl or pl.endswith('/src') or '\\src' in p.lower():
        return True
    if '/public/' in pl:
        return True
    # root-level portfolio files (depth 1)
    rest = pl[len(ROOT):] if pl.startswith(ROOT) else pl
    parts = rest.split('/')
    if len(parts) >= 1 and parts[0]:
        name = parts[0].lower()
        if name.endswith(('.md', '.json', '.html', '.txt', '.yaml', '.yml', '.css')):
            return True
    return False

filtered = {}
total = 0
kept_examples = []
for cat, files in new_files.items():
    kept = [f for f in files if is_included(f)]
    if kept:
        filtered[cat] = kept
        total += len(kept)
        kept_examples.extend(kept[:3])

# Word count of filtered files
total_words = 0
for cat, files in filtered.items():
    for f in files:
        fp = Path(f)
        if fp.exists():
            try:
                txt = fp.read_text(encoding='utf-8', errors='ignore')
                total_words += len(txt.split())
            except Exception:
                pass

Path('graphify-out/.graphify_detect.json').write_text(json.dumps({
    'files': filtered,
    'all_files': r.get('files', {}),
    'total_files': total,
    'total_words': total_words,
    'skipped_sensitive': r.get('skipped_sensitive', []),
    'needs_graph': True,
}, ensure_ascii=False), encoding='utf-8')

print('Filtered total files:', total)
print('Filtered total_words:', total_words)
print('Categories:')
for cat, files in filtered.items():
    print(f'  {cat}: {len(files)}')
print('Examples:')
for e in kept_examples[:10]:
    print('  ', e)
