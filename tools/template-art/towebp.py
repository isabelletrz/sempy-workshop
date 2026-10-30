import os, sys, glob
from PIL import Image
src='out'; dst='/home/claude/proj_extract/WORKSHOP/public/templates'
tot=0; n=0
for slug in sorted(os.listdir(src)):
    os.makedirs(f'{dst}/{slug}',exist_ok=True)
    for f in glob.glob(f'{dst}/{slug}/*.svg'): os.remove(f)
    for p in sorted(glob.glob(f'{src}/{slug}/*.png')):
        name=os.path.basename(p)[:-4]
        im=Image.open(p)
        out=f'{dst}/{slug}/{name}.webp'
        if name.endswith('-clear'):
            im.convert('RGBA').save(out,'WEBP',quality=88,method=5,alpha_quality=95)
        else:
            im.convert('RGB').save(out,'WEBP',quality=90,method=5)
        tot+=os.path.getsize(out); n+=1
print(n,'files',round(tot/1e6,1),'MB')
