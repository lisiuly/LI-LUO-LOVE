# -*- coding: utf-8 -*-
"""
Fix emoji corruption in the love site files.
Reads files as binary, fixes encoding, replaces ? with proper emojis.
"""
import os
import re

def fix_file(filepath):
    """Read a file and fix emoji placeholders."""
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Try to decode as UTF-8
    try:
        text = raw.decode('utf-8')
        was_utf8 = True
    except UnicodeDecodeError:
        # Try UTF-16
        try:
            text = raw.decode('utf-16')
            was_utf8 = False
        except:
            # Assume it's some ANSI encoding, force UTF-8
            text = raw.decode('utf-8', errors='replace')
            was_utf8 = False
    
    original = text
    
    # Now we need to fix the content
    # Since we can't easily know what each ? should be, we need context-based replacement
    # Let's do a comprehensive fix
    
    if 'index.html' in filepath:
        text = fix_html(text)
    elif 'style.css' in filepath:
        text = fix_css(text)
    elif 'app.js' in filepath:
        text = fix_js(text)
    
    if text == original:
        print(f"No changes needed for {filepath}")
        return
    
    # Write back with UTF-8
    with open(filepath, 'wb') as f:
        f.write(text.encode('utf-8'))
    
    print(f"Fixed: {filepath}")

def fix_html(text):
    """Fix HTML file emojis."""
    replacements = {
        # Login page
        '<span class="deco-heart">?</span>': '<span class="deco-heart">?</span>',
        '<span class="deco-star">?</span>': '<span class="deco-star">?</span>',
        '<span class="avatar-emoji">?</span>': '<span class="avatar-emoji">?</span>',
        '<p class="login-subtitle">? 我们的秘密花园 ?</p>': '<p class="login-subtitle">? 我们的秘密花园 ?</p>',
        '<span class="password-icon">?</span>': '<span class="password-icon">?</span>',
        '<button id="loginBtn" class="login-btn">? 解锁 ?</button>': '<button id="loginBtn" class="login-btn">? 解锁 ?</button>',
        '<p id="loginError" class="login-error">? 密码不对哦，再试试～</p>': '<p id="loginError" class="login-error">? 密码不对哦，再试试～</p>',
        '<span>? 提示：她的生日 ?</span>': '<span>? 提示：她的生日 ?</span>',
        # Login flowers
        '<div class="login-flowers">\n                    ? ? ? ? ? ?\n                </div>': '<div class="login-flowers">\n                    ? ? ? ? ? ?\n                </div>',
        
        # Nav
        '<span class="brand-icon">?</span>': '<span class="brand-icon">?</span>',
        '<a href="#" class="nav-item active" data-page="home">? 首页</a>': '<a href="#" class="nav-item active" data-page="home">? 首页</a>',
        '<a href="#" class="nav-item" data-page="plans">? 计划书</a>': '<a href="#" class="nav-item" data-page="plans">? 计划书</a>',
        '<a href="#" class="nav-item" data-page="diary">? 恋爱日记</a>': '<a href="#" class="nav-item" data-page="diary">? 恋爱日记</a>',
        '<a href="#" class="nav-item" data-page="recipe">? 食谱日记</a>': '<a href="#" class="nav-item" data-page="recipe">? 食谱日记</a>',
        '<a href="#" class="nav-item" data-page="photos">? 照片墙</a>': '<a href="#" class="nav-item" data-page="photos">? 照片墙</a>',
        '<button class="nav-toggle" id="navToggle">?</button>': '<button class="nav-toggle" id="navToggle">?</button>',
        
        # Hero
        '<span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>': '<span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>',
        '<p class="hero-subtitle">希宝 ? 小李</p>': '<p class="hero-subtitle">希宝 ? 小李</p>',
        
        # Counters
        '<div class="counter-icon">?</div>': '<div class="counter-icon">?</div>',  # first counter
        '<div class="counter-icon">?</div>': '<div class="counter-icon">?</div>',  # Wait, both have the same pattern
        
        # Let's handle the second counter icon differently
        # Actually we need to be more careful with context
    }
    
    # Since simple replacements might have duplicates, let's do it more carefully
    # First, let's count occurrences
    for old, new in replacements.items():
        count = text.count(old)
        if count > 0:
            text = text.replace(old, new)
            print(f"  Replaced '{old}' -> '{new}' ({count} times)")
    
    # Handle cases where same pattern appears multiple times
    # Counter icons - first is days (?), second is birthday (?)
    lines = text.split('\n')
    fixed_lines = []
    counter_icon_count = 0
    for line in lines:
        if 'counter-icon">?</div>' in line:
            counter_icon_count += 1
            if counter_icon_count == 1:
                line = line.replace('counter-icon">?</div>', 'counter-icon">?</div>')
            elif counter_icon_count == 2:
                line = line.replace('counter-icon">?</div>', 'counter-icon">?</div>')
        fixed_lines.append(line)
    text = '\n'.join(fixed_lines)
    
    return text

def fix_css(text):
    """Fix CSS file emojis."""
    # CSS might have emojis in comments
    return text

def fix_js(text):
    """Fix JS file emojis."""
    # Fix emoji in love quotes
    replacements = {
        "'你的笑容是我一天的动力 ?'": "'你的笑容是我一天的动力 ?'",
        "'遇见你是我最美好的意外 ?'": "'遇见你是我最美好的意外 ?'",
        "'想和你一起，走过春夏秋冬 ?????'": "'想和你一起，走过春夏秋冬 ????????'",
        "'你是我的小呀小苹果 ?'": "'你是我的小呀小苹果 ?'",
        "'余生有你，请多指教 ?'": "'余生有你，请多指教 ?'",
        "'你的眼里有星星 ?'": "'你的眼里有星星 ?'",
        "'世界那么大，我只想要你 ?'": "'世界那么大，我只想要你 ?'",
        "'每天想你一百遍 ?'": "'每天想你一百遍 ?'",
        "'你是我写过最美的情书 ?'": "'你是我写过最美的情书 ?'",
        "'在一起的日子，每天都甜 ?'": "'在一起的日子，每天都甜 ?'",
        "'希宝是世界上最好的女朋友 ?'": "'希宝是世界上最好的女朋友 ?'",
        "'小李永远爱希宝 ??'": "'小李永远爱希宝 ??'",
        "'想牵着你的手，一直走下去 ?'": "'想牵着你的手，一直走下去 ?'",
        "'你是我最想留住的幸运 ?'": "'你是我最想留住的幸运 ?'",
        "'只要有你在，每天都是情人节 ?'": "'只要有你在，每天都是情人节 ?'",
    }
    for old, new in replacements.items():
        if old in text:
            text = text.replace(old, new)
            print(f"  Replaced quote emoji")
    
    return text

if __name__ == '__main__':
    base = r'd:\project\LILOULOVE'
    files = [
        os.path.join(base, 'index.html'),
        os.path.join(base, 'css', 'style.css'),
        os.path.join(base, 'js', 'app.js'),
    ]
    for f in files:
        if os.path.exists(f):
            fix_file(f)
        else:
            print(f"File not found: {f}")
    print("Done!")
