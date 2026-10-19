// おうち宝さがし PDF: node takarabook.js よびかた 出力.pdf christmas|birthday easy|normal|hard 場所1,場所2,... [あいことば]
// 場所: reizouko genkan ofuro bed tv hondana toilet sentakuki sofa tsukue curtain renji omochabako kutsushita
const { chromium } = require('playwright');const path=require('path');
(async()=>{const [name='はなこちゃん',out='takara.pdf',th='christmas',lv='normal',places='reizouko,sofa,ofuro,genkan,bed',pw='']=process.argv.slice(2);
const q=new URLSearchParams({print:1,name,theme:th,level:lv,places,pw});
const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../takara/index.html')+'?'+q);
await p.pdf({path:out,format:'A4',printBackground:true,preferCSSPageSize:true});await b.close();console.log('ok',out);})();
