"""Merge the new translation lines into the language files and drop entries whose
English source no longer appears anywhere in the site. Keys are sorted, so the
diff stays readable and a duplicate key is impossible."""
import io, os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    head, rows = [], {}
    for line in io.open(p, encoding='utf-8'):
        line = line.rstrip('\n').rstrip('\r')
        if not line:
            continue
        if line.startswith('#'):
            head.append(line)
            continue
        i = line.find('\t')
        if i < 1:
            continue
        rows[line[:i].strip()] = line[i + 1:].strip()
    return head, rows


live = set(io.open(os.path.join(ROOT, 'tools', 'keys-live.txt'), encoding='utf-8').read().split('\n'))

for code in ('nl', 'de'):
    p = os.path.join(ROOT, 'src', 'lang', code + '.tsv')
    head, rows = load(p)
    _, new = load(os.path.join(ROOT, 'tools', '_new-%s.tsv' % code))
    added = [k for k in new if k not in rows]
    rows.update(new)
    dropped = [k for k in rows if k not in live]
    for k in dropped:
        del rows[k]
    out = head + ['%s\t%s' % (k, rows[k]) for k in sorted(rows)]
    io.open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')
    print('%s: %d entries (+%d new, -%d stale)' % (code, len(rows), len(added), len(dropped)))
