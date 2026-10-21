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

RIGP={'rA_head':('pr_00',None),'rA_torso':('pr_01',None),'rA_arm':('pr_02','tr'),'rA_arm2':('pr_03','tr'),'rA_thigh':('pr_04','tb'),'rA_shin':('pr_05','tb'),
'rB_head':('pr_06',None),'rB_knife':('pr_07','lr'),'rB_torso':('pr_08',None),'rB_upper':('pr_09','tbr'),'rB_fore':('pr_10','lr'),'rB_thigh':('pr_11','tb'),'rB_shin':('pr_12','tb'),
'rC_head':('pr_13',None),'rC_torso':('pr_14',None),'rC_upper':('pr_15','tb'),'rC_fore':('pr_16','lr'),'rC_thigh':('pr_17','tb'),'rC_shin':('pr_18','tb'),'rC_bow':('pr_19',None),
'rD_head':('pr_20',None),'rD_torso':('pr_21',None),'rD_upper':('pr_22','tb'),'rD_fore':('pr_23','lr'),'rD_thigh':('pr_24','tb'),'rD_shin':('pr_25','tb')}
for k,(f,m) in RIGP.items(): M[k]=f

RIGP.update({'rE_head':('gp_00',None),'rE_torso':('gp_01',None),'rE_upper':('gp_02','tb'),'rE_fore':('gp_03','gh'),'rE_thigh':('gp_04','tb'),'rE_shin':('gp_05','tb'),
'rF_head':('gp_06',None),'rF_torso':('gp_07',None),'rF_upper':('gp_08','tb'),'rF_fore':('gp_09','gh'),'rF_thigh':('gp_10','tb'),'rF_shin':('gp_11','tb'),
'rG_head':('gp_13',None),'rG_torso':('gp_14',None),'rG_upper':('gp_15','tb'),'rG_fore':('gp_16','gh'),'rG_thigh':('gp_17','tb'),'rG_shin':('gp_18','tb'),
'rH_head':('gp_22',None),'rH_torso':('gp_23',None),'rH_upper':('gp_24','tb'),'rH_fore':('gp_25','gh'),'rH_thigh':('gp_26','tb'),'rH_shin':('gp_27','tb')})
for k,(f,m) in RIGP.items(): M[k]=f
SC=0.8
ims={}
EV=['fSlGrass','fSlRock','fSlZombie','fSlDeath','fSkMoss','fSkWraith','fSkKnight','fSkSteel','fSkVamp',None,'fGbForest','fGbDruid','fGbHob','fGbKing','fGbShaman','fGbDemon','fBsForest','fBsSacred','fBsRock','fBsFire']
for i,k in enumerate(EV):
  if k: M[k]='ev_%02d'%i
for k,f in M.items():
  im=Image.open(f+'.png');a=np.array(im)
  m=a[...,3]>128;m2=ndimage.binary_erosion(m,iterations=1)
  a[...,3]=np.where(m2,a[...,3],(a[...,3]*0.35).astype(np.uint8))
  im=Image.fromarray(a);im=im.crop(im.getbbox())
  s=1.0 if (k.startswith('f') or k.startswith('st') or k.startswith('r')) else SC
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
def ends2(im,mode):
  a=np.array(im)[...,3]>100;ys,xs=np.nonzero(a);P=np.stack([xs,ys],1).astype(float)
  def ext(v,hi=True):
    q=np.quantile(v,0.97 if hi else 0.03);sel=P[v>=q] if hi else P[v<=q];return sel.mean(0)
  if mode=='tb':p0=ext(ys,False);p1=ext(ys,True)
  elif mode=='lr':p0=ext(xs,False);p1=ext(xs,True)
  elif mode=='tr':p0=ext(ys,False);p1=ext(xs,True)
  elif mode=='gh':
    p0=P[np.argmin(xs+ys)];A=np.array(im).astype(int);gr=(A[...,1]>A[...,0]+15)&(A[...,1]>A[...,2]+15)&(A[...,3]>100);gy,gx=np.nonzero(gr);G2=np.stack([gx,gy],1).astype(float);dd=np.hypot(G2[:,0]-p0[0],G2[:,1]-p0[1]);p1=G2[dd>=np.quantile(dd,0.8)].mean(0)
  else:p0=ext(ys,False);p1=ext(xs+ys,True)
  return [round(p0[0],1),round(p0[1],1),round(p1[0],1),round(p1[1],1)]
for k,(f,m) in RIGP.items():
  if m:pos[k]+=ends2(ims[k],m)
open('atlas.json','w').write(json.dumps(pos,separators=(',',':')));print(W,H)
import os;print(os.path.getsize('/home/claude/hmsu-tools/bone-to-beast/art/atlas.webp'))
