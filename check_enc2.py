with open('d:\\project\\LILOULOVE\\index.html', 'rb') as f:
    raw = f.read()

lines = []
lines.append(f'File size: {len(raw)}')
lines.append(f'Has BOM: {raw[:3] == b"\xef\xbb\xbf"}')

# Check specific emoji bytes
emojis = {
    '?': b'\xf0\x9f\x92\x95',
    '?': b'\xf0\x9f\x8c\xb8',
    '?': b'\xe2\x9d\xa4',
    '?': b'\xf0\x9f\x8e\x82',
    '?': b'\xf0\x9f\x94\x90',
    '?': b'\xf0\x9f\x93\xb8',
}
for name, byte_seq in emojis.items():
    lines.append(f'Has {name}: {byte_seq in raw}')

# Check what bytes are in login-decoration area
idx = raw.find(b'deco-heart')
if idx > 0:
    lines.append(f'\nBytes around deco-heart (offset {idx}):')
    chunk = raw[idx:idx+30]
    lines.append(f'Raw: {chunk}')
    lines.append(f'Hex: {chunk.hex()}')

with open('d:\\project\\LILOULOVE\\encoding_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Report written to encoding_report.txt')
