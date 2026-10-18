import re
src=open('/home/claude/hmsu-tools/bone-to-beast/index.html').read()
lines=src.split('\n')
def between(a,b):
    i=src.index(a);j=src.index(b,i);return src[i:j]
def func(name):
    i=src.index('\nfunction '+name+'(')+1
    m=re.search(r'\n(function |var |// )',src[i+1:]);return src[i:i+1+m.start()]+'\n'
head=src[:src.index('<div class="tc l"')]
head=head.replace('<title>Bone to Beast</title>','<title>Beast Survivors</title>')
overlays=between('<div class="over dim" id="title">','<script>')
overlays=overlays.replace('<h1>BONE TO <span>BEAST</span></h1>','<h1>BEAST <span>SURVIVORS</span></h1>')
script_head=between('<script>','var store=')
js=script_head+between('var store=','// ======================= world & state')
js=js.replace("'b2b3-'","'bsv1-'")
for fn in ['stat','maxHp','starterSkill','formSkill','addSkill','addBlood','formCard','drawFormFit','offer','evolve','rebirth','burst','card','focusFirst','formName','buildTitle']:
    js+=func(fn)
js+=between('var POOL=','\n')+'\n'
js+=between('// ======================= drawing helpers','// ======================= scene')
js+=between('var EART=','function draw()')
js+=open('game.js').read()
js=js.replace("Z=Math.max(0.55,Math.min(1.6,Math.min(H/540,W/560)));","Z=Math.max(0.75,Math.min(1.7,Math.min(W,H)/430));")
out=head+overlays+js+'\n</script>\n</body>\n</html>\n'
open('/home/claude/hmsu-tools/bone-to-beast/survivors.html','w').write(out);print(len(out))
