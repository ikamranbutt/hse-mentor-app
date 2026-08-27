import { useEffect, useMemo, useState } from 'react';
import { catalog } from './data/catalog';
import type { Lesson, Module, Question } from './types';

function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  return <button className={`module-card ${module.level}`} onClick={onOpen}>
    <span className="module-number">{module.level.toUpperCase()} · MODULE {module.order}</span>
    <h3>{module.title}</h3>
    <div className="module-meta"><span>{module.lessons.length} lessons</span><span>{module.finalAssessment.length} exam questions</span></div>
  </button>;
}

function SafetyHero({ modules, lessons, questions }: { modules: number; lessons: number; questions: number }) {
  return <section className="safety-hero">
    <svg className="site-silhouette" viewBox="0 0 800 260" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3"><path d="M38 228V88h92v140M38 120h92M65 88V45h38v43M210 228V52M170 52h226M210 52l65 176M328 52v35M315 87h26M480 228V115h104v113M480 148h104M622 228V82h122v146M622 120h122" /><path d="M0 228h800M95 228l42-70 42 70M540 228l37-57 37 57" /></g>
    </svg>
    <div className="hero-grid">
      <div className="hero-copy">
        <div className="hero-brand"><div className="reflective-check"><span>✓</span></div><div><small>PROFESSIONAL SAFETY LEARNING</small><h1>HSE Mentor</h1></div></div>
        <h2>Learn safely.<br /><em>Think practically.</em></h2>
        <p>Real workplace knowledge for safer decisions, stronger skills and confident HSE professionals.</p>
      </div>
      <div className="ppe-stage" aria-label="Animated construction safety equipment">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="ppe-card helmet-card"><svg viewBox="0 0 100 80"><path d="M18 51c1-21 14-37 32-37s31 16 32 37" /><path d="M11 51h78v12H11zM50 14v37M29 20l8 31M71 20l-8 31" /></svg><span>HELMET</span></div>
        <div className="ppe-card vest-card"><svg viewBox="0 0 100 90"><path d="M30 13h15l5 17 5-17h15l17 18-13 14v34H26V45L13 31z" /><path d="M26 51h48M42 31l-8 48M58 31l8 48" /></svg><span>BODY</span></div>
        <div className="ppe-card glove-card"><svg viewBox="0 0 100 90"><path d="M31 74c-9-12-13-25-15-40-1-7 8-9 10-2l4 15-2-27c0-8 10-8 11-1l2 24 1-29c1-7 11-7 11 1l1 28 3-24c1-7 11-6 10 2l-2 27 5-15c3-7 12-3 9 5l-9 28c-3 9-10 13-20 13-8 0-14-1-19-5z" /></svg><span>HANDS</span></div>
        <div className="ppe-card boot-card"><svg viewBox="0 0 110 85"><path d="M18 12h39v34c7 8 15 12 29 14 9 1 13 6 11 13H14c-4-9-2-18 4-27z" /><path d="M16 58h42M60 60l-5 13M26 18h28M26 29h28" /></svg><span>FOOTWEAR</span></div>
        <svg className="hse-officer" viewBox="0 0 180 300" role="img" aria-label="HSE Officer wearing green helmet, high visibility vest and safety shoes">
          <ellipse className="officer-shadow" cx="90" cy="285" rx="57" ry="10" />
          <path className="officer-leg" d="M59 188h29l-5 81H51zM92 188h29l9 81H96z" />
          <path className="officer-shoe" d="M50 263h34l7 15c1 5-2 8-8 8H43c-7 0-8-8-2-13zM97 263h34l12 11c5 5 1 12-7 12H98c-6 0-9-5-6-10z" />
          <path className="officer-shirt" d="M47 98c12-14 25-19 43-19s32 5 44 19l-9 99H54z" />
          <path className="officer-arm" d="M50 102c-12 8-20 35-25 63-2 11 12 15 17 5l19-50M131 101c15 14 20 33 24 60 2 11-12 15-17 4l-19-47" />
          <path className="officer-hand" d="M22 162c8-6 19-2 21 7 1 7-6 14-14 12-9-2-13-12-7-19zM138 162c7-7 18-5 22 4 3 8-3 16-11 17-9 1-17-12-11-21z" />
          <rect className="clipboard" x="17" y="126" width="40" height="54" rx="5" transform="rotate(8 37 153)" />
          <path className="clipboard-paper" d="M25 136l27 4-5 33-27-4zM29 147l17 3M28 154l17 3M27 161l12 2" />
          <path className="officer-neck" d="M77 70h27v22H77z" /><ellipse className="officer-face" cx="90" cy="57" rx="31" ry="35" />
          <path className="officer-ear" d="M59 54c-9-3-10 17 2 17M120 54c9-3 10 17-2 17" /><path className="officer-detail" d="M78 58h7M96 58h7M83 72c5 4 10 4 15 0" />
          <path className="green-helmet" d="M56 48c1-27 14-43 34-43s34 16 35 43z" /><path className="helmet-rim" d="M48 44h84v13H48z" /><path className="helmet-detail" d="M90 7v39M68 14l8 32M112 14l-8 32" />
          <path className="safety-vest" d="M60 88h21l9 22 9-22h22l13 105H47z" /><path className="vest-opening" d="M81 88l9 22 9-22 8 105H73z" />
          <path className="reflective-band" d="M52 126h77l3 15H50zM57 166h70l2 15H54z" /><path className="vest-stripe" d="M67 91l-8 102M113 91l8 102" />
          <rect className="hse-badge" x="78" y="143" width="25" height="17" rx="3" /><text x="90.5" y="155">HSE</text>
          <path className="radio" d="M112 91h15v29h-15zM119 91l6-13" /><circle className="radio-dot" cx="119.5" cy="112" r="3" />
          <text className="officer-label" x="90" y="298">HSE OFFICER</text>
        </svg>
      </div>
    </div>
    <div className="hero-stats"><strong>{modules}<small>Modules</small></strong><strong>{lessons}<small>Lessons</small></strong><strong>{questions}<small>Questions</small></strong></div>
    <div className="safety-stripe"><span>PLAN</span><i /> <span>LEARN</span><i /> <span>CONTROL</span><i /> <span>PROTECT</span></div>
  </section>;
}

