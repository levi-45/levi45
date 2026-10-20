'use strict';
const cats={
'Enigma2 Image Teams':['OpenATV','OpenPLi','OpenViX','OpenBH','OpenSPA','OpenHDF','PurE2','Other Images'],
'Enigma2 Plugins':['System Plugins','Extensions','Media Players','EPG Plugins','Network Plugins','Other Plugins'],
'Enigma2 Skins':['Full HD Skins','HD Skins','4K / UHD Skins','Skin Components','Other Skins'],
'IPTV':['IPTV Players','Playlist Tools','Streaming Guides','Other IPTV'],
'SoftCam':['Oscam','NCam','SoftCam Managers','Configuration Guides','Other SoftCam'],
'Satellite Receiver':['VU+','Dreambox','Zgemma','Octagon','Formuler','Mutant','Other Receivers'],
'Tools':['Backup & Restore','Flashing Tools','Channel Editors','Network Utilities','Other Tools']};
const $=id=>document.getElementById(id);let content=null;
$('date').value=new Date().toLocaleDateString('en-CA');
Object.keys(cats).forEach(name=>$('mainCategory').add(new Option(name,name)));
function updateSubs(){const select=$('subcategory');select.replaceChildren();cats[$('mainCategory').value].forEach(name=>select.add(new Option(name,name)))}
$('mainCategory').addEventListener('change',updateSubs);updateSubs();
$('type').addEventListener('change',()=>{const download=$('type').value==='download';$('downloadFields').hidden=!download;$('articleFields').hidden=download});
$('existing').addEventListener('change',async event=>{content=null;$('export').disabled=true;try{const f=event.target.files[0];if(!f)return;if(f.size>5e6)throw Error('JSON file is too large');const data=JSON.parse(await f.text());if(!data||!Array.isArray(data.items)||data.items.some(x=>!x||typeof x!=='object'||typeof x.id!=='string'))throw Error('Expected an object with an items array containing entries with IDs');content=data;$('loaded').textContent=`Loaded ${data.items.length} existing entries from ${f.name}`;$('export').disabled=false;updateCount();$('message').textContent=''}catch(e){$('loaded').textContent='Could not load content: '+e.message}});
const clean=id=>$(id).value.trim();
function localPath(s,folder){return s.startsWith(folder+'/')&&!s.split('/').includes('..')&&/^[a-zA-Z0-9_./-]+$/.test(s)}
function validFile(s){return !s||localPath(s,'downloads')||(/^https:\/\/[^\s]+$/.test(s))}
function slug(s){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'entry'}
function updateCount(){$('count').textContent=`Draft contains ${content.items.length} total entries (${content.items.filter(x=>x.type==='download').length} downloads, ${content.items.filter(x=>x.type==='news').length} news, ${content.items.filter(x=>x.type==='guide').length} guides).`}
$('add').addEventListener('click',()=>{try{if(!content)throw Error('Load your current content.json first.');const title=clean('title'),type=clean('type'),date=clean('date');if(!title)throw Error('Please enter a title.');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Choose a valid date.');const id=slug(title)+'-'+date;if(content.items.some(x=>x.id===id))throw Error('An entry with this title and date already exists. Change the title or date.');const entry={id,type,title,date,category:type==='download'?clean('mainCategory'):(clean('articleCategory')||'General'),summary:clean('summary'),body:clean('body')};if(type==='download'){const file=clean('file'),screens=clean('screenshots').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!validFile(file))throw Error('File must be an HTTPS URL or a path beginning downloads/.');if(screens.some(x=>!localPath(x,'images')&&!localPath(x,'downloads')))throw Error('Screenshot paths must begin with images/ or downloads/ and use simple filenames.');Object.assign(entry,{mainCategory:clean('mainCategory'),subcategory:clean('subcategory'),version:clean('version'),size:clean('size'),file,receivers:clean('receivers').split(',').map(x=>x.trim()).filter(Boolean),screenshots:screens,installation:clean('installation')})}content.items.unshift(entry);updateCount();$('message').textContent='✓ Added to draft: '+title+'. Download the updated JSON below.'}catch(e){$('message').textContent='⚠ '+e.message}});
$('export').addEventListener('click',()=>{if(!content)return;const blob=new Blob([JSON.stringify(content,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
