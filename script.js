'use strict';
let items=[];let view='home';let category='All';let query='';
const $=id=>document.getElementById(id);
const downloadCategories=[['Enigma2 Image Teams','Firmware images from OpenATV, OpenPLi, OpenViX and more'],['Enigma2 Plugins','Extensions, addons and useful plugins'],['Enigma2 Skins','Themes, skins and interface customisations'],['IPTV','Players, apps and setup guides for legitimate services'],['SoftCam','Software and guidance for authorised conditional access'],['Satellite Receiver','Receiver firmware, information and support'],['Tools','Backup, flashing, maintenance and utility tools']];

const subcategories={
 'Enigma2 Image Teams':['OpenATV','OpenPLi','OpenViX','OpenBH','OpenSPA','OpenHDF','PurE2','Other Images'],
 'Enigma2 Plugins':['System Plugins','Extensions','Media Players','EPG Plugins','Network Plugins','Other Plugins'],
 'Enigma2 Skins':['Full HD Skins','HD Skins','4K / UHD Skins','Skin Components','Other Skins'],
 'IPTV':['IPTV Players','Playlist Tools','Streaming Guides','Other IPTV'],
 'SoftCam':['Oscam','NCam','SoftCam Managers','Configuration Guides','Other SoftCam'],
 'Satellite Receiver':['VU+','Dreambox','Zgemma','Octagon','Formuler','Mutant','Other Receivers'],
 'Tools':['Backup & Restore','Flashing Tools','Channel Editors','Network Utilities','Other Tools']
};
let selectedMain=null,selectedSub=null;
function itemInMain(x,name){return x.type==='download'&&(x.category===name||x.mainCategory===name)}
function itemInSub(x,name,sub){return itemInMain(x,name)&&(x.subcategory===sub||x.category===sub)}
function categoryHash(name,sub){return '#category/'+encodeURIComponent(name)+(sub?'/'+encodeURIComponent(sub):'')}
function categoryView(){
 const root=$('content');root.replaceChildren();const name=selectedMain;
 $('heading').textContent=selectedSub||name;
 $('intro').textContent=selectedSub?`Downloads in ${selectedSub} · ${name}`:`Browse ${name} resources by subcategory.`;
 $('crumb').textContent=selectedSub?name+' / '+selectedSub:name;
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view==='downloads'));
 const back=link('← '+(selectedSub?'All '+name+' subcategories':'All download categories'),selectedSub?categoryHash(name):'#home','category-back');root.append(back);
 if(!selectedSub){const p=panel(name+' subcategories');(subcategories[name]||[]).forEach((sub,i)=>{
  const files=items.filter(x=>itemInSub(x,name,sub));const row=el('div','forumrow category-forum-row');row.append(el('div','forumicon','📁'));
  const details=el('div','forumdetails');details.append(link(sub,categoryHash(name,sub),'forumtitle'),el('div','description','Browse '+sub+' resources and downloads'));row.append(details);
  const counts=el('div','counts');counts.append(el('span','count-label','Downloads'),el('strong','',String(files.length)));row.append(counts);
  const latest=el('div','latestcell');if(files.length)latest.append(link(files[0].title,'#item/'+encodeURIComponent(files[0].id)));else latest.append(el('span','muted','No downloads yet'));row.append(latest);p.append(row)
 });root.append(p);}
 const found=items.filter(x=>selectedSub?itemInSub(x,name,selectedSub):itemInMain(x,name));
 root.append(list(found,selectedSub?'Downloads in '+selectedSub:'Latest '+name+' downloads'));
}
function syncCategoryHash(){const h=location.hash.slice(1);if(!h.startsWith('category/')){selectedMain=null;selectedSub=null;return false}let parts=h.slice(9).split('/');try{selectedMain=decodeURIComponent(parts[0]);selectedSub=parts[1]?decodeURIComponent(parts[1]):null}catch(e){selectedMain=null;selectedSub=null;return false}if(!Object.hasOwn(subcategories,selectedMain)||selectedSub&&!(subcategories[selectedMain]||[]).includes(selectedSub)){selectedMain=null;selectedSub=null;return false}return true}

