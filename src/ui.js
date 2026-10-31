(function(global){'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $=s=>document.querySelector(s);
  const el=(tag,attrs={},html='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>k==='class'?n.className=v:n.setAttribute(k,v));n.innerHTML=html;return n;};
  function toast(msg){const n=el('div',{class:'toast'},esc(msg));document.body.appendChild(n);setTimeout(()=>n.remove(),2800)}
  function metric(label,value,foot,warning=false){return `<div class="card metric"><div class="metric-label">${esc(label)}</div><div class="metric-value">${esc(value)}</div><div class="metric-foot ${warning?'warn':''}">${esc(foot)}</div></div>`}
  function table(headers,rows){return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  function bars(values,secondary=[]){const max=Math.max(...values,...secondary,1);return `<div class="bars">${values.map((v,i)=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(4,v/max*100)}%" title="${v.toFixed(0)}"></div>${secondary.length?`<div class="bar dark" style="height:${Math.max(4,secondary[i]/max*100)}%" title="${secondary[i].toFixed(0)}"></div>`:''}</div>`).join('')}</div><div class="axis"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div>`}
  function heatmap(matrix){const max=Math.max(...matrix.flat().map(x=>x.net),1);return `<div class="heatmap"><div class="label">Vol / AHT</div>${[-20,-10,0,10,20].map(x=>`<div class="label">${x>0?'+':''}${x}%</div>`).join('')}${matrix.map((row,i)=>`<div class="label">${[-20,-10,0,10,20][i]>0?'+':''}${[-20,-10,0,10,20][i]}%</div>${row.map(c=>{const alpha=.12+.72*(c.net/max);return `<div style="background:rgba(24,182,164,${alpha});color:${alpha>.5?'#fff':'#245b59'}" title="Net HC ${c.net}">${c.net}</div>`}).join('')}`).join('')}</div>`}
  function download(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  function csv(headers,rows){return [headers,...rows].map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n')}
  global.UI={esc,$,el,toast,metric,table,bars,heatmap,download,csv};
})(window);
