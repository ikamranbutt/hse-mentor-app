import json
import re
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'modules.json'

roadmap = [
 (6,'intermediate','Work at Height and Fall Protection','Plan, control and supervise work at height using prevention and protection principles.',[
  'Work-at-Height Planning and Authorization','Avoiding Work at Height','Collective Fall Prevention','Personal Fall Restraint','Fall-Arrest Systems','Anchorage and Lifelines','Ladders and Access Equipment','Fragile Surfaces and Openings','Dropped-Object Prevention','Rescue Planning After a Fall']),
 (7,'intermediate','Scaffolding and Safe Access','Understand scaffold components, inspection, access and safe-use requirements.',[
  'Scaffold Types and Selection','Foundations, Sole Boards and Base Plates','Standards, Ledgers and Transoms','Bracing, Ties and Stability','Platforms, Guardrails and Toe Boards','Safe Scaffold Access','Mobile and Tower Scaffolds','Loading and Material Control','Inspection, Tagging and Handover','Alteration and Dismantling Controls']),
 (8,'intermediate','Lifting, Rigging and Material Handling','Control lifting operations, rigging equipment, suspended loads and material movement.',[
  'Roles in a Lifting Operation','Lift Planning and Risk Assessment','Crane Capacity and Load Charts','Slings, Shackles and Accessories','Basic Sling Angles and Load Effects','Pre-use Inspection and Rejection','Signalling and Communication','Exclusion Zones and Suspended Loads','Critical and Non-routine Lifts','Mechanical and Manual Material Handling']),
 (9,'intermediate','Electrical Safety and Energy Isolation','Recognize electrical hazards and apply safe isolation and lockout principles.',[
  'Electricity, Shock and Arc Hazards','Temporary Power Distribution Systems','Cables, Plugs and Portable Tools','Grounding, Protection and RCDs','Authorized Persons and Boundaries','Energy-Isolation Planning','Lockout and Tagout Steps','Verification of Zero Energy','Stored and Multiple Energy Sources','Re-energization and Handover']),
 (10,'intermediate','High-Risk Work Controls','Apply coordinated controls to hot work, confined spaces and excavation activities.',[
  'Permit-to-Work Coordination','Hot-Work Fire Prevention','Fire Watch and Post-work Monitoring','Gas Testing Fundamentals','Confined-Space Hazard Assessment','Confined-Space Entry Roles','Ventilation and Communication','Confined-Space Rescue Readiness','Excavation Stability and Services','Excavation Access and Inspection']),
 (11,'advanced','Advanced Risk Management and Safe Systems','Develop and review practical risk assessments, JSA and safe work documentation.',[
  'Risk Context and Scope Definition','Task Breakdown for JSA','Hazard Identification Workshops','Human and Organizational Factors','Risk Evaluation and Uncertainty','Control Selection and Critical Controls','Method Statement Development','Simultaneous Operations and Interfaces','Management of Change','Assurance and Control Verification']),
 (12,'advanced','Incident Investigation and Root Cause Analysis','Preserve evidence, analyze causes and develop actions that prevent recurrence.',[
  'Immediate Response and Scene Control','Evidence Collection and Records','Witness Interviews','Event Timelines and Mapping','Immediate and Underlying Causes','Five Whys and Cause Trees','Barrier and Control Failure Analysis','Human Factors Without Blame','Corrective-Action Quality','Learning, Communication and Closure']),
 (13,'advanced','Occupational Health and Industrial Hygiene','Recognize, assess and control workplace health exposures.',[
  'Occupational Health Risk Principles','Routes and Duration of Exposure','Noise and Hearing Conservation','Respirable Dust and Silica','Chemicals and Toxic Substances','Heat Stress and Hydration','Ergonomics and Musculoskeletal Risk','Respiratory Protection Programs','Exposure Monitoring and Health Surveillance','Psychosocial Risk and Worker Wellbeing']),
 (14,'advanced','Environmental Protection and Sustainability','Control environmental aspects, waste, spills and resource impacts.',[
  'Environmental Aspects and Impacts','Legal and Permit Obligations','Waste Hierarchy and Segregation','Hazardous-Waste Control','Spill Prevention and Response','Air Emissions and Dust Control','Water, Drainage and Pollution Prevention','Noise and Community Impact','Resource Efficiency and Carbon Awareness','Environmental Inspection and Reporting']),
 (15,'advanced','Emergency, Rescue and Crisis Coordination','Coordinate credible emergency scenarios, rescue interfaces and recovery.',[
  'Emergency Risk Assessment','Command, Control and Escalation','Communication and Alarm Resilience','Fire and Explosion Scenarios','Medical and Multiple-Casualty Events','Chemical Release and Shelter Decisions','Work-at-Height Rescue Coordination','Confined-Space Rescue Coordination','Drills and Performance Evaluation','Business Continuity and Recovery']),
 (16,'management','HSE Management Systems and ISO 45001','Understand the structure and operation of an occupational health and safety management system.',[
  'Management-System Principles','Organizational Context and Interested Parties','Leadership and Worker Participation','Policy and Accountabilities','Hazard, Risk and Opportunity Planning','Objectives and Improvement Plans','Competence, Awareness and Communication','Operational Planning and Control','Performance Evaluation and Internal Audit','Management Review and Continual Improvement']),
 (17,'management','HSE Leadership and Safety Culture','Lead visible, fair and learning-focused safety performance.',[
  'Leadership Commitment and Credibility','Visible Leadership in the Field','Worker Consultation and Participation','Psychological Safety and Speaking Up','Just Culture and Accountability','Behaviour and System Influences','Coaching and Safety Conversations','Decision-making Under Pressure','Learning Culture and Organizational Memory','Leading Sustainable Change']),
 (18,'management','Compliance, Auditing and Assurance','Build legal registers, audit systems and evidence-based assurance programs.',[
  'Identifying Applicable Requirements','Compliance Registers and Ownership','Inspection versus Audit','Risk-based Audit Planning','Audit Evidence and Sampling','Interviewing and Document Review','Classifying Findings','Corrective Action and Verification','Contractor and Supply-chain Assurance','Reporting to Senior Management']),
 (19,'management','Contractor and Project HSE Management','Control HSE through design, procurement, mobilization, execution and closeout.',[
  'HSE in Project Planning and Design','Contractor Prequalification','Tender and Contract HSE Requirements','Mobilization Readiness Review','Roles, Interfaces and Coordination','Construction Phase HSE Plans','Subcontractor Control','Change, Schedule and Production Pressure','Commissioning and Handover Safety','Demobilization and Lessons Learned']),
 (20,'management','HSE Performance and Strategic Improvement','Use meaningful indicators, reviews and improvement programs to manage performance.',[
  'HSE Strategy and Business Alignment','Leading and Lagging Indicators','Selecting Meaningful KPIs','Data Quality and Reporting Discipline','Trend and Repeat-event Analysis','Critical-Control Performance','Management Dashboards','Benchmarking and Maturity Models','Improvement Project Prioritization','Annual Review and Future Planning'])
]

