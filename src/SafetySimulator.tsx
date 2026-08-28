import { useMemo, useState } from 'react';

type Control = { id: string; label: string; required: boolean; reason: string };
type Scenario = {
  id: string; title: string; category: string; risk: string; icon: string;
  description: string; hazards: string[]; controls: Control[];
};

const scenarios: Scenario[] = [
  {
    id: 'hot-work', title: 'Hot Work & Welding', category: 'Fire / Explosion', risk: 'Extreme', icon: '🔥',
    description: 'A welder is preparing to cut steel near stored materials. Make the work area safe before sparks begin.',
    hazards: ['Sparks reaching combustible material', 'Fire or explosion', 'Burns and eye injury', 'Fumes and hot metal'],
    controls: [
      { id: 'hw1', label: 'Approved hot-work permit and gas test where required', required: true, reason: 'The task and atmosphere must be formally checked before hot work.' },
      { id: 'hw2', label: 'Remove combustibles and use fire-resistant blankets', required: true, reason: 'Eliminate or shield fuel from sparks and hot slag.' },
      { id: 'hw3', label: 'Dedicated trained fire watch with suitable extinguisher', required: true, reason: 'A fire watch must monitor the work and post-work fire risk.' },
      { id: 'hw4', label: 'Inspect welding leads, earth connection and equipment', required: true, reason: 'Damaged equipment can cause shock, fire or poor earthing.' },
      { id: 'hw5', label: 'Welding shield, gloves, FR clothing and ventilation', required: true, reason: 'Task PPE and fume control protect the worker.' },
      { id: 'hw6', label: 'Use only a warning sign; no barricade needed', required: false, reason: 'Signs alone do not control sparks or unauthorized access.' }
    ]
  },
  {
    id: 'work-height', title: 'Work at Height', category: 'Fall Prevention', risk: 'Extreme', icon: '🪜',
    description: 'A technician must work from an elevated platform with people moving below. Prepare a safe system of work.',
    hazards: ['Person falling from height', 'Dropped tools or material', 'Unsafe access', 'Delayed rescue after a fall'],
    controls: [
      { id: 'wh1', label: 'Avoid height or use a guarded work platform first', required: true, reason: 'Collective protection is preferred over personal fall arrest.' },
      { id: 'wh2', label: 'Approved permit, method statement and rescue plan', required: true, reason: 'The task needs planned authorization and workable rescue arrangements.' },
      { id: 'wh3', label: 'Inspected platform/scaffold with safe access and valid tag', required: true, reason: 'The access system must be complete and inspected.' },
      { id: 'wh4', label: '100% tie-off to certified anchor when fall arrest is required', required: true, reason: 'The worker must remain continuously protected.' },
      { id: 'wh5', label: 'Barricade below, tool lanyards and secured materials', required: true, reason: 'This controls falling-object exposure.' },
      { id: 'wh6', label: 'Tie the harness lanyard to a handrail', required: false, reason: 'A handrail is not automatically a certified fall-arrest anchor.' }
    ]
  },
  {
    id: 'excavation', title: 'Excavation Work', category: 'Ground Work', risk: 'Extreme', icon: '🚧',
    description: 'A crew will enter a 2.2 m excavation beside a vehicle route. Decide what must be in place before entry.',
    hazards: ['Ground collapse and burial', 'Underground services', 'Plant or material falling in', 'Hazardous atmosphere and water ingress'],
    controls: [
      { id: 'ex1', label: 'Excavation permit, drawings and utility scan/trial holes', required: true, reason: 'Services must be located before mechanical excavation.' },
      { id: 'ex2', label: 'Engineered shoring, benching or safe sloping', required: true, reason: 'A competent protective system prevents collapse.' },
      { id: 'ex3', label: 'Spoil and equipment kept back from the edge', required: true, reason: 'Surcharge loads and falling material increase collapse risk.' },
      { id: 'ex4', label: 'Barricade, stop blocks and controlled plant movement', required: true, reason: 'People and vehicles must be separated from the open edge.' },
      { id: 'ex5', label: 'Safe ladder/access, inspection and atmospheric test as needed', required: true, reason: 'Entry, changing ground and atmospheric risks require control.' },
      { id: 'ex6', label: 'Enter quickly without shoring because the job is short', required: false, reason: 'Short duration does not remove collapse risk.' }
    ]
  },
  {
    id: 'grinding', title: 'Cutting with Grinder', category: 'Power Tools', risk: 'High', icon: '⚙️',
    description: 'A worker will cut a steel section using an angle grinder. Inspect the setup and choose the correct controls.',
    hazards: ['Disc burst or kickback', 'Flying particles and sparks', 'Noise and vibration', 'Electric shock and fire'],
    controls: [
      { id: 'gr1', label: 'Correct RPM-rated disc, undamaged and within expiry', required: true, reason: 'The disc must match the tool, material and operating speed.' },
      { id: 'gr2', label: 'Guard and side handle fitted; pre-use inspection completed', required: true, reason: 'These protect against contact, kickback and fragments.' },
      { id: 'gr3', label: 'Secure the workpiece and position sparks safely', required: true, reason: 'Movement and uncontrolled spark direction create serious risk.' },
      { id: 'gr4', label: 'Face shield over safety glasses, hearing protection and gloves', required: true, reason: 'Correct PPE protects eyes, face, hearing and hands.' },
      { id: 'gr5', label: 'Remove combustibles and keep fire control available', required: true, reason: 'Grinding sparks can ignite nearby materials.' },
      { id: 'gr6', label: 'Remove the guard to fit a larger cutting disc', required: false, reason: 'Removing the guard and oversizing discs can cause fatal disc failure.' }
    ]
  },
  {
    id: 'lifting', title: 'Crane Lifting Operation', category: 'Lifting', risk: 'Extreme', icon: '🏗️',
    description: 'A mobile crane will lift a steel load near an active access route. Control the complete lifting operation.',
    hazards: ['Dropped or swinging load', 'Crane overturning', 'People struck or crushed', 'Contact with structures or services'],
    controls: [
      { id: 'li1', label: 'Approved lift plan and verified load weight/radius', required: true, reason: 'Capacity and configuration must be confirmed before lifting.' },
      { id: 'li2', label: 'Certified crane, accessories and competent lifting team', required: true, reason: 'Equipment and personnel must be suitable and certified.' },
      { id: 'li3', label: 'Ground assessment, outriggers and mats correctly set', required: true, reason: 'Crane stability depends on ground bearing and setup.' },
      { id: 'li4', label: 'Exclusion zone, one signaler and taglines', required: true, reason: 'Control the load and prevent people entering the danger zone.' },
      { id: 'li5', label: 'Weather, power-line clearance and pre-lift briefing checked', required: true, reason: 'Site interfaces can change the lifting risk.' },
      { id: 'li6', label: 'Allow workers to stand under the load to guide it', required: false, reason: 'No person may stand beneath a suspended load.' }
    ]
  },
  {
    id: 'loto', title: 'Electrical LOTO', category: 'Energy Isolation', risk: 'Extreme', icon: '⚡',
    description: 'Maintenance is required inside powered equipment. Establish and verify safe isolation before work.',
    hazards: ['Electric shock or arc flash', 'Unexpected start-up', 'Stored mechanical or hydraulic energy', 'Incorrect circuit isolation'],
    controls: [
      { id: 'lo1', label: 'Identify every energy source using current drawings', required: true, reason: 'All electrical and stored energy sources must be known.' },
      { id: 'lo2', label: 'Shut down, isolate and dissipate stored energy', required: true, reason: 'Isolation includes residual pneumatic, hydraulic and mechanical energy.' },
      { id: 'lo3', label: 'Each worker applies a personal lock and identification tag', required: true, reason: 'Personal control prevents unauthorized re-energization.' },
      { id: 'lo4', label: 'Test for dead with an approved tester and prove the tester', required: true, reason: 'Isolation must be verified, not assumed.' },
      { id: 'lo5', label: 'Try-start test, authorization and controlled restoration', required: true, reason: 'Verification and formal hand-back complete the safe process.' },
      { id: 'lo6', label: 'Use the emergency-stop button as the only isolation', required: false, reason: 'An emergency stop is not secure energy isolation.' }
    ]
  },
  {
    id: 'confined-space', title: 'Confined Space Entry', category: 'Special Entry', risk: 'Extreme', icon: '🕳️',
    description: 'A worker needs to enter a vessel for inspection. Prepare entry, monitoring and rescue arrangements.',
    hazards: ['Oxygen deficiency or toxic gas', 'Engulfment', 'Unexpected energy release', 'Difficult rescue'],
    controls: [
      { id: 'cs1', label: 'Entry permit, isolation/LOTO and positive disconnection', required: true, reason: 'Every connected energy and material source must be controlled.' },
      { id: 'cs2', label: 'Pre-entry and continuous atmospheric monitoring', required: true, reason: 'The atmosphere can change during the work.' },
      { id: 'cs3', label: 'Ventilation selected from monitoring results', required: true, reason: 'Ventilation controls atmospheric hazards but does not replace testing.' },
      { id: 'cs4', label: 'Trained attendant, communication and entry log', required: true, reason: 'The attendant continuously controls and monitors entry.' },
      { id: 'cs5', label: 'Dedicated rescue plan, trained team and equipment ready', required: true, reason: 'Calling public emergency services alone is not an entry rescue plan.' },
      { id: 'cs6', label: 'Let the attendant enter alone if the worker collapses', required: false, reason: 'Unplanned entry can create multiple fatalities.' }
    ]
  },
  {
    id: 'scaffold', title: 'Scaffold Use & Inspection', category: 'Access', risk: 'High', icon: '🪜',
    description: 'A work crew wants to use a scaffold to access a façade. Verify it is complete and safe for use.',
    hazards: ['Collapse or instability', 'Falls from open edges', 'Falling materials', 'Unsafe access or overloading'],
    controls: [
      { id: 'sc1', label: 'Competent erection to approved design/manufacturer rules', required: true, reason: 'The scaffold must follow a recognized safe configuration.' },
      { id: 'sc2', label: 'Sound base plates, sole boards, bracing and ties', required: true, reason: 'Foundation, stiffness and ties provide stability.' },
      { id: 'sc3', label: 'Full decking, guardrails, midrails and toe boards', required: true, reason: 'Complete collective edge and falling-object protection is required.' },
      { id: 'sc4', label: 'Internal ladder/stair access and controlled entry', required: true, reason: 'Climbing the outside frame is unsafe.' },
      { id: 'sc5', label: 'Competent inspection, valid tag and load limit observed', required: true, reason: 'Inspection and loading controls are required before use.' },
      { id: 'sc6', label: 'Move or alter the scaffold while workers remain on it', required: false, reason: 'Unauthorized alteration or movement with occupants is unsafe.' }
    ]
  },
  {
    id: 'material', title: 'Material Loading & Unloading', category: 'Logistics', risk: 'High', icon: '🚚',
    description: 'A delivery truck has arrived with long and heavy materials. Plan unloading and shifting without exposing workers.',
    hazards: ['Vehicle–pedestrian collision', 'Falling or shifting load', 'Crush points', 'Manual-handling injury'],
    controls: [
      { id: 'ma1', label: 'Delivery plan, designated level area and traffic control', required: true, reason: 'Vehicle and pedestrian interfaces must be planned.' },
      { id: 'ma2', label: 'Inspect load stability before releasing restraints', required: true, reason: 'The load may have shifted during transport.' },
      { id: 'ma3', label: 'Suitable rated lifting equipment and competent operators', required: true, reason: 'Mechanical handling must match the load.' },
      { id: 'ma4', label: 'Exclusion zone and hands kept away from pinch points', required: true, reason: 'Workers must not enter the fall/crush zone.' },
      { id: 'ma5', label: 'Use a team/mechanical aid and store material securely', required: true, reason: 'Reduce manual load and prevent later collapse or rolling.' },
      { id: 'ma6', label: 'Climb onto an unsecured load to attach slings', required: false, reason: 'This creates fall and load-movement exposure.' }
    ]
  }
];

