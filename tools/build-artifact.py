"""Monta o arquivo único publicado no claude.ai (página + visual + figuras + app, sem a rotina inicial)."""
import re, sys
root = sys.argv[1] if len(sys.argv) > 1 else '.'
out = sys.argv[2]
s = open(f'{root}/index.html').read()
head = s[s.index('<head>') + 6:s.index('</head>')]
body = s[s.index('<body>') + 6:s.index('</body>')]
head = '\n'.join(l for l in head.splitlines() if not re.search(r'<meta |rel="manifest"|rel="icon"|apple-touch-icon|href="styles.css"', l))
title = re.search(r'<title>.*?</title>', head).group(0)
head = head.replace(title, '')
css = open(f'{root}/styles.css').read()
icons = open(f'{root}/icons.js').read()
app = open(f'{root}/app.js').read()
body = (body.replace('<script src="icons.js"></script>', '<script>\n' + icons + '\n</script>')
        .replace('<script src="seed.js"></script>\n', '')
        .replace('<script src="app.js"></script>', '<script>\n' + app + '\n</script>'))
assert 'src="app.js"' not in body and 'src="seed.js"' not in body
open(out, 'w').write(title + '\n' + head.strip() + '\n<style>\n' + css + '</style>\n' + body)
