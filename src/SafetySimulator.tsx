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
  },
  {
    id: 'mewp', title: 'MEWP / Manlift Operation', category: 'Powered Access', risk: 'Extreme', icon: '🏗️',
    description: 'A technician will use a boom lift beside a structure while vehicles and workers are moving nearby.',
    hazards: ['Entrapment or crushing', 'Machine overturning', 'Fall from platform', 'Collision and falling objects'],
    controls: [
      { id: 'mw1', label: 'Trained authorized operator and machine pre-use inspection', required: true, reason: 'The operator and equipment must be competent and serviceable.' },
      { id: 'mw2', label: 'Firm level ground, outriggers and travel route assessed', required: true, reason: 'Ground and route conditions directly affect stability.' },
      { id: 'mw3', label: 'Barricaded operating zone with a ground spotter', required: true, reason: 'The spotter controls interfaces and overhead/entrapment risk.' },
      { id: 'mw4', label: 'Gate closed, harness attached to designated platform anchor', required: true, reason: 'Platform fall protection must follow manufacturer requirements.' },
      { id: 'mw5', label: 'Emergency lowering tested and ground person familiar with it', required: true, reason: 'A prompt controlled rescue must be possible after failure.' },
      { id: 'mw6', label: 'Stand on the platform handrail for extra reach', required: false, reason: 'Standing on rails defeats platform protection and creates a fall risk.' }
    ]
  },
  {
    id: 'roof-lifeline', title: 'Roof Work & Lifeline', category: 'Roof Safety', risk: 'Extreme', icon: '🏠',
    description: 'A team will install a lifeline and guardrail near an unprotected roof edge and fragile rooflights.',
    hazards: ['Fall from roof edge', 'Fall through fragile surface', 'Dropped tools', 'Suspension after a fall'],
    controls: [
      { id: 'rf1', label: 'Roof survey, access permit and fragile areas identified', required: true, reason: 'The roof condition, access and fragile zones must be known first.' },
      { id: 'rf2', label: 'Collective edge protection or restraint selected before arrest', required: true, reason: 'Preventing access to the fall edge is higher in the hierarchy.' },
      { id: 'rf3', label: 'Certified anchors/lifeline installed to approved design', required: true, reason: 'The system must be engineered and installed by competent persons.' },
      { id: 'rf4', label: 'Weather limits, exclusion zone and tool tethering applied', required: true, reason: 'Wind, dropped objects and people below must be controlled.' },
      { id: 'rf5', label: 'Specific rescue plan and equipment available at roof level', required: true, reason: 'Suspension rescue must be achievable without delay.' },
      { id: 'rf6', label: 'Attach the lanyard to a roof vent or duct support', required: false, reason: 'Building services are not certified fall-protection anchors.' }
    ]
  },
  {
    id: 'forklift', title: 'Forklift Operation', category: 'Mobile Plant', risk: 'High', icon: '🚜',
    description: 'A forklift must move a pallet through a warehouse where pedestrians and blind corners are present.',
    hazards: ['Pedestrian struck by vehicle', 'Forklift overturning', 'Falling load', 'Collision at blind corners'],
    controls: [
      { id: 'fk1', label: 'Licensed operator and documented pre-use inspection', required: true, reason: 'Only competent operators may use a serviceable forklift.' },
      { id: 'fk2', label: 'Pedestrian routes physically separated from forklift lanes', required: true, reason: 'Separation is stronger than relying only on warnings.' },
      { id: 'fk3', label: 'Load within capacity, stable and carried low', required: true, reason: 'Correct loading preserves stability and visibility.' },
      { id: 'fk4', label: 'Speed limit, horn at blind corners and seat belt used', required: true, reason: 'Driving controls reduce collision and overturn injury.' },
      { id: 'fk5', label: 'Banksman used where visibility or reversing is restricted', required: true, reason: 'A controlled signaler is needed when the operator cannot see safely.' },
      { id: 'fk6', label: 'Carry a coworker standing on the forks for a short trip', required: false, reason: 'Forks are not a personnel platform.' }
    ]
  },
  {
    id: 'chemical', title: 'Chemical Handling & Transfer', category: 'COSHH / Hazmat', risk: 'High', icon: '🧪',
    description: 'Workers will transfer a corrosive chemical from a drum into a smaller process container.',
    hazards: ['Skin and eye burns', 'Toxic inhalation', 'Incompatible reaction', 'Spill and environmental release'],
    controls: [
      { id: 'ch1', label: 'Current SDS and chemical risk assessment reviewed', required: true, reason: 'Hazards, incompatibilities and response measures come from verified information.' },
      { id: 'ch2', label: 'Closed transfer pump, bunding and compatible containers', required: true, reason: 'Engineering containment reduces exposure and release.' },
      { id: 'ch3', label: 'Ventilation and ignition control suitable for the chemical', required: true, reason: 'Vapour and flammability controls depend on product properties.' },
      { id: 'ch4', label: 'Chemical gloves, goggles/face shield and protective clothing', required: true, reason: 'PPE must be selected from the SDS and exposure assessment.' },
      { id: 'ch5', label: 'Eyewash, spill kit, labels and trained response available', required: true, reason: 'Exposure and spill response must be immediate and specific.' },
      { id: 'ch6', label: 'Use an unlabelled drinking bottle for easier pouring', required: false, reason: 'Unlabelled food containers can cause poisoning and uncontrolled reactions.' }
    ]
  },
  {
    id: 'pressure-test', title: 'Pressure Testing', category: 'Stored Energy', risk: 'Extreme', icon: '🧯',
    description: 'A newly installed pipe section will be hydrostatically pressure-tested before handover.',
    hazards: ['Pipe or fitting rupture', 'Projectile from temporary fittings', 'High-pressure fluid injection', 'Uncontrolled depressurization'],
    controls: [
      { id: 'pt1', label: 'Approved test pack, test limits and calibrated gauges', required: true, reason: 'The system, medium, pressure and acceptance criteria must be authorized.' },
      { id: 'pt2', label: 'Rated fittings, restraints and temporary connections inspected', required: true, reason: 'Every pressure boundary component must withstand the test.' },
      { id: 'pt3', label: 'Rigid exclusion zone with remote pressurization where possible', required: true, reason: 'People must remain outside the potential line of fire.' },
      { id: 'pt4', label: 'Pressure raised in controlled stages while checking remotely', required: true, reason: 'Staged pressurization helps identify abnormal behaviour safely.' },
      { id: 'pt5', label: 'Controlled depressurization and zero energy verified', required: true, reason: 'The system remains hazardous until all stored pressure is released.' },
      { id: 'pt6', label: 'Tighten a leaking fitting while the line remains pressurized', required: false, reason: 'No adjustment is permitted on an energized pressure boundary.' }
    ]
  },
  {
    id: 'demolition', title: 'Demolition Work', category: 'Structural Work', risk: 'Extreme', icon: '🏚️',
    description: 'A crew will demolish part of a block wall inside an area containing hidden services and adjacent workers.',
    hazards: ['Unplanned structural collapse', 'Hidden electrical or utility services', 'Flying debris and silica dust', 'Noise and falling material'],
    controls: [
      { id: 'dm1', label: 'Engineering survey and approved demolition sequence', required: true, reason: 'Structural behaviour and the safe sequence must be established.' },
      { id: 'dm2', label: 'All services located, isolated and verified dead', required: true, reason: 'Hidden live services can cause fatal contact or release.' },
      { id: 'dm3', label: 'Rigid exclusion zone and controlled debris route', required: true, reason: 'People must be separated from collapse and falling-material zones.' },
      { id: 'dm4', label: 'Dust suppression/extraction and suitable respiratory protection', required: true, reason: 'Silica and nuisance dust require source and personal controls.' },
      { id: 'dm5', label: 'Correct tools, temporary support and continuous supervision', required: true, reason: 'The method must maintain stability throughout demolition.' },
      { id: 'dm6', label: 'Start from the bottom so the wall falls quickly', required: false, reason: 'Undercutting creates an uncontrolled structural collapse.' }
    ]
  },
  {
    id: 'roadwork', title: 'Roadwork & Traffic Control', category: 'Traffic Management', risk: 'Extreme', icon: '🚦',
    description: 'Workers must repair a roadside barrier next to live moving traffic during daytime operations.',
    hazards: ['Vehicle entering work zone', 'Worker struck by traffic', 'Plant reversing', 'Poor driver warning and visibility'],
    controls: [
      { id: 'rd1', label: 'Approved traffic-management plan and road authority permit', required: true, reason: 'The road layout and controls require formal authorization.' },
      { id: 'rd2', label: 'Advance warning signs, taper, barriers and safe buffer zone', required: true, reason: 'Drivers need progressive warning and physical channelization.' },
      { id: 'rd3', label: 'Trained traffic marshals with agreed communication', required: true, reason: 'Vehicle movement must be coordinated by competent personnel.' },
      { id: 'rd4', label: 'High-visibility PPE and suitable task lighting/visibility', required: true, reason: 'Workers must remain conspicuous in changing conditions.' },
      { id: 'rd5', label: 'Plant–people separation and protected site access/egress', required: true, reason: 'Internal movements must not introduce another collision risk.' },
      { id: 'rd6', label: 'Stand in the live lane and wave vehicles around the worker', required: false, reason: 'A person must not substitute for a planned protected traffic arrangement.' }
    ]
  },
  {
    id: 'concrete', title: 'Concrete Pouring', category: 'Civil Work', risk: 'High', icon: '🏗️',
    description: 'A team will place concrete using a pump hose over reinforcement and temporary formwork.',
    hazards: ['Hose whip and line failure', 'Formwork collapse', 'Cement burns', 'Trips, impalement and plant movement'],
    controls: [
      { id: 'cn1', label: 'Formwork inspection and pour authorization completed', required: true, reason: 'The temporary works must support the planned pour load.' },
      { id: 'cn2', label: 'Pump, pipeline, clamps and hose inspected and secured', required: true, reason: 'Pressure components and end hose must be serviceable and controlled.' },
      { id: 'cn3', label: 'Exclusion zone with one trained pump signaler', required: true, reason: 'Workers must stay clear of hose-whip and plant zones.' },
      { id: 'cn4', label: 'Safe access, rebar caps and good hose/cable housekeeping', required: true, reason: 'Access and impalement/trip hazards must be controlled.' },
      { id: 'cn5', label: 'Waterproof gloves, boots, eye protection and washing facilities', required: true, reason: 'Wet cement can cause serious chemical burns.' },
      { id: 'cn6', label: 'Kink the delivery hose by hand to stop concrete flow', required: false, reason: 'Manual kinking exposes the worker to pressure release and hose whip.' }
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
  ],
  mewp: [
    { id: 'mw7', label: 'Drive the raised boom quickly to save setup time', required: false, reason: 'Elevated travel is restricted and must follow manufacturer conditions and route assessment.' },
    { id: 'mw8', label: 'Use the platform to lift loose steel materials', required: false, reason: 'A MEWP is a personnel platform, not a crane or material carrier.' }
  ],
  'roof-lifeline': [
    { id: 'rf7', label: 'Walk directly on rooflights because they appear strong', required: false, reason: 'Rooflights must be treated as fragile unless proven otherwise.' },
    { id: 'rf8', label: 'Work alone so fewer people are exposed on the roof', required: false, reason: 'Lone work prevents timely assistance and makes fall rescue ineffective.' }
  ],
  forklift: [
    { id: 'fk7', label: 'Travel forward with a high load even when visibility is blocked', required: false, reason: 'The operator must maintain a clear view and use a safe alternative direction or spotter.' },
    { id: 'fk8', label: 'Leave the forklift parked with forks raised', required: false, reason: 'Forks must be lowered, brake applied and truck secured when unattended.' }
  ],
  chemical: [
    { id: 'ch7', label: 'Mix leftover chemicals together to reduce waste containers', required: false, reason: 'Unknown mixtures can react violently or release toxic gas.' },
    { id: 'ch8', label: 'Wash a chemical spill into the nearest floor drain', required: false, reason: 'This spreads contamination and can create an environmental release.' }
  ],
  'pressure-test': [
    { id: 'pt7', label: 'Use compressed air instead of water without changing the plan', required: false, reason: 'Pneumatic testing stores far more energy and needs a separate engineered assessment.' },
    { id: 'pt8', label: 'Stand beside the temporary blind to read the gauge', required: false, reason: 'Temporary fittings and end closures are high-energy line-of-fire locations.' }
  ],
  demolition: [
    { id: 'dm7', label: 'Allow other trades to continue working behind the wall', required: false, reason: 'Adjacent people must be excluded from the collapse and debris zone.' },
    { id: 'dm8', label: 'Use dry sweeping to remove silica dust', required: false, reason: 'Dry sweeping re-suspends respirable dust; use controlled wet or filtered methods.' }
  ],
  roadwork: [
    { id: 'rd7', label: 'Remove the advance warning signs to prevent traffic slowing down', required: false, reason: 'Drivers need enough distance to perceive, react and merge safely.' },
    { id: 'rd8', label: 'Park the work vehicle facing traffic without a buffer zone', required: false, reason: 'Vehicle position and buffers must follow the approved traffic plan.' }
  ],
  concrete: [
    { id: 'cn7', label: 'Stand directly in front of the pump hose outlet', required: false, reason: 'The hose outlet is a high-energy line-of-fire location.' },
    { id: 'cn8', label: 'Clean wet cement from skin only at the end of the shift', required: false, reason: 'Contaminated skin and clothing require immediate washing and removal.' }
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
  else if (id === 'mewp') action = <><div className="mewp-machine"><span/><b/><i/><em/></div><div className="mewp-basket"><Person role="OPERATOR" className="mewp-operator"/></div><Person role="SPOTTER" className="mewp-spotter"/><div className="mewp-building"/><div className="mewp-warning">OVERHEAD</div></>;
  else if (id === 'roof-lifeline') action = <><div className="roof-surface"><i/><i/><i/></div><div className="roof-edge"/><div className="roof-lifeline"><i/><i/><i/></div><Person role="INSTALLER" className="roof-installer"/><Person role="SUPERVISOR" className="roof-supervisor"/><div className="roof-lanyard"/><div className="fragile-light">FRAGILE</div></>;
  else if (id === 'forklift') action = <><div className="warehouse-rack"><i/><i/><i/><b/><b/><b/></div><div className="forklift warehouse-forklift"><span/><b/><i/></div><div className="pallet-load">PALLET</div><Person role="OPERATOR" className="forklift-operator"/><Person role="BANKSMAN" className="forklift-banksman"/><div className="pedestrian-lane"/></>;
  else if (id === 'chemical') action = <><div className="chemical-drum">CORROSIVE</div><div className="chemical-container">PROCESS</div><div className="transfer-hose"/><Person role="OPERATOR" className="chemical-worker"/><Person role="WATCHER" className="chemical-watcher"/><div className="chemical-flow"/><div className="eyewash">EYEWASH</div></>;
  else if (id === 'pressure-test') action = <><div className="test-pipe"><i/><i/><i/><b/></div><div className="pressure-gauge"><i/><b>250</b></div><div className="test-pump">PUMP</div><Person role="TEST ENGINEER" className="test-engineer"/><Person role="WATCHER" className="test-watcher"/><div className="pressure-wave"/></>;
  else if (id === 'demolition') action = <><div className="demo-wall">{[1,2,3,4,5,6,7,8,9,10,11,12].map(n=><i key={n}/>)}</div><Person role="OPERATOR" className="demo-worker"/><Person role="SPOTTER" className="demo-spotter"/><div className="demo-hammer">▰</div><div className="demo-debris">{[1,2,3,4,5].map(n=><i key={n}/>)}</div><div className="dust-cloud"><i/><i/><i/></div></>;
  else if (id === 'roadwork') action = <><div className="road-lanes"><i/><i/></div><div className="traffic-car"><i/><b/></div><div className="traffic-cones">{[1,2,3,4,5].map(n=><i key={n}/>)}</div><Person role="MARSHAL" className="road-marshal"/><Person role="WORKER" className="road-worker"/><div className="road-sign">WORK<br/>AHEAD</div></>;
  else if (id === 'concrete') action = <><div className="concrete-form"><i/><i/><i/></div><div className="pump-boom"><i/><b/></div><div className="pour-hose"/><div className="concrete-flow"/><Person role="PUMP MAN" className="pump-man"/><Person role="SIGNALER" className="pour-signaler"/><Person role="WORKER" className="pour-worker"/></>;
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