const extraWrongControls: Record<string, Control[]> = {
  'hot-work': [
    { id: 'hw7', label: 'Keep the fire extinguisher inside a locked store nearby', required: false, reason: 'Fire equipment must be immediately accessible at the work face.' },
    { id: 'hw8', label: 'Use ordinary cotton clothing because welding will take only 10 minutes', required: false, reason: 'Task duration does not remove burn and ignition hazards.' }
  ],
  'work-height': [
    { id: 'wh7', label: 'Use a ladder from the top two steps to reach the last section', required: false, reason: 'The top steps are not a safe working position and encourage overreaching.' },
    { id: 'wh8', label: 'Continue work during strong wind if the worker feels confident', required: false, reason: 'Weather limits are based on risk and equipment requirements, not confidence.' }
  ],
  excavation: [
    { id: 'ex7', label: 'Use warning tape alone around the vehicle-side edge', required: false, reason: 'A vehicle interface needs rigid protection, stop blocks and traffic control.' },
    { id: 'ex8', label: 'Store excavated soil at the edge to save space', required: false, reason: 'Spoil adds surcharge load and can fall back into the excavation.' }
  ],
  grinding: [
    { id: 'gr7', label: 'Wear only safety glasses; a face shield is unnecessary', required: false, reason: 'Safety glasses alone do not protect the full face from disc fragments and sparks.' },
    { id: 'gr8', label: 'Hold the steel by hand so it can be cut faster', required: false, reason: 'The workpiece must be secured to prevent movement and kickback.' }
  ],
  lifting: [
    { id: 'li7', label: 'Use two signalers at the same time to improve visibility', required: false, reason: 'Conflicting signals can cause unintended crane movement; one designated signaler is required.' },
    { id: 'li8', label: 'Use a forklift to push and steady the suspended load', required: false, reason: 'Plant must not enter the suspended-load zone or contact the load.' }
  ],
  loto: [
    { id: 'lo7', label: 'Use one supervisor lock for the entire maintenance team', required: false, reason: 'Each exposed worker needs personal control of their own lock.' },
    { id: 'lo8', label: 'Remove another worker’s lock when their shift ends', required: false, reason: 'A personal lock requires the formal exceptional-removal procedure.' }
  ],
  'confined-space': [
    { id: 'cs7', label: 'Rely on smell to confirm that the atmosphere is safe', required: false, reason: 'Many lethal atmospheres cannot be detected by human senses.' },
    { id: 'cs8', label: 'Place the gas detector outside the vessel entrance only', required: false, reason: 'Testing must represent the breathing zone and different levels inside the space.' }
  ],
  scaffold: [
    { id: 'sc7', label: 'Use loose bricks instead of sole boards to level the scaffold', required: false, reason: 'Loose masonry is unstable and cannot provide a sound foundation.' },
    { id: 'sc8', label: 'Climb the outside standards because it is quicker', required: false, reason: 'Workers must use the designed internal access system.' }
  ],
  material: [
    { id: 'ma7', label: 'Release all load restraints from the traffic side at once', required: false, reason: 'Restraints must be released through a controlled plan after checking load stability.' },
    { id: 'ma8', label: 'Ask one worker to manually carry a long heavy section', required: false, reason: 'The load needs a suitable mechanical aid or planned team lift.' }
  ]
};

