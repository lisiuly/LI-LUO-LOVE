# -*- coding: utf-8 -*-
with open('d:\\project\\LILOULOVE\\index.html', 'rb') as f:
    raw = f.read()
print('File size:', len(raw))
print('Has BOM (UTF-8):', raw[:3] == b'\xef\xbb\xbf')
print('Has ? (F0 9F 92 95):', b'\xf0\x9f\x92\x95' in raw)
print('Has ? (F0 9F 8C B8):', b'\xf0\x9f\x8c\xb8' in raw)
print('Has ? (E2 9D A4):', b'\xe2\x9d\xa4' in raw)
print('Has ? (F0 9F 8E 82):', b'\xf0\x9f\x8e\x82' in raw)

# Check if the file has proper UTF-8 encoding
try:
    text = raw.decode('utf-8')
    print('UTF-8 decode: OK')
    # Check for replacement characters
    count_replace = text.count('\ufffd')
    print('Replacement characters (?):', count_replace)
except:
    print('UTF-8 decode: FAILED')
    
# Check specific section
idx = raw.find(b'<div class="login-decoration">')
if idx > 0:
    print('\nLogin decoration section (raw bytes):')
    # Show hex of the emoji area
    section = raw[idx:idx+150]
    print(section)
    print('\nHex:')
    print(section.hex())
