# -*- coding: utf-8 -*-
import os
import sys

base = r'd:\project\LILOULOVE'
filepath = os.path.join(base, 'index.html')

with open(filepath, 'rb') as f:
    raw = f.read()

print(f'File size: {len(raw)}', file=sys.stderr)

# Try UTF-8
try:
    text = raw.decode('utf-8')
    print('UTF-8 OK', file=sys.stderr)
except:
    text = raw.decode('utf-8', errors='replace')
    print('UTF-8 with replace', file=sys.stderr)

# Check if emojis are present
has_emoji_heart = '?' in text
print(f'Has ?: {has_emoji_heart}', file=sys.stderr)

# Check specific positions
if 'deco-heart">?</span>' in text:
    print('Found deco-heart with ? placeholder', file=sys.stderr)

# Now do the fixes
replacements = {
    '<span class="deco-heart">?</span>': '<span class="deco-heart">?</span>',
    '<span class="deco-star">?</span>': '<span class="deco-star">?</span>',
    '<span class="avatar-emoji">?</span>': '<span class="avatar-emoji">?</span>',
    '<p class="login-subtitle">? 我们的秘密花园 ?</p>': '<p class="login-subtitle">? 我们的秘密花园 ?</p>',
    '<span class="password-icon">?</span>': '<span class="password-icon">?</span>',
    '<button id="loginBtn" class="login-btn">? 解锁 ?</button>': '<button id="loginBtn" class="login-btn">? 解锁 ?</button>',
    '<p id="loginError" class="login-error">? 密码不对哦，再试试～</p>': '<p id="loginError" class="login-error">? 密码不对哦，再试试～</p>',
    '<span>? 提示：她的生日 ?</span>': '<span>? 提示：她的生日 ?</span>',
}

for old, new in replacements.items():
    count = text.count(old)
    if count > 0:
        text = text.replace(old, new)
        print(f'Replaced: {old} -> {new}', file=sys.stderr)
    else:
        print(f'NOT FOUND: {old}', file=sys.stderr)

# Fix login flowers
old_flowers = '<div class="login-flowers">\n                    ? ? ? ? ? ?\n                </div>'
new_flowers = '<div class="login-flowers">\n                    ? ? ? ? ? ?\n                </div>'
if old_flowers in text:
    text = text.replace(old_flowers, new_flowers)
    print('Fixed login flowers', file=sys.stderr)
else:
    print('Login flowers pattern not found', file=sys.stderr)

# Write back
with open(filepath, 'wb') as f:
    f.write(text.encode('utf-8'))

print('File written successfully', file=sys.stderr)