def slug(text):
    return re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-')

def make_question(qid, prompt, correct, distractors, explanation, correct_index):
    options = distractors[:]
    options.insert(correct_index, correct)
    return {'id':qid,'prompt':prompt,'options':options,'correctIndex':correct_index,'explanation':explanation}

def build_lesson(module_order, lesson_order, title, description):
    lid=f'l{module_order}-{lesson_order}-{slug(title)}'
    sections=[
      {'heading':'Purpose and Application','points':[
        f'{title} is a core part of {description[0].lower()+description[1:]}',
        'The process must match the actual task, people, equipment, location, environment and applicable organizational requirements.',
        'Only trained, competent and authorized people should perform duties that require formal competence or authorization.'
      ]},
      {'heading':'Practical Control Process','points':[
        'Define the scope, identify credible hazards and people who may be affected, then verify controls before exposure begins.',
        'Give priority to elimination, substitution and engineered protection before relying on procedures, training or PPE.',
        'Communicate roles and stop-work conditions clearly, supervise the work and keep required evidence or records.'
      ]},
      {'heading':'Field Scenario','points':[
        f'During a field check, the team finds that conditions affecting {title.lower()} have changed. Work is paused, the change is assessed, controls are corrected and the team is re-briefed before authorization to restart.',
        'Never continue only because a permit, checklist or earlier assessment exists; documents support control but do not replace physical verification.'
      ]},
      {'heading':'Lesson Summary','points':[
        f'Apply {title.lower()} through competent planning, verified controls, clear communication and reassessment whenever conditions change.'
      ]}
    ]
    qs=[
      make_question(f'{lid}-q1',f'What is the best first approach to {title.lower()}?','Define the task and assess actual hazards',['Start immediately','Rely only on PPE','Copy an unrelated form'],'Planning must reflect the real work and conditions.',1),
      make_question(f'{lid}-q2','What should happen when conditions or scope change significantly?','Stop and reassess',['Continue under the old plan','Reduce supervision','Wait until the job is finished'],'Change may invalidate the existing controls.',2),
      make_question(f'{lid}-q3','What confirms that a control is effective?','Field verification and monitoring',['A signature alone','A verbal assumption','The document title'],'Controls must be implemented and verified in practice.',0)
    ]
    return {'id':lid,'order':lesson_order,'title':title,'estimatedMinutes':2,'summary':sections[-1]['points'][0],'contentStatus':'ready','sections':sections,'questions':qs}

def build_module(order, level, title, description, lessons):
    built=[build_lesson(order,i+1,t,description) for i,t in enumerate(lessons)]
    pool=[q for lesson in built for q in lesson['questions']]
    exam=[]
    for i,q in enumerate(pool[:25],1):
        exam.append({**q,'id':f'm{order}-exam-q{i}','explanation':'Result details are protected. Review the related lesson before another attempt.'})
    return {'id':f'{level}-module-{order}','order':order,'level':level,'title':title,'description':description,'passingScore':80,'lessons':built,'finalAssessment':exam}

modules=json.loads(DATA.read_text(encoding='utf-8'))
modules=modules[:5]+[build_module(*item) for item in roadmap]
DATA.write_text(json.dumps(modules,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Built {len(modules)} modules, {sum(len(m["lessons"]) for m in modules)} lessons, '
      f'{sum(sum(len(l["questions"]) for l in m["lessons"]) for m in modules)} practice questions, '
      f'{sum(len(m["finalAssessment"]) for m in modules)} exam questions')