function Person({ role, className = '' }: { role: string; className?: string }) {
  return <div className={`scene-person ${className}`}><span className="hard-hat"/><span className="head"/><span className="torso"><i/></span><span className="arm left"/><span className="arm right"/><span className="leg left"/><span className="leg right"/><b>{role}</b></div>;
}

function ScenarioScene({ id, title, category }: { id: string; title: string; category: string }) {
  const common = <><div className="scene-sky"><i/><i/><i/></div><div className="scene-ground"/><div className="scene-barrier"><i/><i/><i/><i/></div></>;
  let action;
  if (id === 'hot-work') action = <><div className="steel-work"/><Person role="WELDER" className="welder"/><Person role="FIRE WATCH" className="fire-watch"/><div className="weld-tool"/><div className="spark-stream">{[1,2,3,4,5,6,7].map(n=><i key={n}/>)}</div><div className="extinguisher">FIRE</div><div className="fume-cloud"><i/><i/><i/></div></>;
  else if (id === 'work-height') action = <><div className="scaffold-structure"><i/><i/><i/><i/><i/><i/></div><Person role="TECHNICIAN" className="height-worker"/><Person role="SPOTTER" className="height-spotter"/><div className="lanyard-line"/><div className="tool-drop">🔧</div></>;
  else if (id === 'excavation') action = <><div className="excavation-pit"><i/><i/><i/></div><div className="excavator"><span/><b/><i/></div><Person role="BANKSMAN" className="banksman"/><Person role="WORKER" className="pit-worker"/><div className="pit-ladder"/></>;
  else if (id === 'grinding') action = <><div className="grind-bench"/><Person role="OPERATOR" className="grinder-worker"/><Person role="WATCHER" className="grinder-watcher"/><div className="grinder-tool">●</div><div className="grind-sparks">{[1,2,3,4,5,6,7,8].map(n=><i key={n}/>)}</div></>;
  else if (id === 'lifting') action = <><div className="mobile-crane"><span/><b/><i/><em/></div><div className="crane-hook"/><div className="lift-load">STEEL LOAD</div><Person role="RIGGER" className="rigger"/><Person role="SIGNALER" className="signaler"/><div className="tag-line"/></>;
  else if (id === 'loto') action = <><div className="electric-panel"><i/><i/><strong>440V</strong><em>🔒</em></div><Person role="ELECTRICIAN" className="electrician"/><Person role="AUTHORIZED" className="loto-supervisor"/><div className="test-meter"><i/><i/></div><div className="electric-pulse">⚡</div></>;
  else if (id === 'confined-space') action = <><div className="vessel"><i/><strong>VESSEL</strong></div><Person role="ENTRANT" className="entrant"/><Person role="ATTENDANT" className="attendant"/><Person role="RESCUE" className="rescuer"/><div className="tripod"><i/><i/><b/></div><div className="vent-hose"/></>;
  else if (id === 'scaffold') action = <><div className="full-scaffold"><i/><i/><i/><i/><i/><i/><i/><i/><b/><em/></div><Person role="SCAFFOLDER" className="scaffolder"/><Person role="INSPECTOR" className="scaffold-inspector"/><div className="scaffold-board"/></>;
  else action = <><div className="delivery-truck"><span/><b/><i/><em/></div><div className="forklift"><span/><b/><i/></div><div className="material-load">STEEL</div><Person role="DRIVER" className="driver"/><Person role="BANKSMAN" className="material-banksman"/><Person role="RIGGER" className="material-rigger"/></>;
  return <section className={`activity-stage realistic-scene stage-${id}`}>{common}{action}<div className="scene-vignette"/><div className="stage-label"><small>LIVE ACTIVITY · ANIMATED</small><strong>{title}</strong><span>{category}</span></div></section>;
}

