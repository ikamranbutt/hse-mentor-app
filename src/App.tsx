import { useMemo, useState } from 'react';
import { catalog } from './data/catalog';
import type { Lesson, Module, Question } from './types';

function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  return <button className="module-card" onClick={onOpen}>
    <span className="module-number">MODULE {module.order}</span>
    <h3>{module.title}</h3><p>{module.description}</p>
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

function LessonView({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  return <main><Header onBack={onBack} />
    <section className="module-hero"><span>LESSON {lesson.order}</span><h1>{lesson.title}</h1><p>{lesson.estimatedMinutes} minutes · 3 practice questions</p></section>
    <section className="reader">
      {lesson.sections.map((section, index) => <article className="content-card" key={`${section.heading}-${index}`}>
        <h2>{section.heading}</h2>{section.points.map((point, i) => <p key={i}>{point}</p>)}
      </article>)}
      <div className="quiz-heading"><span>PRACTICE</span><h2>Check your understanding</h2><p>Select one answer. The correct answer and explanation appear immediately.</p></div>
      {lesson.questions.map((question, index) => <QuestionCard key={question.id} question={question} number={index + 1} />)}
    </section>
  </main>;
}

function ExamView({ module, onBack }: { module: Module; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = module.finalAssessment.reduce((total, q) => total + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
  const percentage = Math.round((score / module.finalAssessment.length) * 100);
  return <main><Header onBack={onBack} />
    <section className="module-hero"><span>FINAL ASSESSMENT</span><h1>Module {module.order} Exam</h1><p>25 questions · Pass score {module.passingScore}% (20/25)</p></section>
    <section className="reader">
      {submitted && <div className={percentage >= module.passingScore ? 'result pass' : 'result retry'}><strong>{percentage}%</strong><h2>{percentage >= module.passingScore ? 'Assessment passed' : 'Review and try again'}</h2><p>You scored {score} out of {module.finalAssessment.length}.</p></div>}
      {module.finalAssessment.map((q, qIndex) => <article className="question-card" key={q.id}>
        <strong>Question {qIndex + 1} of 25</strong><h3>{q.prompt}</h3>
        <div className="options">{q.options.map((option, index) => {
          const reveal = submitted ? index === q.correctIndex ? 'correct' : answers[q.id] === index ? 'wrong' : '' : answers[q.id] === index ? 'chosen' : '';
          return <button className={reveal} disabled={submitted} key={option} onClick={() => setAnswers({ ...answers, [q.id]: index })}><b>{String.fromCharCode(65 + index)}</b>{option}</button>;
        })}</div>{submitted && <p className="feedback">{q.explanation}</p>}
      </article>)}
      {!submitted ? <button className="primary" disabled={Object.keys(answers).length !== 25} onClick={() => { setSubmitted(true); scrollTo({ top: 0, behavior: 'smooth' }); }}>Submit assessment ({Object.keys(answers).length}/25)</button>
        : <button className="primary" onClick={() => { setAnswers({}); setSubmitted(false); scrollTo({ top: 0, behavior: 'smooth' }); }}>Try assessment again</button>}
    </section>
  </main>;
}

export default function App() {
  const [selected, setSelected] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exam, setExam] = useState(false);
  const totals = useMemo(() => ({ modules: catalog.length, lessons: catalog.reduce((n, m) => n + m.lessons.length, 0) }), []);
  if (selected && lesson) return <LessonView lesson={lesson} onBack={() => setLesson(null)} />;
  if (selected && exam) return <ExamView module={selected} onBack={() => setExam(false)} />;
  if (selected) return <main><Header onBack={() => setSelected(null)} />
    <section className="module-hero"><span>MODULE {selected.order}</span><h1>{selected.title}</h1><p>{selected.description}</p></section>
    <section className="lesson-list">{selected.lessons.map(l => <button key={l.id} className="lesson-row" onClick={() => setLesson(l)}>
      <div className="lesson-index">{l.order}</div><div><h3>{l.title}</h3><p>{l.estimatedMinutes} min · 3 practice questions</p></div><span>›</span>
    </button>)}<button className="exam-button" onClick={() => setExam(true)}><span>FINAL ASSESSMENT</span><strong>25 Questions · 80% to pass</strong></button></section>
  </main>;
  return <main><header className="brand"><div className="mark">✓</div><div><h1>HSE Mentor</h1><p>Learn safely. Think practically.</p></div></header>
    <section className="welcome"><span>FOUNDATION LEVEL</span><h2>Build strong safety knowledge</h2><p>Study practical lessons, complete quizzes and prepare for real workplace situations.</p><div className="stats"><strong>{totals.modules}<small>Modules</small></strong><strong>{totals.lessons}<small>Lessons</small></strong><strong>275<small>Questions</small></strong></div></section>
    <section className="section"><div className="section-title"><h2>Your learning path</h2><span>Foundation</span></div><div className="module-grid">{catalog.map(m => <ModuleCard key={m.id} module={m} onOpen={() => setSelected(m)} />)}</div></section>
    <nav className="bottom-nav"><button className="active">⌂<span>Learn</span></button><button>✓<span>Practice</span></button><button>◎<span>Progress</span></button><button>☻<span>Profile</span></button></nav>
  </main>;
}
