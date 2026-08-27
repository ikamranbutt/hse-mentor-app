import { useMemo, useState } from 'react';

type RiskRow = { hazard: string; consequence: string; controls: string; initialL: number; initialS: number; residualL: number; residualS: number };

const templates: { words: string[]; rows: RiskRow[] }[] = [
  { words:['excavation','trench','digging'], rows:[
    {hazard:'Collapse of excavation sides',consequence:'Crushing, burial or fatal injury',controls:'Permit and service scan; competent-person inspection; approved shoring, sloping or benching; inspect after rain or change.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'People or plant falling into excavation',consequence:'Serious injury or equipment damage',controls:'Rigid barricade and warning signs; stop blocks; segregated plant route; trained banksman; adequate lighting.',initialL:4,initialS:4,residualL:1,residualS:4},
    {hazard:'Underground services',consequence:'Electrocution, fire, explosion or service damage',controls:'Review drawings; approved permit; cable locator and trial holes; mark services; hand dig within tolerance zone.',initialL:3,initialS:5,residualL:1,residualS:5},
    {hazard:'Unsafe access or hazardous atmosphere',consequence:'Fall, entrapment or exposure',controls:'Secured ladder within safe travel distance; water control; atmospheric testing where required; emergency plan.',initialL:3,initialS:4,residualL:1,residualS:4}
  ]},
  { words:['height','roof','ladder','fall','lifeline'], rows:[
    {hazard:'Fall from an open edge or fragile surface',consequence:'Major injury or fatality',controls:'Avoid work at height where possible; permit and task plan; guardrails; approved platform; 100% tie-off to certified anchor; rescue plan.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'Dropped tools or materials',consequence:'Struck-by injury to people below',controls:'Exclusion zone; tool lanyards; toe boards; secured materials; controlled lifting by hand line.',initialL:4,initialS:4,residualL:1,residualS:4},
    {hazard:'Unsafe access or defective equipment',consequence:'Fall while accessing work area',controls:'Inspect ladder, scaffold or MEWP; competent users; correct angle and securing; valid inspection tag; maintain three points of contact.',initialL:3,initialS:5,residualL:1,residualS:5}
  ]},
  { words:['hot work','welding','cutting','grinding'], rows:[
    {hazard:'Sparks, flame and hot metal',consequence:'Fire, burns or explosion',controls:'Hot-work permit; remove or protect combustibles; fire blanket and screens; suitable extinguishers; trained fire watcher; post-work monitoring.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'Fumes and gases',consequence:'Respiratory illness or asphyxiation',controls:'Assess material coating; local exhaust or ventilation; suitable RPE; gas testing in enclosed areas.',initialL:3,initialS:4,residualL:1,residualS:4},
    {hazard:'Damaged tools, discs or cables',consequence:'Cuts, electric shock or flying fragments',controls:'Pre-use inspection; correct guarded disc and RPM; dead-man switch; monthly inspection; remove defective tools from service.',initialL:3,initialS:4,residualL:1,residualS:4}
  ]},
  { words:['loto','lockout','isolation','maintenance'], rows:[
    {hazard:'Unexpected energization or release of stored energy',consequence:'Crushing, electrocution, burns or fatality',controls:'Approved LOTO procedure; identify every energy source; isolate, lock and tag; dissipate stored energy; try/test for zero energy.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'Incorrect or shared locks',consequence:'Unauthorized re-energization',controls:'Each person applies a personal identified lock; controlled group-lock box; authorized isolation register and handover.',initialL:3,initialS:5,residualL:1,residualS:5}
  ]},
  { words:['lifting','crane','rigging'], rows:[
    {hazard:'Dropped or swinging suspended load',consequence:'Fatal struck-by or crushing injury',controls:'Approved lift plan; certified crane and accessories; competent operator, rigger and signaler; inspect rigging; taglines; exclusion zone.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'Crane overturning or structural failure',consequence:'Multiple serious injuries and major damage',controls:'Verify load chart, radius and configuration; ground-bearing assessment; outrigger mats; level setup; weather limits; critical-lift approval.',initialL:3,initialS:5,residualL:1,residualS:5}
  ]},
  { words:['confined','tank','vessel','manhole'], rows:[
    {hazard:'Toxic, flammable or oxygen-deficient atmosphere',consequence:'Poisoning, fire, asphyxiation or fatality',controls:'Entry permit; isolate and LOTO; clean and ventilate; pre-entry and continuous gas testing; trained standby person; communication.',initialL:4,initialS:5,residualL:1,residualS:5},
    {hazard:'Entrapment or difficult rescue',consequence:'Delayed recovery and fatal injury',controls:'Specific rescue plan; trained rescue team; retrieval equipment; clear access; no unauthorized entry rescue.',initialL:3,initialS:5,residualL:1,residualS:5}
  ]}
];

const generic: RiskRow[] = [
  {hazard:'Unplanned task or changing site conditions',consequence:'Injury, damage or uncontrolled exposure',controls:'Approved RAMS and permit; pre-task briefing; competent supervision; stop and reassess when conditions change.',initialL:3,initialS:4,residualL:1,residualS:4},
  {hazard:'Interaction with people, vehicles or nearby activities',consequence:'Collision or struck-by injury',controls:'Barricaded work zone; segregated routes; banksman where required; communication and SIMOPS coordination.',initialL:3,initialS:4,residualL:1,residualS:4},
  {hazard:'Poor housekeeping and access',consequence:'Slip, trip, fall or blocked emergency route',controls:'Defined storage and waste points; clear access; routine housekeeping and supervisor inspection.',initialL:3,initialS:3,residualL:1,residualS:3}
];

const rating = (score:number) => score >= 17 ? 'Extreme' : score >= 10 ? 'High' : score >= 5 ? 'Medium' : 'Low';

export default function RiskAssessment({ onBack }: { onBack: () => void }) {
  const [task,setTask] = useState(''); const [location,setLocation] = useState(''); const [assessor,setAssessor] = useState('');
  const [rows,setRows] = useState<RiskRow[]>([]); const [generated,setGenerated] = useState(false);
  const matchedTopic = useMemo(() => templates.find(t => t.words.some(word => task.toLowerCase().includes(word))),[task]);
  const generate = () => { setRows((matchedTopic?.rows || generic).map(row => ({...row}))); setGenerated(true); window.setTimeout(()=>scrollTo({top:300,behavior:'smooth'}),100); };
  const update = (index:number,key:keyof RiskRow,value:string|number) => setRows(current => current.map((row,i)=>i===index?{...row,[key]:value}:row));
  const addRow = () => setRows(current => [...current,{hazard:'',consequence:'',controls:'',initialL:3,initialS:3,residualL:1,residualS:3}]);
  const save = () => { localStorage.setItem('hse-mentor-risk-assessment',JSON.stringify({task,location,assessor,rows,savedAt:new Date().toISOString()})); alert('Risk assessment draft saved on this device.'); };
  const load = () => { try { const saved=JSON.parse(localStorage.getItem('hse-mentor-risk-assessment')||'null'); if(saved){setTask(saved.task);setLocation(saved.location);setAssessor(saved.assessor);setRows(saved.rows);setGenerated(true);} } catch { /* empty */ } };
  return <main className="ra-page"><header className="topbar ra-topbar"><button className="back" onClick={onBack}>←</button><div><strong>Risk Assessment Maker</strong><small>5 × 5 professional format</small></div><span>HSE</span></header>
    <section className="ra-hero"><span>SMART SAFETY TOOL</span><h1>Describe the task.<br/>Build the assessment.</h1><p>Enter a work activity and receive an editable starting assessment with hazards, controls and initial and residual risk.</p></section>
    <section className="ra-form"><label>Work activity or task</label><textarea value={task} onChange={e=>setTask(e.target.value)} placeholder="Example: Excavation work for underground cable installation" rows={3}/><div className="ra-fields"><label>Location<input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Project / work area"/></label><label>Assessed by<input value={assessor} onChange={e=>setAssessor(e.target.value)} placeholder="Name"/></label></div><button className="primary" disabled={task.trim().length<5} onClick={generate}>Generate Risk Assessment</button><button className="secondary" onClick={load}>Load Saved Draft</button>{task && <small className="ra-match">{matchedTopic ? `✓ ${matchedTopic.words[0].toUpperCase()} controls recognized` : 'General task controls will be prepared'}</small>}</section>
    {generated && <section className="ra-result"><header><div><small>RISK ASSESSMENT FOR</small><h2>{task}</h2><p>{location || 'Location not specified'} · Assessed by {assessor || 'Not specified'}</p></div><div className="ra-actions"><button onClick={save}>Save Draft</button><button onClick={()=>window.print()}>Print / PDF</button></div></header>
      <div className="ra-table-wrap"><table><thead><tr><th>#</th><th>Hazard</th><th>Possible consequence</th><th>Existing / required controls</th><th>Initial risk</th><th>Residual risk</th></tr></thead><tbody>{rows.map((row,index)=>{const initial=row.initialL*row.initialS,residual=row.residualL*row.residualS;return <tr key={index}><td>{index+1}</td><td><textarea value={row.hazard} onChange={e=>update(index,'hazard',e.target.value)}/></td><td><textarea value={row.consequence} onChange={e=>update(index,'consequence',e.target.value)}/></td><td><textarea value={row.controls} onChange={e=>update(index,'controls',e.target.value)}/></td><td><div className="risk-selects"><select value={row.initialL} onChange={e=>update(index,'initialL',+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>L {n}</option>)}</select><select value={row.initialS} onChange={e=>update(index,'initialS',+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>S {n}</option>)}</select></div><strong className={`risk-badge ${rating(initial).toLowerCase()}`}>{initial} {rating(initial)}</strong></td><td><div className="risk-selects"><select value={row.residualL} onChange={e=>update(index,'residualL',+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>L {n}</option>)}</select><select value={row.residualS} onChange={e=>update(index,'residualS',+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>S {n}</option>)}</select></div><strong className={`risk-badge ${rating(residual).toLowerCase()}`}>{residual} {rating(residual)}</strong></td></tr>})}</tbody></table></div>
      <button className="add-risk" onClick={addRow}>+ Add Another Hazard</button><p className="ra-disclaimer">Professional review required: verify this assessment against the actual site, applicable law, client requirements and approved method statement before use.</p>
    </section>}
  </main>;
}
