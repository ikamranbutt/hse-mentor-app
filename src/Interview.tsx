import { useMemo, useState } from 'react';
import { interviewQuestions } from './data/interview';

type Result = { score: number; matched: string[]; missing: string[] };

export default function Interview({ onBack }: { onBack: () => void }) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('hse-mentor-interview') || '{}'); } catch { return {}; } })();
  const [started, setStarted] = useState(saved.started || false);
  const [current, setCurrent] = useState(Number(saved.current) || 0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [scores, setScores] = useState<number[]>(Array.isArray(saved.scores) ? saved.scores : []);
  const [finished, setFinished] = useState(false);
  const question = interviewQuestions[current];
  const overall = useMemo(() => scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, [scores]);

  const saveSession = (nextCurrent: number, nextScores: number[]) => localStorage.setItem('hse-mentor-interview', JSON.stringify({ started: true, current: nextCurrent, scores: nextScores }));
  const analyze = () => {
    const normalized = answer.toLowerCase();
    const matched = question.keyPoints.filter(point => point.terms.some(term => normalized.includes(term))).map(point => point.label);
    const missing = question.keyPoints.filter(point => !point.terms.some(term => normalized.includes(term))).map(point => point.label);
    const score = Math.round((matched.length / question.keyPoints.length) * 100);
    setResult({ score, matched, missing });
  };
  const next = () => {
    const nextScores = [...scores, result?.score || 0];
    if (current === interviewQuestions.length - 1) {
      setScores(nextScores); setFinished(true); localStorage.removeItem('hse-mentor-interview'); return;
    }
    const nextCurrent = current + 1;
    setScores(nextScores); setCurrent(nextCurrent); setAnswer(''); setResult(null); saveSession(nextCurrent, nextScores); scrollTo({ top: 0, behavior: 'smooth' });
  };
  const restart = () => { setStarted(true); setCurrent(0); setAnswer(''); setResult(null); setScores([]); setFinished(false); saveSession(0, []); };

  if (!started) return <main className="interview-page"><InterviewHeader onBack={onBack} />
    <section className="interview-intro"><div className="interview-mic">◉</div><span>HSE MOCK INTERVIEW</span><h1>From Basic Knowledge<br />to Management Decisions</h1><p>Answer in your own words. The mentor will check essential safety points, identify what is missing and show a strong sample answer.</p>
      <div className="interview-levels"><b>Basic</b><i>→</i><b>Intermediate</b><i>→</i><b>Advanced</b><i>→</i><b>Management</b></div>
      <ul><li>24 progressive interview questions</li><li>Knowledge and practical site scenarios</li><li>Instant structured feedback and scoring</li><li>Your position is saved automatically</li></ul>
      <button className="primary interview-start" onClick={restart}>Start Mock Interview</button>
    </section></main>;

  if (finished) {
    const finalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return <main className="interview-page"><InterviewHeader onBack={onBack} /><section className="interview-finish"><div className="finish-icon">★</div><span>INTERVIEW COMPLETE</span><h1>{finalScore >= 75 ? 'Strong Interview Performance' : finalScore >= 50 ? 'Good Foundation—Keep Practising' : 'More Practice Recommended'}</h1><div className="interview-score-ring"><strong>{finalScore}%</strong><small>Overall score</small></div><p>You completed all {interviewQuestions.length} questions from Basic to Management level.</p><button className="primary" onClick={restart}>Start New Interview</button><button className="secondary" onClick={onBack}>Back to Home</button></section></main>;
  }

  return <main className="interview-page"><InterviewHeader onBack={onBack} />
    <section className="interview-status"><div><span>{question.level} Level</span><strong>{question.type}</strong></div><div><small>QUESTION</small><strong>{current + 1}/{interviewQuestions.length}</strong></div></section>
    <div className="interview-progress"><div style={{ width: `${((current + 1) / interviewQuestions.length) * 100}%` }} /></div>
    <section className="interview-card" key={question.id}>
      <div className="interviewer"><div className="avatar">HSE</div><div><strong>HSE Interviewer</strong><span>{question.level} assessment</span></div></div>
      <h1>{question.prompt}</h1>
      <label>Your answer</label><textarea value={answer} disabled={!!result} onChange={event => setAnswer(event.target.value)} placeholder="Type your answer in your own words..." rows={7} />
      {!result ? <button className="primary" disabled={answer.trim().length < 20} onClick={analyze}>Analyze My Answer</button> :
        <div className="answer-analysis">
          <div className={result.score >= 70 ? 'answer-score good' : result.score >= 40 ? 'answer-score medium' : 'answer-score weak'}><strong>{result.score}%</strong><span>Answer coverage</span></div>
          {result.matched.length > 0 && <div className="feedback-list matched"><h3>✓ Points covered</h3>{result.matched.map(item => <p key={item}>{item}</p>)}</div>}
          {result.missing.length > 0 && <div className="feedback-list missing"><h3>+ Points to include</h3>{result.missing.map(item => <p key={item}>{item}</p>)}</div>}
          <div className="model-answer"><h3>Strong sample answer</h3><p>{question.modelAnswer}</p></div>
          <button className="primary" onClick={next}>{current === interviewQuestions.length - 1 ? 'Complete Interview' : 'Next Question →'}</button>
        </div>}
    </section>
    <div className="session-score">Current average: <strong>{overall}%</strong></div>
  </main>;
}

function InterviewHeader({ onBack }: { onBack: () => void }) {
  return <header className="topbar interview-topbar"><button className="back" onClick={onBack}>←</button><div><strong>HSE Mentor</strong><small>Mock Interview</small></div><span className="live-dot">● LIVE</span></header>;
}
