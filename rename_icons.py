# -*- coding: utf-8 -*-
"""Rename line dog icons with meaningful names based on content"""
import os
import shutil

base = r'd:\project\LILOULOVE\images\icons'

# Map old filename -> new meaningful name
rename_map = {
    # Yellow dog holding cake
    '01def663b6f249968f2b31fef83c3a69.png': 'dog-cake.png',
    # White dog holding red heart
    '062afa0a9e7e45b2b524e8d3c285ba08.png': 'bear-heart.png',
    # Yellow dog with flower crown & blue dress
    '13e76e733bf044a1a43d7910689696bb.png': 'dog-flower-dress.png',
    # Yellow dog waiter with coffee
    '167c15f6dd5649a2bd2c11bc57f3bf85.png': 'dog-waiter.png',
    # Both dogs in coffee cup
    '184eb9ce22b340aeb172f87e6500bc53.png': 'couple-coffee.png',
    # Yellow dog bunny ears + cotton candy
    '1a0fdca9f3b740a5bb478338b8a2867c.png': 'dog-bunny-candy.png',
    # White dog heart in hands (pink hearts)
    '1b198185f6374a99b0477314d4a2b518.png': 'bear-heart-hands.png',
    # Yellow dog hand hearts
    '1e161ab6a4174d60a138bf98006746e0.png': 'dog-heart-hands.png',
    # White dog balloons
    '1e161ab6a4174d60a138bf98006746e0 (1).png': 'bear-balloons.png',
    # White dog graduation
    '1e460c7c187949d196be8e272febbddc.png': 'bear-graduation.png',
    # White dog hugging yellow dog
    '256b0b3b08994bf7924d90abae57e78c.png': 'couple-hug.png',
    # White dog holding yellow flower
    '2694070d8fed48cd91b7af1bef431627.png': 'bear-flower-gift.png',
    # Yellow dog drinking bubble tea
    '2bf16c1237a545468a415e8e9f6d8311.png': 'dog-bubble-tea.png',
    # White dog jumping toward yellow dog
    '3b922b73f6314bc7a327c8c17b9a623e.png': 'couple-jump.png',
    # Yellow dog sweating heart tail
    '3ed38fe8731c42058a922e97c0014a6a.png': 'dog-lovesick.png',
    # White dog holding red heart
    '4a8d7f005f7346f3bd17aeb3124c003c.png': 'bear-heart-2.png',
    # Yellow dog love potion
    '4f057732d731428bbf4af96a916e407a.png': 'dog-love-potion.png',
    # White dog cupid bow
    '4f79f33216ec440984d40fa22e5f55af.png': 'bear-cupid.png',
    # White dog waving
    '639f0cd7b695499e80366ab9a0512820.png': 'bear-wave.png',
    # White dog star suit wine
    '6a6380774bd94fb2b9c8759a2cffad85.png': 'bear-star-wine.png',
    # White dog cupid bow 2
    '6c04474df9a245499c603a5117d62836.png': 'bear-cupid-2.png',
    # White dog running
    '6feaa2d3ec5e413b8762f294ff601bf7.png': 'bear-running.png',
    # White dog action lines
    '70413328c0c943ed9b7971c78c105a80.png': 'bear-action.png',
    # White dog barista
    '8503c8278ece4a849d8b3eaedd80b710.png': 'bear-barista.png',
    # White dog red heart again
    '88209427ab874a1ebfe951bff0013a3f.png': 'bear-heart-3.png',
    # White dog star book
    '8d9f2efaa68f4c5486765f9a54db23b7.png': 'bear-star-book.png',
    # White dog flower skirt
    '90c8ee71db9a407a83e2b40fd1df7b06.png': 'bear-flower-skirt.png',
    # Yellow dog brown dessert
    'a3aff4ca426c440e832531b6b08d8ee4.png': 'dog-dessert.png',
    # White dog life rings
    'ac383ca4b85346a6afbe8d29cbd96fec.png': 'bear-life-rings.png',
    # White dog cow hat tea
    'b1abebc07f8943aeb8064da78df44604.png': 'bear-cow-tea.png',
    # White dog mid-jump
    'b8a7afd7e82e468283dd88179c0ecf2c.png': 'bear-jump.png',
    # White dog pudding hat dessert
    'bb830029106f474d8d1443413bbe0fa2.png': 'bear-pudding.png',
    # Yellow dog star jacket wine
    'cf06caff383b456eabaa2fc1c0343e1f.png': 'dog-star-wine.png',
    # Couple sitting with big heart
    'd1995eade6184e4a9e744fc4c9c9c076.png': 'couple-sit-heart.png',
    # Yellow dog party hat
    'd31ed76b5c07400d9aca15489f9f4a76.png': 'dog-party-hat.png',
    # White dog lying flat
    'd386b9c6da984824b6b73dc0d77e47ab.png': 'bear-lying.png',
    # Yellow dog comforting white dog
    'ded629df182e458fafa8176cb16b0f84.png': 'couple-comfort.png',
    # White dog bunny ears balloons
    'e954ddb4b60d468e855e67d9f609b495.png': 'bear-bunny-balloons.png',
    # White dog bunny ears balloons duplicate
    'e954ddb4b60d468e855e67d9f609b495 (1).png': 'bear-bunny-2.png',
    # White dog red bow tie dancing
    'ee6abda1832b48a9bb2de79f35c54d77.png': 'bear-dancing.png',
    # Couple comfort variant
    'f121a4571532425fadefe3fee2ec6dcc.png': 'couple-comfort-2.png',
    # Bear wave variant
    'f381ba1b375f4a3e9e133a05b54b7eff.png': 'bear-wave-2.png',
}

# Do the rename
renamed = 0
for old_name, new_name in rename_map.items():
    old_path = os.path.join(base, old_name)
    new_path = os.path.join(base, new_name)
    if os.path.exists(old_path):
        if not os.path.exists(new_path):
            os.rename(old_path, new_path)
            renamed += 1
            print(f'Renamed: {old_name[:20]}... -> {new_name}')
        else:
            print(f'Skip (exists): {new_name}')
    else:
        print(f'NOT FOUND: {old_name}')

print(f'\nTotal renamed: {renamed}')

# List remaining files
print('\nFiles in directory:')
for f in sorted(os.listdir(base)):
    print(f'  {f}')