export default function SafetySimulator({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<Scenario | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const controls = active ? [...active.controls, ...(extraWrongControls[active.id] || [])] : [];
  const required = controls.filter(c => c.required);
  const correct = required.filter(c => selected.includes(c.id)).length;
  const unsafe = controls.filter(c => !c.required && selected.includes(c.id)).length;
  const score = active ? Math.max(0, Math.round(((correct - unsafe) / required.length) * 100)) : 0;
  const safe = active ? correct === required.length && unsafe === 0 : false;
  const progress = active ? Math.round((selected.length / controls.length) * 100) : 0;
  const feedback = useMemo(() => controls.filter(c => (c.required && !selected.includes(c.id)) || (!c.required && selected.includes(c.id))), [active, selected]);

  const open = (scenario: Scenario) => { setActive(scenario); setSelected([]); setSubmitted(false); scrollTo({ top: 0, behavior: 'smooth' }); };
  if (!active) return <main className="simulator-page">
    <header className="sim-top"><button onClick={onBack}>←</button><div><strong>Practical Safety Simulator</strong><small>You are the HSE Officer</small></div></header>
    <section className="sim-hero"><span>REAL-WORK DECISION TRAINING</span><h1>Inspect. Control.<br/><em>Start safely.</em></h1><p>Choose an activity, identify its hazards and put every essential control in place before allowing work to begin.</p><div><b>{scenarios.length}</b> interactive scenarios</div></section>
    <section className="sim-list"><h2>Select an activity</h2>{scenarios.map(s => <button className="scenario-card" key={s.id} onClick={() => open(s)}><i>{s.icon}</i><div><small>{s.category}</small><h3>{s.title}</h3><p>{s.description}</p></div><span className={`risk-${s.risk.toLowerCase()}`}>{s.risk}</span><b>›</b></button>)}</section>
  </main>;

  return <main className="simulator-page">
    <header className="sim-top"><button onClick={() => setActive(null)}>←</button><div><strong>{active.title}</strong><small>Scenario inspection</small></div></header>
    <ScenarioScene id={active.id} title={active.title} category={active.category}/>
    <section className="scenario-brief"><span className={`risk-${active.risk.toLowerCase()}`}>{active.risk} RISK</span><h1>Make the activity safe</h1><p>{active.description}</p><div className="hazard-tags">{active.hazards.map(h => <span key={h}>⚠ {h}</span>)}</div></section>
    <section className="control-panel"><div className="control-title"><div><small>YOUR SAFETY PLAN</small><h2>Think carefully—select only safe controls</h2></div><b>{selected.length}/{controls.length}</b></div><div className="sim-progress"><i style={{width:`${progress}%`}}/></div>
      <div className="control-options">{controls.map((c, index) => {
        const chosen = selected.includes(c.id); const state = submitted ? c.required ? chosen ? 'correct' : 'missed' : chosen ? 'danger' : 'neutral' : chosen ? 'chosen' : '';
        return <button disabled={submitted} className={state} key={c.id} onClick={() => setSelected(chosen ? selected.filter(id => id !== c.id) : [...selected, c.id])}><span>{submitted ? c.required ? chosen ? '✓' : '!' : chosen ? '×' : '—' : chosen ? '✓' : index + 1}</span><p>{c.label}</p></button>;
      })}</div>
      {!submitted ? <button className="authorize-button" disabled={!selected.length} onClick={() => {setSubmitted(true); scrollTo({top:0,behavior:'smooth'});}}>Authorize Activity →</button> : <section className={safe ? 'sim-result safe' : 'sim-result stop'}><div>{safe ? '✓' : '✋'}</div><small>HSE DECISION · SCORE {score}%</small><h2>{safe ? 'Safe to Start' : 'Stop Work'}</h2><p>{safe ? 'All critical controls are in place. Brief the team, verify conditions and maintain supervision.' : 'The activity cannot start. Correct every missed or unsafe control below.'}</p>{feedback.map(c => <article key={c.id}><b>{c.required ? 'MISSING CONTROL' : 'UNSAFE CHOICE'}</b><strong>{c.label}</strong><span>{c.reason}</span></article>)}<button onClick={() => {setSelected([]);setSubmitted(false);scrollTo({top:0,behavior:'smooth'});}}>Try Scenario Again</button><button className="next-scenario" onClick={() => setActive(null)}>Choose Another Activity</button></section>}
    </section>
  </main>;
}
