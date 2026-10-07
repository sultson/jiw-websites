const fs=require('fs'),path=require('path');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{for(const file of fs.readdirSync(root+'/logos/svg')){const w=file.includes('symbol')?1200:3000;let pipeline=sharp(root+'/logos/svg/'+file,{density:300}).resize({width:w}); if(file.includes('-on-')) pipeline=pipeline.flatten({background:file.includes('on-navy')?'#182339':file.includes('on-chalk')?'#F7F3EC':'#FFFFFF'}); await pipeline.png().toFile(root+'/logos/png/'+file.replace('.svg','.png'));} console.log('Exported 21 PNG logo variants');})();
