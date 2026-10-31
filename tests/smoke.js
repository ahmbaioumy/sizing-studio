// Run in a browser console after loading dist/sizing-studio.html, or extract engine.js in a test harness.
(function(){
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
  const a=WFM.requiredStaff({volume:120,aht:300,intervalMinutes:30,occupancy:.85,shrinkage:.25,sla:.8,answerSeconds:20});
  assert(a.net>0,'staffing must be positive'); assert(a.roster>=a.net,'roster HC cannot be below net HC');
  const x=WFM.simulate({volume:120,aht:300,agents:a.net,seed:7,replications:4});
  const y=WFM.simulate({volume:120,aht:300,agents:a.net,seed:7,replications:4});
  assert(JSON.stringify(x.metrics)===JSON.stringify(y.metrics),'seeded simulation must be reproducible');
  assert(x.metrics.occupancy>=0,'capacity cannot be negative');
  console.log('Sizing smoke tests passed');
})();