function QuestionCard({ question, number }: { question: Question; number: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  return <article className="question-card">
    <strong>Question {number}</strong><h3>{question.prompt}</h3>
    <div className="options">{question.options.map((option, index) => {
      const className = answered ? index === question.correctIndex ? 'correct' : index === selected ? 'wrong' : '' : '';
      return <button key={option} className={className} disabled={answered} onClick={() => setSelected(index)}>
        <b>{String.fromCharCode(65 + index)}</b>{option}
      </button>;
    })}</div>
    {answered && <p className={selected === question.correctIndex ? 'feedback good' : 'feedback bad'}>
      {selected === question.correctIndex ? 'Correct. ' : 'Not correct. '}{question.explanation}
    </p>}
  </article>;
}

function Header({ onBack }: { onBack: () => void }) {
  return <header className="topbar"><button className="back" onClick={onBack}>←</button><div><strong>HSE Mentor</strong><small>Foundation Level</small></div></header>;
}

function LessonView({ lesson, nextLesson, isCompleted, onComplete, onNext, onBack }: { lesson: Lesson; nextLesson?: Lesson; isCompleted: boolean; onComplete: () => void; onNext: () => void; onBack: () => void }) {
  const [remaining, setRemaining] = useState(isCompleted ? 0 : lesson.estimatedMinutes * 60);
  useEffect(() => {
    if (isCompleted || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [isCompleted, remaining]);
  useEffect(() => { if (remaining === 0 && !isCompleted) onComplete(); }, [remaining, isCompleted, onComplete]);
  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const readProgress = isCompleted ? 100 : Math.round(((lesson.estimatedMinutes * 60 - remaining) / (lesson.estimatedMinutes * 60)) * 100);
  return <main><Header onBack={onBack} />
    <section className="module-hero"><span>LESSON {lesson.order}</span><h1>{lesson.title}</h1><p>{lesson.estimatedMinutes} minutes · 3 practice questions</p></section>
    <section className={isCompleted ? 'reading-timer complete' : 'reading-timer'}>
      <div className="reading-timer-top"><div><small>{isCompleted ? 'LESSON COMPLETED' : 'READING TIME'}</small><strong>{isCompleted ? 'Next lesson unlocked' : `${mins}:${secs}`}</strong></div><div className="timer-icon">{isCompleted ? '✓' : '◷'}</div></div>
      <div className="reading-progress"><div style={{ width: `${readProgress}%` }} /></div>
      {!isCompleted && <p>Keep this lesson open until the reading timer finishes. The next lesson will then unlock automatically.</p>}
    </section>
    <section className="reader">
      {lesson.sections.map((section, index) => <article className="content-card" key={`${section.heading}-${index}`}>
        <h2>{section.heading}</h2>{section.points.map((point, i) => <p key={i}>{point}</p>)}
      </article>)}
      <div className="quiz-heading"><span>PRACTICE</span><h2>Check your understanding</h2><p>Select one answer. The correct answer and explanation appear immediately.</p></div>
      {lesson.questions.map((question, index) => <QuestionCard key={question.id} question={question} number={index + 1} />)}
      <section className={isCompleted ? 'next-lesson-panel unlocked' : 'next-lesson-panel locked'}>
        <div className="next-state-icon">{isCompleted ? '✓' : '🔒'}</div>
        <div><small>{nextLesson ? 'NEXT LESSON' : 'MODULE LESSONS'}</small><h2>{nextLesson ? nextLesson.title : 'All lessons completed'}</h2>
          <p>{isCompleted ? nextLesson ? 'Reading time completed. Your next lesson is ready.' : 'Return to the module and start your final assessment.' : `Complete the remaining ${mins}:${secs} reading time to unlock.`}</p></div>
        <button className="primary" disabled={!isCompleted} onClick={onNext}>{nextLesson ? 'Start Next Lesson →' : 'Back to Module →'}</button>
      </section>
    </section>
  </main>;
}

function ExamView({ module, onBack }: { module: Module; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => setTimeLeft(value => {
      if (value <= 1) {
        window.clearInterval(timer);
        setSubmitted(true);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);
  const score = module.finalAssessment.reduce((total, q) => total + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
  const percentage = Math.round((score / module.finalAssessment.length) * 100);
  const wrong = module.finalAssessment.length - score;
  const question = module.finalAssessment[current];
  const selected = answers[question.id];
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const reset = () => { setAnswers({}); setSubmitted(false); setCurrent(0); setTimeLeft(60 * 60); scrollTo({ top: 0, behavior: 'smooth' }); };

  if (submitted) return <main><Header onBack={onBack} />
    <section className="exam-result-screen">
      <div className="result-burst">✓</div>
      <span>MODULE {module.order} RESULT</span>
      <h1>{percentage >= module.passingScore ? 'Assessment Passed' : 'Keep Learning'}</h1>
      <p>{percentage >= module.passingScore ? 'Excellent work. You achieved the required passing score.' : 'Review the lessons and try again when you are ready.'}</p>
      <div className="score-ring" style={{ '--score': `${percentage * 3.6}deg` } as React.CSSProperties}><div><strong>{percentage}%</strong><small>Score</small></div></div>
      <div className="result-counts"><div className="right-count"><strong>{score}</strong><span>Correct</span></div><div className="wrong-count"><strong>{wrong}</strong><span>Incorrect</span></div></div>
      <div className="privacy-note">Answers are not displayed after submission. Start a new attempt to test your knowledge again.</div>
      <button className="primary result-action" onClick={reset}>Start New Attempt</button>
      <button className="secondary" onClick={onBack}>Back to Module</button>
    </section>
  </main>;

  return <main><Header onBack={onBack} />
    <section className="exam-shell">
      <div className="exam-status"><div><span>Module {module.order} Assessment</span><strong>Question {current + 1} of {module.finalAssessment.length}</strong></div><div className={timeLeft < 300 ? 'timer urgent' : 'timer'}><small>TIME LEFT</small><strong>{minutes}:{seconds}</strong></div></div>
      <div className="progress-track"><div style={{ width: `${((current + 1) / module.finalAssessment.length) * 100}%` }} /></div>
      <article className="exam-question" key={question.id}>
        <div className="question-badge">{current + 1}</div><h1>{question.prompt}</h1>
        <div className="exam-options">{question.options.map((option, index) =>
          <button className={selected === index ? 'selected' : ''} key={option} onClick={() => setAnswers({ ...answers, [question.id]: index })}>
            <b>{String.fromCharCode(65 + index)}</b><span>{option}</span><i>{selected === index ? '✓' : ''}</i>
          </button>)}
        </div>
        <button className="primary next-button" disabled={selected === undefined} onClick={() => {
          if (current === module.finalAssessment.length - 1) { setSubmitted(true); scrollTo({ top: 0, behavior: 'smooth' }); }
          else { setCurrent(current + 1); scrollTo({ top: 0, behavior: 'smooth' }); }
        }}>{current === module.finalAssessment.length - 1 ? 'Submit Assessment' : 'Next Question →'}</button>
      </article>
      <p className="exam-help">Select one answer to continue. Answers cannot be reviewed after submission.</p>
    </section>
  </main>;
}

export default function App() {
  const [selected, setSelected] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exam, setExam] = useState(false);
  const [lockedMessage, setLockedMessage] = useState('');
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('hse-mentor-completed-lessons') || '[]'); }
    catch { return []; }
  });
  const completeLesson = (id: string) => setCompleted(current => {
    if (current.includes(id)) return current;
    const updated = [...current, id];
    localStorage.setItem('hse-mentor-completed-lessons', JSON.stringify(updated));
    return updated;
  });
  const showLocked = (message: string) => {
    setLockedMessage(message);
    window.setTimeout(() => setLockedMessage(''), 2800);
  };
  const totals = useMemo(() => ({
    modules: catalog.length,
    lessons: catalog.reduce((n, m) => n + m.lessons.length, 0),
    questions: catalog.reduce((n, m) => n + m.finalAssessment.length + m.lessons.reduce((q, l) => q + l.questions.length, 0), 0)
  }), []);
  if (selected && lesson) {
    const nextLesson = selected.lessons.find(item => item.order === lesson.order + 1);
    return <LessonView lesson={lesson} nextLesson={nextLesson} isCompleted={completed.includes(lesson.id)} onComplete={() => completeLesson(lesson.id)} onNext={() => nextLesson ? setLesson(nextLesson) : setLesson(null)} onBack={() => setLesson(null)} />;
  }
  if (selected && exam) return <ExamView module={selected} onBack={() => setExam(false)} />;
  if (selected) {
    const completedInModule = selected.lessons.filter(item => completed.includes(item.id)).length;
    const modulePercent = Math.round((completedInModule / selected.lessons.length) * 100);
    const examUnlocked = completedInModule === selected.lessons.length;
    return <main><Header onBack={() => setSelected(null)} />
    <section className="module-hero"><span>MODULE {selected.order}</span><h1>{selected.title}</h1><p>{selected.description}</p><div className="module-progress"><div><span>{completedInModule}/10 lessons completed</span><strong>{modulePercent}%</strong></div><progress max="100" value={modulePercent} /></div></section>
    {lockedMessage && <div className="lock-toast"><b>🔒</b><div><strong>Lesson Locked</strong><span>{lockedMessage}</span></div></div>}
    <section className="lesson-list">{selected.lessons.map((l, index) => {
      const done = completed.includes(l.id);
      const unlocked = index === 0 || completed.includes(selected.lessons[index - 1].id);
      return <button key={l.id} className={`lesson-row ${done ? 'lesson-done' : ''} ${!unlocked ? 'lesson-locked' : ''}`} onClick={() => unlocked ? setLesson(l) : showLocked(`Complete Lesson ${l.order - 1} first to unlock this lesson.`)}>
        <div className="lesson-index">{done ? '✓' : l.order}</div><div><h3>{l.title}</h3><p>{done ? 'Completed · ' : unlocked ? '' : 'Locked · '}{l.estimatedMinutes} min · 3 practice questions</p></div><span>{unlocked ? '›' : '🔒'}</span>
      </button>;
    })}<button className={examUnlocked ? 'exam-button' : 'exam-button exam-locked'} onClick={() => examUnlocked ? setExam(true) : showLocked('Complete all 10 lessons before starting the final assessment.')}><span>{examUnlocked ? 'FINAL ASSESSMENT' : '🔒 FINAL ASSESSMENT LOCKED'}</span><strong>{examUnlocked ? '25 Questions · 80% to pass' : 'Complete all lessons to unlock'}</strong></button></section>
  </main>;
  }
  const levels: { key: Module['level']; title: string; subtitle: string }[] = [
    { key: 'foundation', title: 'Foundation Level', subtitle: 'Essential knowledge' },
    { key: 'intermediate', title: 'Intermediate Level', subtitle: 'Operational control' },
    { key: 'advanced', title: 'Advanced Level', subtitle: 'Technical expertise' },
    { key: 'management', title: 'Management Level', subtitle: 'Leadership and systems' }
  ];
  return <main><SafetyHero modules={totals.modules} lessons={totals.lessons} questions={totals.questions} />
    <section className="section learning-path"><div className="section-title"><h2>Your complete learning path</h2><span>4 Levels</span></div>
      {levels.map((level, index) => <section className={`level-group level-${level.key}`} key={level.key}>
        <header><div className="level-number">{index + 1}</div><div><span>{level.subtitle}</span><h2>{level.title}</h2></div><strong>{catalog.filter(m => m.level === level.key).length} Modules</strong></header>
        <div className="module-grid">{catalog.filter(m => m.level === level.key).map(m => <ModuleCard key={m.id} module={m} onOpen={() => setSelected(m)} />)}</div>
      </section>)}
    </section>
    <nav className="bottom-nav"><button className="active">⌂<span>Learn</span></button><button>✓<span>Practice</span></button><button>◎<span>Progress</span></button><button>☻<span>Profile</span></button></nav>
  </main>;
}
