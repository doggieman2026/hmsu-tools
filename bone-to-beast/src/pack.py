from PIL import Image
import numpy as np, json
from scipy import ndimage
M={'skSkull':'00_0','skUpper':'00_1','skRibs':'00_2','skFore':'00_3','skThigh':'00_4','skPelvis':'00_5','skShin':'00_6','skClub':'00_7',
'gbHead':'01_0','gbFore':'01_2','gbTorso':'01_3','gbShin':'01_5','gbKnife':'01_6',
'bsHead':'02_0','bsFrontU':'02_1','bsFrontL':'02_2','bsFull':'02_3','bsTail':'02_4','bsBackU':'02_5','bsBackL':'02_6',
'slTall':'03_0','slRest':'03_1','slFlat':'03_2',
'wolfHead':'04_0','eWolf':'04_1','wolfArm':'04_2','wolfLeg':'04_3',
'batHead':'05_0','eBat':'05_1','batWing':'05_2',
'eGolem':'06_0','golemFist':'06_1','golemCore':'06_2','eGoblin':'07_0','goblinArm':'07_1','eSlime':'08_0','slimeCore':'08_1',
'plantHead':'09_0','ePlant':'09_1','plantVine':'09_2','plantRoots':'09_3','drakeHead':'10_0','eDrake':'10_1','fire':'10_2','drakeScales':'10_3',
'uDragon':'11_0','uVampire':'12_0','uOrichalcum':'13_0','uTree':'14_0','uChimera':'15_0'}

NEW={'stSprout':'n1_00','fPlPetal':'n1_01','fPlWarden':'n1_02','fPlRoot':'n1_03','fPlTreant':'n1_04','fPlShade':'n1_05','fPlBloom':'n1_06',
'stBat':'n1_10','fBtFairy':'n1_11','fBtMonarch':'n1_12','fBtGarg':'n1_13','fBtFiend':'n1_14','fBtBlood':'n1_15','fBtLord':'n1_16',
'stHatch':'n2_00','fDrForest':'n2_01','fDrEmerald':'n2_02','fDrRock':'n2_03','fDrEarth':'n2_04','fDrBlack':'n2_05','fDrShadow':'n2_06',
'stPebble':'n2_10','fGlMoss':'n2_11','fGlTree':'n2_12','fGlIron':'n2_13','fGlOri':'n2_14','fGlObs':'n2_15','fGlRune':'n2_16'}
M.update(NEW)

MID={'fmSlBloom':'m1_00','fmSlIron':'m1_01','fmSlGhost':'m1_02','fmSkSpear':'m1_03','fmSkHeavy':'m1_04','fmSkCount':'m1_05','fmGbArcher':'m1_10','fmGbGeneral':'m1_11','fmGbSorc':'m1_12','fmBsWolf':'m1_13','fmBsLion':'m1_14','fmBsDrag':'m1_15',
'fmPlPriest':'m2_00','fmPlWarrior':'m2_01','fmPlQueen':'m2_02','fmBtButter':'m2_03','fmBtGarg':'m2_04','fmBtVamp':'m2_05','fmDrYoung':'m2_10','fmDrRock':'m2_11','fmDrBlack':'m2_12','fmGlMoss':'m2_13','fmGlSteel':'m2_14','fmGlAmethyst':'m2_15'}
M.update(MID)
SC=0.5
ims={}
EV=['fSlGrass','fSlRock','fSlZombie','fSlDeath','fSkMoss','fSkWraith','fSkKnight','fSkSteel','fSkVamp',None,'fGbForest','fGbDruid','fGbHob','fGbKing','fGbShaman','fGbDemon','fBsForest','fBsSacred','fBsRock','fBsFire']
for i,k in enumerate(EV):
  if k: M[k]='ev_%02d'%i
for k,f in M.items():
  im=Image.open(f+'.png');a=np.array(im)
  m=a[...,3]>128;m2=ndimage.binary_erosion(m,iterations=1)
  a[...,3]=np.where(m2,a[...,3],(a[...,3]*0.35).astype(np.uint8))
  im=Image.fromarray(a);im=im.crop(im.getbbox())
  s=1.0 if (k.startswith('f') or k.startswith('st')) else SC
  im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS);ims[k]=im
# segment endpoints via PCA
def ends(im,leftfirst=False):
  a=np.array(im)[...,3]>100;ys,xs=np.nonzero(a);P=np.stack([xs,ys],1).astype(float);c=P.mean(0);u,s,vt=np.linalg.svd(P-c,full_matrices=False);ax=vt[0];pr=(P-c)@ax
  lo=P[pr<np.quantile(pr,0.03)].mean(0);hi=P[pr>np.quantile(pr,0.97)].mean(0)
  a1,a2=(lo,hi)
  if leftfirst: 
    if a1[0]>a2[0]:a1,a2=a2,a1
  else:
    if a1[1]>a2[1]:a1,a2=a2,a1
  return [round(a1[0],1),round(a1[1],1),round(a2[0],1),round(a2[1],1)]
order=sorted(ims,key=lambda k:-ims[k].height)
W=2048;x=y=rowh=0;pos={}
for k in order:
  im=ims[k]
  if x+im.width>W:x=0;y+=rowh+2;rowh=0
  pos[k]=[x,y,im.width,im.height];x+=im.width+2;rowh=max(rowh,im.height)
H=y+rowh;A=Image.new('RGBA',(W,H))
for k in ims:A.paste(ims[k],tuple(pos[k][:2]))
A.save('/home/claude/hmsu-tools/bone-to-beast/art/atlas.webp',quality=88,method=6)
seg={'skUpper':0,'skFore':0,'skThigh':0,'skShin':0,'gbFore':0,'gbShin':0,'wolfLeg':0,'wolfArm':0,'golemFist':1,'goblinArm':1,'plantVine':1,'skClub':1,'gbKnife':1,'bsFrontU':0,'bsFrontL':0,'bsBackU':0,'bsBackL':0}
for k,lf in seg.items():pos[k]+=ends(ims[k],lf==1)
open('atlas.json','w').write(json.dumps(pos,separators=(',',':')));print(W,H)
import os;print(os.path.getsize('/home/claude/hmsu-tools/bone-to-beast/art/atlas.webp'))
