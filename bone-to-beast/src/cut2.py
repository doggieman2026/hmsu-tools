from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage
U='/root/.claude/uploads/e816e6ed-9838-5743-ba3e-8d1a26d3399e/'
JOBS=[('64f19c1b',[(248,280),(508,545)],[[67,175,316,437,603,746,912],[62,175,313,446,596,757,894]],'n1'),
      ('db07b625',[(228,282),(505,545)],[[63,192,321,446,617,771,927],[70,190,344,489,615,764,902]],'n2')]
S=Image.new('RGB',(1400,420),(40,40,60));d=ImageDraw.Draw(S);j=0
for f,bands,cols,pre in JOBS:
  a=np.asarray(Image.open(U+f+'-image.jpg').convert('RGB')).astype(float)
  r,g,b=a[...,0],a[...,1],a[...,2];k=np.minimum(r-g,b-g);al=np.clip((120-k)/40,0,1)
  sp=np.clip(np.minimum(r,b)-g-25,0,None);a[...,0]-=sp*0.85;a[...,2]-=sp*0.85
  for y0,y1 in bands: al[y0:y1,:]=0
  op=ndimage.binary_opening(al>0.5);lab,n=ndimage.label(op)
  rgba=np.dstack([np.clip(a,0,255),al*255]).astype(np.uint8)
  groups={}
  for i,sl in enumerate(ndimage.find_objects(lab)):
    m=lab==i+1;area=m[sl].sum()
    if area<40:continue
    cy=(sl[0].start+sl[0].stop)/2;cx=(sl[1].start+sl[1].stop)/2;row=0 if cy<(bands[0][0]+20) else 1
    c=int(np.argmin([abs(cx-x) for x in cols[row]]));groups.setdefault((row,c),np.zeros(al.shape,bool));groups[(row,c)]|=m
  for (row,c) in sorted(groups):
    m=groups[(row,c)];ys,xs=np.nonzero(m);sl=(slice(ys.min(),ys.max()+1),slice(xs.min(),xs.max()+1))
    out=rgba[sl].copy();out[...,3]=np.where(m[sl],out[...,3],0);im=Image.fromarray(out);name=f'{pre}_{row}{c}';im.save(name+'.png')
    t=im.copy();t.thumbnail((90,110));S.paste(t,((j%14)*100,(j//14)*200+20),t);d.text(((j%14)*100,(j//14)*200),name,fill=(255,255,0));j+=1
S.save('n_sheet.png');print(j)
