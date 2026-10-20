'use strict';
let items=[];let view='home';let category='All';let query='';
const $=id=>document.getElementById(id);
const downloadCategories=[['OpenATV','OpenATV images, updates and related files'],['OpenPLi','OpenPLi images and resources'],['Enigma2 Plugins','Extensions, utilities and addons'],['Channel Lists','Bouquets and channel settings'],['Picons','Channel logos and icon packs'],['Receiver Tools','Backup, flashing and maintenance tools']];
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
function panel(title){const p=el('section','panel');p.append(el('div','panelhead',title));return p}
function list(source,title){const p=panel(title);if(!source.length)p.append(el('div','empty','Nothing published here yet.'));else source.forEach(x=>p.append(makeRow(x)));return p}
function matches(x){const s=[x.title,x.summary,x.category,x.body].join(' ').toLowerCase();return s.includes(query)}
function render(){const root=$('content');root.replaceChildren();const itemHash=decodeURIComponent(location.hash.slice(6));if(location.hash.startsWith('#item/')){const x=items.find(a=>a.id===itemHash);$('heading').textContent=x?x.title:'Page not found';$('intro').textContent=x?`${x.category||'General'} · ${x.date||''}`:'';$('crumb').textContent=x?x.title:'Not found';if(!x){root.append(el('div','notice','This page does not exist.'));return}
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
const names={home:'Levi45 Community',downloads:'Downloads',news:'News & Updates',guides:'Guides & Tutorials'};if(!names[view])view='home';$('heading').textContent=names[view];$('intro').textContent=view==='home'?'Browse free Enigma2 downloads, news, guides and tutorials.':`Browse ${names[view].toLowerCase()} from Levi45 Community.`;$('crumb').textContent=names[view];document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));let shown=items.filter(x=>(view==='home'||x.type==={downloads:'download',news:'news',guides:'guide'}[view])&&matches(x));if(view==='home'&&!query){const grid=el('div','categorygrid');downloadCategories.forEach(([name,description])=>{const b=el('button','categorycard');b.type='button';b.append(el('strong','',name),el('span','',description));b.addEventListener('click',()=>{view='downloads';category=name;location.hash='#downloads';render()});grid.append(b)});root.append(panel('Download categories'));root.append(grid);root.append(el('div','notice','Welcome! Downloads, news and guides are managed by the site owner on GitHub. No sign-up or payment is needed.'));root.append(list(items.filter(x=>x.type==='download').slice(0,5),'Latest downloads'),list(items.filter(x=>x.type==='news').slice(0,5),'Latest news'),list(items.filter(x=>x.type==='guide').slice(0,5),'Guides & tutorials'));return}if(view==='downloads'&&!query){const grid=el('div','categorygrid');downloadCategories.forEach(([name,description])=>{const b=el('button','categorycard');b.type='button';b.append(el('strong','',name),el('span','',description),el('small','',`${shown.filter(x=>x.category===name).length} files`));b.addEventListener('click',()=>{category=name;render()});grid.append(b)});root.append(grid)}const cats=view==='downloads'?['All',...downloadCategories.map(c=>c[0]),...new Set(shown.map(x=>x.category||'General'))].filter((x,i,a)=>a.indexOf(x)===i):['All',...new Set(shown.map(x=>x.category||'General'))];if(!cats.includes(category))category='All';const bar=el('div','filterbar');cats.forEach(c=>{const b=el('button',c===category?'active':'',c);b.type='button';b.addEventListener('click',()=>{category=c;render()});bar.append(b)});root.append(bar,list(shown.filter(x=>category==='All'||(x.category||'General')===category),query?'Search results':names[view]));}
function side(){ $('downloadCount').textContent=count('download');$('newsCount').textContent=count('news');$('guideCount').textContent=count('guide');const r=$('recent');r.replaceChildren();items.slice(0,5).forEach(x=>{const box=el('div','sidepost');box.append(link(x.title,'#item/'+encodeURIComponent(x.id)),el('div','muted',x.date||''));r.append(box)});if(!items.length)r.append(el('p','muted','No items yet.'))}
async function start(){try{const res=await fetch('./data/content.json',{cache:'no-cache'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(!Array.isArray(data.items))throw Error('Invalid content');items=data.items.filter(x=>x&&['download','news','guide'].includes(x.type)&&typeof x.id==='string'&&typeof x.title==='string').sort((a,b)=>(b.date||'').localeCompare(a.date||''))}catch(e){$('content').append(el('div','notice','Content could not be loaded. Check that data/content.json is uploaded to GitHub Pages.'));return}side();render()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.view}));$('search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();if(location.hash.startsWith('#item/'))location.hash='#home';else render()});window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(!h.startsWith('item/'))view=['home','downloads','news','guides'].includes(h)?h:'home';render()});view=['home','downloads','news','guides'].includes(location.hash.slice(1))?location.hash.slice(1):'home';start();
