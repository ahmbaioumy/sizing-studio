/* sizing-app: pure WFM calculation engine. No DOM or external dependencies. */
(function (global) {
  'use strict';
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const safe=(n,f=0)=>Number.isFinite(n)?n:f;
  function factorial(n){let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
  function erlangC(agents, traffic){
    agents=Math.max(1,Math.floor(agents)); traffic=Math.max(0,traffic);
    if(traffic>=agents) return {probabilityWait:1, serviceLevel:0, occupancy:1, asa:Infinity};
    let sum=0; for(let k=0;k<agents;k++) sum+=Math.pow(traffic,k)/factorial(k);
    const last=Math.pow(traffic,agents)/factorial(agents);
    const pWait=last/(sum+last*(agents/(agents-traffic)));
    const occ=traffic/agents;
    const asa=pWait*(1/(agents/Math.max(traffic,0.0001)-1));
    return {probabilityWait:pWait, serviceLevel:pWait*Math.exp(-(agents-traffic)*0.5), occupancy:occ, asa};
  }
  function erlangB(agents, traffic){let inv=1;for(let i=1;i<=Math.max(0,Math.floor(agents));i++)inv=1+(i/Math.max(traffic,0.0001))*inv;return 1/inv;}
  function erlangA(agents, traffic, patience){const c=erlangC(agents,traffic); const abandon=clamp(c.probabilityWait/(1+Math.max(0.1,patience)),0,1);return {...c, abandonment:abandon, serviceLevel:c.serviceLevel*(1-abandon)};}
  function seeded(seed){let s=(Number(seed)||1)>>>0; return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};}
  function mean(xs){return xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;}
  function weightedMean(xs,weights){let a=0,b=0;xs.forEach((x,i)=>{a+=x*(weights[i]??1);b+=(weights[i]??1)});return b?a/b:0;}
  function forecast(values,method='moving',window=4){
    const v=values.map(Number).filter(Number.isFinite); if(!v.length)return 0;
    if(method==='weighted') return weightedMean(v.slice(-window),v.slice(-window).map((_,i)=>i+1));
    if(method==='trend' && v.length>1){const n=v.length,mx=(n-1)/2,my=mean(v);let num=0,den=0;v.forEach((y,i)=>{num+=(i-mx)*(y-my);den+=(i-mx)**2});return Math.max(0,my+(den?num/den:0));}
    return mean(v.slice(-window));
  }
  function workload(volume,aht,intervalMinutes=30){return volume*Math.max(0,aht)/60;}
  function requiredStaff({volume,aht,intervalMinutes=30,occupancy=0.85,shrinkage=0.25,sla=0.8,answerSeconds=20}){
    const traffic=workload(volume,aht,intervalMinutes)/Math.max(intervalMinutes/60,0.01);
    let n=Math.max(1,Math.ceil(traffic/Math.max(0.1,occupancy)));
    while(n<500){const c=erlangC(n,traffic);const sl=c.probabilityWait>=1?0:1-c.probabilityWait*Math.exp(-(n-traffic)*(answerSeconds/Math.max(aht,1)));if(sl>=sla)break;n++;}
    return {net:n,roster:Math.ceil(n/(1-shrinkage)),gross:Math.ceil(n/(1-shrinkage)),traffic,workload:traffic*(intervalMinutes/60)};
  }
  function simulate({volume,aht,agents,intervalMinutes=30,seed=42,replications=1,sla=0.8,answerSeconds=20,patience=60}){
    const all=[]; const start=performance.now();
    for(let r=0;r<replications;r++){
      const rng=seeded(seed+r*10007); const arrivals=Math.max(0,Math.round(volume+(rng()-0.5)*Math.sqrt(Math.max(volume,1))));
      const q=workload(arrivals,aht,intervalMinutes); const c=erlangA(agents,q/Math.max(intervalMinutes/60,0.01),patience/60);
      const abandon=clamp(c.abandonment+(rng()-0.5)*0.01,0,1); const sl=clamp(c.serviceLevel-(rng()-0.5)*0.02,0,1);
      all.push({replication:r+1,arrivals,aht,agents,sla:sl,asa:Math.max(0,c.asa*60),answer:1-abandon,abandonment:abandon,occupancy:clamp(c.occupancy,0,1),utilization:clamp(c.occupancy*1.08,0,1.2),backlog:Math.max(0,Math.round(arrivals*(1-sl)*0.15))});
    }
    const keys=['sla','asa','answer','abandonment','occupancy','utilization','backlog']; const metrics={}; keys.forEach(k=>metrics[k]=mean(all.map(x=>x[k])));
    const sd=k=>{const m=metrics[k];return Math.sqrt(mean(all.map(x=>(x[k]-m)**2)));};
    return {metrics,replications:all,durationMs:Math.round(performance.now()-start),ci95:Object.fromEntries(keys.map(k=>[k,1.96*sd(k)/Math.sqrt(Math.max(1,replications))]))};
  }
  function generateRoster({agents,shiftStart='08:00',shiftHours=8,breakMinutes=60,teams=2}){
    const rows=[]; for(let i=1;i<=agents;i++){const team=((i-1)%teams)+1;rows.push({agent:`A-${String(i).padStart(3,'0')}`,team:`Team ${team}`,shift:shiftStart,duration:`${shiftHours}h`,break:`${breakMinutes}m`,days:'Mon–Fri',skills:'Voice · Chat',status:'Feasible'});} return rows;
  }
  function sensitivity(base, levels=[-20,-10,0,10,20]){return levels.map(v=>levels.map(a=>{const req=requiredStaff({volume:base.volume*(1+v/100),aht:base.aht*(1+a/100),intervalMinutes:base.intervalMinutes,occupancy:base.occupancy,shrinkage:base.shrinkage,sla:base.sla,answerSeconds:base.answerSeconds});return {...req,volumeDelta:v,ahtDelta:a,feasible:true};}));}
  function hash(obj){let h=2166136261;const s=JSON.stringify(obj);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return ('00000000'+(h>>>0).toString(16)).slice(-8);}
  global.WFM={clamp,safe,erlangC,erlangB,erlangA,seeded,mean,forecast,workload,requiredStaff,simulate,generateRoster,sensitivity,hash};
})(window);
