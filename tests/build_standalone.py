#!/usr/bin/env python3
"""Rebuild open-directly.html (works from file:// without a server) from index.html + css + js modules."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
ORDER = ['data', 'krathong', 'river', 'audio', 'storage', 'extras', 'more', 'app']
def wrap(name):
    src = (root / 'js' / f'{name}.js').read_text(encoding='utf-8')
    exports = []
    def imp(m):
        return f"const {{{m.group(1)}}}=__m['{m.group(2)}'];"
    src = re.sub(r"import\s*\{([^}]*)\}\s*from\s*'\./(\w+)\.js';?", imp, src)
    def exp(m):
        exports.append(m.group(2)); return f"{m.group(1)} {m.group(2)}"
    src = re.sub(r"export\s+((?:async\s+)?(?:const|function|class))\s+(\w+)", exp, src)
    return f"__m['{name}']=(()=>{{\n{src}\nreturn {{{','.join(exports)}}};\n}})();"
bundle = "const __m={};\n" + "\n".join(wrap(n) for n in ORDER)
html = (root / 'index.html').read_text(encoding='utf-8')
css = ''.join((root / 'css' / f).read_text(encoding='utf-8') for f in ('styles.css', 'enhance.css'))
html = re.sub(r'<link rel="stylesheet" href="css/styles.css" />\s*<link rel="stylesheet" href="css/enhance.css" />', lambda m: f'<style>\n{css}\n</style>', html)
html = html.replace('<script type="module" src="js/app.js"></script>', f'<script>\n{bundle}\n</script>')
html = html.replace('<link rel="manifest" href="manifest.webmanifest" />\n  ', '')
(root / 'open-directly.html').write_text(html, encoding='utf-8')
print('open-directly.html', len(html), 'bytes')
