from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage
U='/root/.claude/uploads/e816e6ed-9838-5743-ba3e-8d1a26d3399e/'
files=['63704288','83d7f57f','1bb42bb9','8bb68958','d6033c7e','32796336','27b31f06','b44172d2','4a4a05ae','e3b844a9','cc82183b','aea4885d','8e3b7309','87e3a441','4132ad57','7b3b209c']
sheet=[]
for i,f in enumerate(files):
  a=np.asarray(Image.open(U+f+'-image.jpg').convert('RGB')).astype(int)
  r,g,b=a[...,0],a[...,1],a[...,2]
  k=np.minimum(r-g,b-g)
  al=np.clip((150-k)/45,0,1)
  op=al>0.5
  op=ndimage.binary_opening(op,iterations=1)
  lab,n=ndimage.label(ndimage.binary_dilation(op,iterations=2))
  objs=ndimage.find_objects(lab)
  rgba=np.dstack([a,(al*255)]).astype(np.uint8)
  # despill partially keyed
  part=(al<1)&(al>0)
  rgba[part,0]=np.minimum(rgba[part,0],rgba[part,1]+40);rgba[part,2]=np.minimum(rgba[part,2],rgba[part,1]+40)
  j=0
  for li,sl in enumerate(objs):
    h=sl[0].stop-sl[0].start;w=sl[1].stop-sl[1].start
    if h*w<1500: continue
    m=(lab[sl]==li+1)
    c=rgba[sl].copy();c[...,3]=np.where(m,c[...,3],0)
    im=Image.fromarray(c);name=f'{i:02d}_{j}';im.save(name+'.png');sheet.append((name,im,(sl[1].start,sl[0].start)));j+=1
# contact sheet
W=1600;x=y=0;rowh=0;S=Image.new('RGB',(W,4000),(40,40,60));d=ImageDraw.Draw(S)
for name,im,pos in sheet:
  t=im.copy();t.thumbnail((180,180))
  if x+190>W:x=0;y+=rowh+20;rowh=0
  S.paste(t,(x,y+14),t);d.text((x,y),name+str(pos),fill=(255,255,0));x+=190;rowh=max(rowh,t.size[1]+14)
S.crop((0,0,W,y+rowh+20)).save('sheet.png');print(len(sheet))
