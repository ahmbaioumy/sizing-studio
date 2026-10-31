from pathlib import Path
root=Path(__file__).parent
css=(root/'src/styles.css').read_text()
js='\n'.join((root/'src'/name).read_text() for name in ['engine.js','ui.js','main.js'])
html=f'''<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none';"><title>Sizing Studio — Offline Workforce Intelligence</title><style>{css}</style></head><body><noscript>This offline application requires JavaScript enabled.</noscript><script>{js}</script></body></html>'''
out=root/'dist/sizing-studio.html';out.write_text(html,encoding='utf-8');print(f'Built {out} ({len(html):,} bytes)')