function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function link(label,hash,cls){const a=el('a',cls,label);a.href=hash;return a}
function safeDownload(path){if(typeof path!=='string')return null;const s=path.trim();if(/^downloads\/[a-zA-Z0-9_./-]+$/.test(s)&&!s.split('/').includes('..'))return './'+s; if(/^https:\/\/[\w.-]+(?:\/[\w!#$&'()*+,;=:@%./?~-]*)?$/.test(s))return s;return null}
function count(type){return items.filter(x=>x.type===type).length}
function navigate(next){view=next;category='All';render()}
function resourceDetails(x){
 const box=el('div','resource-details');
 const facts=[['Version',x.version],['Updated',x.date],['Category',x.category],['File size',x.size],['Compatible receivers',Array.isArray(x.receivers)?x.receivers.join(', '):x.receivers]];
 facts.filter(([k,v])=>v).forEach(([k,v])=>{const row=el('div','resource-fact');row.append(el('span','muted',k),el('strong','',String(v)));box.append(row)});
 return box;
}
function makeRow(item){const row=el('div','libraryrow');row.append(el('div','libraryicon',item.type==='download'?'⬇️':item.type==='guide'?'📖':'📰'));const info=el('div','librarytext');const title=el('h3');title.append(link(item.title,'#item/'+encodeURIComponent(item.id)));info.append(title,el('div','meta',`${item.category||'General'} · ${item.date||'Undated'}${item.type==='download'&&item.version?' · v'+item.version:''}`),el('p','',item.summary||''));if(item.type==='download'){const path=safeDownload(item.file);if(path){const a=link('View resource →','#item/'+encodeURIComponent(item.id),'action');a.setAttribute('download','');info.append(a)}}else info.append(link('Read more →','#item/'+encodeURIComponent(item.id),'action'));row.append(info);return row}
const categoryIcons=['📺','🧩','🎨','📡','🔐','🛰️','🛠️'];
function categoryPanel(){
 const p=panel('Enigma2 download categories');
 downloadCategories.forEach(([name,description],i)=>{
  const files=items.filter(x=>itemInMain(x,name));
  const recent=files[0];
  const row=el('div','forumrow category-forum-row');
  row.append(el('div','forumicon',categoryIcons[i]));
  const details=el('div','forumdetails');
  const a=link(name,categoryHash(name),'forumtitle');
  details.append(a,el('div','description',description));
  row.append(details);
  const counts=el('div','counts');counts.append(el('span','count-label','Downloads'),el('strong','',String(files.length)));row.append(counts);
  const latest=el('div','latestcell');
  if(recent){latest.append(link(recent.title,'#item/'+encodeURIComponent(recent.id)),el('span','muted',recent.date||''));}
  else latest.append(el('span','muted','No downloads yet'));
  row.append(latest);p.append(row);
 });
 return p;
}
function panel(title){const p=el('section','panel');p.append(el('div','panelhead',title));return p}
function list(source,title){const p=panel(title);if(!source.length)p.append(el('div','empty','Nothing published here yet.'));else source.forEach(x=>p.append(makeRow(x)));return p}
function matches(x){const s=[x.title,x.summary,x.category,x.body].join(' ').toLowerCase();return s.includes(query)}
function render(){const root=$('content');root.replaceChildren();if(syncCategoryHash()){categoryView();return}const itemHash=decodeURIComponent(location.hash.slice(6));if(location.hash.startsWith('#item/')){const x=items.find(a=>a.id===itemHash);$('heading').textContent=x?x.title:'Page not found';$('intro').textContent=x?`${x.category||'General'} · ${x.date||''}`:'';$('crumb').textContent=x?x.title:'Not found';if(!x){root.append(el('div','notice','This page does not exist.'));return}
 const p=panel(x.type==='download'?'Resource overview':x.type==='guide'?'Guide':'News');
 const a=el('article','article');
 if(x.type==='download'){
   a.append(resourceDetails(x));
   if(x.summary)a.append(el('p','resource-summary',x.summary));
 }
 a.append(el('div','article-body',x.body||x.summary||''));
 if(x.type==='download'){
   if(Array.isArray(x.screenshots)&&x.screenshots.length){
     const gallery=el('div','resource-gallery');
     x.screenshots.forEach(src=>{if(typeof src==='string'&&/^(?:images|downloads)\/[a-zA-Z0-9_./-]+$/.test(src)&&!src.split('/').includes('..')){const img=el('img');img.src='./'+src;img.alt=x.title+' screenshot';img.loading='lazy';gallery.append(img)}});
     if(gallery.childElementCount){a.append(el('h3','','Screenshots'),gallery)}
   }
   if(x.installation){a.append(el('h3','','Installation instructions'),el('div','article-body',x.installation))}
   const path=safeDownload(x.file);
   if(path){const button=link('⬇ Download Now',path,'download-now');button.setAttribute('download','');a.append(button)}
   else a.append(el('p','muted','No download file has been added yet.'));
   a.append(el('p','muted small','Check compatibility and back up your receiver before installing.'));
 }
 p.append(a);root.append(p);return}
const names={home:'Levi45 Community',downloads:'Downloads',news:'News & Updates',guides:'Guides & Tutorials'};if(!names[view])view='home';$('heading').textContent=names[view];$('intro').textContent=view==='home'?'Browse free Enigma2 downloads, news, guides and tutorials.':`Browse ${names[view].toLowerCase()} from Levi45 Community.`;$('crumb').textContent=names[view];document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));let shown=items.filter(x=>(view==='home'||x.type==={downloads:'download',news:'news',guides:'guide'}[view])&&matches(x));if(view==='home'&&!query){root.append(categoryPanel());root.append(el('div','notice','Welcome! Downloads, news and guides are managed by the site owner on GitHub. No sign-up or payment is needed.'));root.append(list(items.filter(x=>x.type==='download').slice(0,5),'Latest downloads'),list(items.filter(x=>x.type==='news').slice(0,5),'Latest news'),list(items.filter(x=>x.type==='guide').slice(0,5),'Guides & tutorials'));return}if(view==='downloads'&&!query){root.append(categoryPanel())}const cats=view==='downloads'?['All',...downloadCategories.map(c=>c[0]),...new Set(shown.map(x=>x.category||'General'))].filter((x,i,a)=>a.indexOf(x)===i):['All',...new Set(shown.map(x=>x.category||'General'))];if(!cats.includes(category))category='All';const bar=el('div','filterbar');cats.forEach(c=>{const b=el('button',c===category?'active':'',c);b.type='button';b.addEventListener('click',()=>{category=c;render()});bar.append(b)});root.append(bar,list(shown.filter(x=>category==='All'||(x.category||'General')===category),query?'Search results':names[view]));}
function side(){ $('downloadCount').textContent=count('download');$('newsCount').textContent=count('news');$('guideCount').textContent=count('guide');const r=$('recent');r.replaceChildren();items.slice(0,5).forEach(x=>{const box=el('div','sidepost');box.append(link(x.title,'#item/'+encodeURIComponent(x.id)),el('div','muted',x.date||''));r.append(box)});if(!items.length)r.append(el('p','muted','No items yet.'))}
async function start(){try{const res=await fetch('./data/content.json',{cache:'no-cache'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(!Array.isArray(data.items))throw Error('Invalid content');items=data.items.filter(x=>x&&['download','news','guide'].includes(x.type)&&typeof x.id==='string'&&typeof x.title==='string').sort((a,b)=>(b.date||'').localeCompare(a.date||''))}catch(e){$('content').append(el('div','notice','Content could not be loaded. Check that data/content.json is uploaded to GitHub Pages.'));return}side();render()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{category='All';location.hash=b.dataset.view}));$('search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();if(location.hash.startsWith('#item/'))location.hash='#home';else render()});window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(!h.startsWith('item/')&&!h.startsWith('category/'))view=['home','downloads','news','guides'].includes(h)?h:'home';render()});view=['home','downloads','news','guides'].includes(location.hash.slice(1))?location.hash.slice(1):'home';start();
