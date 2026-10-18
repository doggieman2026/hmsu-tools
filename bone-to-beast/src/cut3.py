from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage
U='/root/.claude/uploads/e816e6ed-9838-5743-ba3e-8d1a26d3399e/'
JOBS=[('6f09d794',[],285,[[115,288,463,603,780,905],[115,290,435,575,735,905]],'m1'),
      ('d580416f',[(244,270),(502,530)],285,[[112,281,447,612,775,912],[110,272,450,582,745,920]],'m2')]
S=Image.new('RGB',(1300,300),(40,40,60));d=ImageDraw.Draw(S);j=0
for f,bands,split,cols,pre in JOBS:
  a=np.asarray(Image.open(U+f+'-image.jpg').convert('RGB')).astype(float)
  r,g,b=a[...,0],a[...,1],a[...,2];k=np.minimum(r-g,b-g);al=np.clip((120-k)/40,0,1)
  sp=np.clip(np.minimum(r,b)-g-25,0,None);a[...,0]-=sp*0.85;a[...,2]-=sp*0.85
  for y0,y1 in bands: al[y0:y1,:]=0
  op=ndimage.binary_opening(al>0.5);lab,n=ndimage.label(op);rgba=np.dstack([np.clip(a,0,255),al*255]).astype(np.uint8);groups={}
  for i,sl in enumerate(ndimage.find_objects(lab)):
    m=lab==i+1
    if m[sl].sum()<40:continue
    cy=(sl[0].start+sl[0].stop)/2;cx=(sl[1].start+sl[1].stop)/2;row=0 if cy<split else 1
    c=int(np.argmin([abs(cx-x) for x in cols[row]]));groups.setdefault((row,c),np.zeros(al.shape,bool));groups[(row,c)]|=m
  for (row,c) in sorted(groups):
    m=groups[(row,c)];ys,xs=np.nonzero(m);sl=(slice(ys.min(),ys.max()+1),slice(xs.min(),xs.max()+1))
    out=rgba[sl].copy();out[...,3]=np.where(m[sl],out[...,3],0);im=Image.fromarray(out);name=f'{pre}_{row}{c}';im.save(name+'.png')
    t=im.copy();t.thumbnail((95,120));S.paste(t,((j%12)*105,(j//12)*150+20),t);d.text(((j%12)*105,(j//12)*150),name,fill=(255,255,0));j+=1
S.save('m_sheet.png');print(j)
