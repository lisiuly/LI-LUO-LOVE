with open('d:\\project\\LILOULOVE\\index.html', 'rb') as f:
    raw = f.read()

# Find positions around login decoration
idx = raw.find(b'login-decoration')
if idx > 0:
    # Get 100 bytes before and after
    start = max(0, idx - 50)
    end = min(len(raw), idx + 200)
    chunk = raw[start:end]
    print("Hex dump around login-decoration:")
    for i in range(0, len(chunk), 16):
        hex_part = ' '.join(f'{b:02x}' for b in chunk[i:i+16])
        ascii_part = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk[i:i+16])
        print(f'{start+i:06x}: {hex_part:<48s} {ascii_part}')
