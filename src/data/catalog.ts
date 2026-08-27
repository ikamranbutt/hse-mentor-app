import type { Module } from '../types';

const lesson = (module: number, order: number, title: string): Module['lessons'][number] => ({
  id: `f-m${module}-l${order}`,
  order,
  title,
  estimatedMinutes: 10,
  summary: 'Full verified lesson content will be imported from the approved HSE Mentor master module.',
  contentStatus: 'import_pending',
  questions: []
});

export const catalog: Module[] = [
  {
    id: 'foundation-module-1', order: 1, level: 'foundation',
    title: 'Introduction to Workplace Safety',
    description: 'Core safety concepts, responsibilities, reporting and emergency basics.', passingScore: 80,
    lessons: [
      'What Is Health and Safety?', 'Hazard and Risk Difference', 'Common Workplace Hazards',
      'Employer and Employee Responsibilities', 'Reporting Hazards, Near Misses and Incidents',
      'Basic Emergency Actions', 'Hierarchy of Controls', 'Personal Protective Equipment',
      'Safe Systems of Work and Permit to Work', 'Safety Signs and Workplace Communication'
    ].map((t, i) => lesson(1, i + 1, t))
  },
  {
    id: 'foundation-module-2', order: 2, level: 'foundation',
    title: 'Hazard Identification and Risk Assessment',
    description: 'Find hazards, assess risk and select effective controls.', passingScore: 80,
    lessons: [
      'Introduction to Hazard Identification', 'Hazard, Unsafe Act and Unsafe Condition',
      'Methods of Identifying Hazards', 'Who Might Be Harmed and How', 'Likelihood and Severity',
      'Using a 5x5 Risk Matrix', 'Initial and Residual Risk', 'Selecting Controls Using the Hierarchy',
      'Recording and Reviewing Risk Assessments', 'Practical Risk Assessment Scenario'
    ].map((t, i) => lesson(2, i + 1, t))
  },
  {
    id: 'foundation-module-3', order: 3, level: 'foundation',
    title: 'Core Workplace Safety Practices',
    description: 'Ten essential controls used across workplaces.', passingScore: 80,
    lessons: [
      'Personal Protective Equipment', 'Housekeeping, Slips and Trips', 'Manual Handling and Ergonomics',
      'Hand and Power Tool Safety', 'Electrical Safety', 'Fire Safety and Hot Work', 'Work at Height',
      'Lifting Operations', 'Mobile Plant and Pedestrian Safety', 'Chemical Safety and SDS'
    ].map((t, i) => lesson(3, i + 1, t))
  },
  {
    id: 'foundation-module-4', order: 4, level: 'foundation',
    title: 'Emergency Preparedness and Incident Management',
    description: 'Prepare, respond, report and learn from emergencies.', passingScore: 80,
    lessons: [
      'Emergency Planning and Responsibilities', 'Emergency Alarms and Communication',
      'Evacuation, Assembly and Accountability', 'Fire Emergency Response',
      'Medical Emergencies and First Aid', 'Chemical Spill and Release Response',
      'Rescue Planning and Responder Safety', 'Incident and Near-Miss Reporting',
      'Scene Preservation and Basic Investigation', 'Emergency Drills, Review and Improvement'
    ].map((t, i) => lesson(4, i + 1, t))
  },
  {
    id: 'foundation-module-5', order: 5, level: 'foundation',
    title: 'Construction Safety Fundamentals',
    description: 'Essential controls for common construction activities.', passingScore: 80,
    lessons: [
      'Site Induction, Access and Daily Coordination', 'Permit to Work and Pre-task Briefing',
      'Excavation and Trenching Safety', 'Scaffolding Safety', 'Ladders and Stepladders',
      'Confined Space Entry', 'Hot Work, Welding and Cutting', 'Lifting and Rigging on Construction Sites',
      'Temporary Electrical Installations', 'Heat Stress and Extreme Weather'
    ].map((t, i) => lesson(5, i + 1, t))
  }
];
