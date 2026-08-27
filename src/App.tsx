import { useEffect, useMemo, useState } from 'react';
import { catalog } from './data/catalog';
import type { Lesson, Module, Question } from './types';

function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  return <button className="module-card" onClick={onOpen}>
    <span className="module-number">MODULE {module.order}</span>
    <h3>{module.title}</h3>
    <div className="module-meta"><span>{module.lessons.length} lessons</span><span>{module.finalAssessment.length} exam questions</span></div>
  </button>;
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
  const totals = useMemo(() => ({ modules: catalog.length, lessons: catalog.reduce((n, m) => n + m.lessons.length, 0) }), []);
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
  return <main><header className="brand"><div className="mark">✓</div><div><h1>HSE Mentor</h1><p>Learn safely. Think practically.</p></div></header>
    <section className="welcome"><span>FOUNDATION LEVEL</span><h2>Build strong safety knowledge</h2><p>Study practical lessons, complete quizzes and prepare for real workplace situations.</p><div className="stats"><strong>{totals.modules}<small>Modules</small></strong><strong>{totals.lessons}<small>Lessons</small></strong><strong>275<small>Questions</small></strong></div></section>
    <section className="section"><div className="section-title"><h2>Your learning path</h2><span>Foundation</span></div><div className="module-grid">{catalog.map(m => <ModuleCard key={m.id} module={m} onOpen={() => setSelected(m)} />)}</div></section>
    <nav className="bottom-nav"><button className="active">⌂<span>Learn</span></button><button>✓<span>Practice</span></button><button>◎<span>Progress</span></button><button>☻<span>Profile</span></button></nav>
  </main>;
}
