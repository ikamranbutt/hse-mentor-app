import { useMemo, useState } from 'react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { interviewQuestions, type InterviewQuestion } from './data/interview';

type AgentResult = { score: number; matched: string[]; missing: string[] };
const levels: InterviewQuestion['level'][] = ['Basic', 'Intermediate', 'Advanced', 'Management'];
const SESSION_LENGTH = 10;

export default function LiveAgent({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState<InterviewQuestion | null>(null);
  const [asked, setAsked] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<AgentResult | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const average = useMemo(() => scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, [scores]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US'; speech.rate = 0.9; speech.pitch = 1;
    speech.onstart = () => setSpeaking(true); speech.onend = () => setSpeaking(false); speech.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(speech);
  };
  const browserSpeech = () => new Promise<string>((resolve, reject) => {
    const target = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const BrowserRecognition = target.SpeechRecognition || target.webkitSpeechRecognition;
    if (!BrowserRecognition) return reject(new Error('Voice recognition is not supported on this browser.'));
    const recognition = new BrowserRecognition();
    recognition.lang = 'en-US'; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => resolve(event.results[0][0].transcript);
    recognition.onerror = () => reject(new Error('I could not hear clearly. Please try again or type your answer.'));
    recognition.start();
  });
  const captureSpeech = async (prompt: string) => {
    setListening(true); setError(''); window.speechSynthesis?.cancel();
    try {
      const available = await SpeechRecognition.available().catch(() => ({ available: false }));
      if (available.available) {
        const permission = await SpeechRecognition.checkPermissions();
        if (permission.speechRecognition !== 'granted') {
          const requested = await SpeechRecognition.requestPermissions();
          if (requested.speechRecognition !== 'granted') throw new Error('Microphone permission is required.');
        }
        const response = await SpeechRecognition.start({ language: 'en-US', maxResults: 1, prompt, popup: true, partialResults: false });
        return response.matches?.[0] || '';
      }
      return await browserSpeech();
    } finally { setListening(false); }
  };
  const recordName = async () => {
    try {
      const spoken = await captureSpeech('Please say your name');
      if (spoken) setName(spoken.replace(/[.,!?]/g, '').trim());
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please type your name.'); }
  };
  const recordAnswer = async () => {
    try {
      const spoken = await captureSpeech('Give your HSE interview answer');
      if (!spoken) throw new Error('No answer was detected.');
      setAnswer(existing => existing ? `${existing} ${spoken}` : spoken);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please type your answer.'); }
  };
  const pickQuestion = (level: InterviewQuestion['level'], excluded: string[], first = false) => {
    let candidates = interviewQuestions.filter(q => q.level === level && !excluded.includes(q.id) && (!first || q.type === 'Knowledge'));
    if (!candidates.length) candidates = interviewQuestions.filter(q => !excluded.includes(q.id));
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  const start = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const first = pickQuestion('Basic', [], true);
    setName(cleanName); setStarted(true); setCurrent(first); setAsked([first.id]); setScores([]); setAnswer(''); setResult(null); setFinished(false);
    window.setTimeout(() => speak(`Welcome ${cleanName}. I am your HSE interview agent. Let us start with a simple question. ${first.prompt}`), 250);
  };
  const repeatQuestion = () => current && speak(`${name}, here is the question again. ${current.prompt}`);
  const analyze = () => {
    if (!current) return;
    const normalized = answer.toLowerCase();
    const matched = current.keyPoints.filter(point => point.terms.some(term => normalized.includes(term))).map(point => point.label);
    const missing = current.keyPoints.filter(point => !point.terms.some(term => normalized.includes(term))).map(point => point.label);
    const score = Math.round((matched.length / current.keyPoints.length) * 100);
    const analyzed = { score, matched, missing };
    setResult(analyzed);
    const spokenFeedback = score >= 70
      ? `Good answer, ${name}. You covered ${matched.join(' and ')}. To make it stronger, also include ${missing.join(' and ') || 'clear field verification'}.`
      : `${name}, your answer has a useful start, but it needs more safety detail. Important missing points are ${missing.join(' and ')}. A stronger answer is: ${current.modelAnswer}`;
    speak(spokenFeedback);
  };
  const nextQuestion = () => {
    if (!current || !result) return;
    const nextScores = [...scores, result.score];
    if (nextScores.length >= SESSION_LENGTH) {
      setScores(nextScores); setFinished(true); setCurrent(null);
      const finalAverage = Math.round(nextScores.reduce((a, b) => a + b, 0) / nextScores.length);
      speak(`Interview complete, ${name}. Your overall score is ${finalAverage} percent. Keep practising practical safety explanations.`);
      return;
    }
    const currentLevel = levels.indexOf(current.level);
    const targetIndex = result.score >= 70 ? Math.min(3, currentLevel + 1) : result.score < 35 ? Math.max(0, currentLevel - 1) : currentLevel;
    const next = pickQuestion(levels[targetIndex], asked);
    setScores(nextScores); setCurrent(next); setAsked([...asked, next.id]); setAnswer(''); setResult(null); setError('');
    window.setTimeout(() => speak(`Thank you, ${name}. Your next ${next.type.toLowerCase()} question is: ${next.prompt}`), 250);
    scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { window.speechSynthesis?.cancel(); setStarted(false); setCurrent(null); setAsked([]); setAnswer(''); setResult(null); setScores([]); setFinished(false); setError(''); };

  if (!started) return <main className="agent-page"><AgentHeader onBack={onBack} speaking={speaking} />
    <section className="agent-welcome"><div className="agent-orb"><span>HSE</span><i /></div><span>LIVE ADAPTIVE INTERVIEW</span><h1>Meet Your HSE<br />Interview Agent</h1><p>The agent will address you by name, ask random questions aloud, listen to your answer and adapt the next question to your performance.</p>
      <div className="name-step"><label>First, what is your name?</label><div><input value={name} onChange={event => setName(event.target.value)} placeholder="Enter your name" /><button onClick={recordName} disabled={listening}>{listening ? 'Listening…' : '🎙 Say Name'}</button></div>{error && <small>{error}</small>}</div>
      <button className="primary agent-start" disabled={!name.trim()} onClick={start}>Let’s Start Interview</button>
    </section></main>;

  if (finished) return <main className="agent-page"><AgentHeader onBack={onBack} speaking={speaking} /><section className="agent-finish"><div className="agent-orb small"><span>✓</span></div><span>SESSION COMPLETE</span><h1>Well done, {name}</h1><div className="agent-final-score"><strong>{Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}%</strong><small>Adaptive interview score</small></div><p>You completed {SESSION_LENGTH} random questions. The difficulty changed according to your answers.</p><button className="primary" onClick={reset}>Start Another Session</button><button className="secondary" onClick={onBack}>Back to Interviews</button></section></main>;

  if (!current) return null;
  return <main className="agent-page"><AgentHeader onBack={onBack} speaking={speaking} />
    <section className="agent-meta"><div><span>{current.level}</span><strong>{current.type}</strong></div><div><small>SESSION</small><strong>{scores.length + 1}/{SESSION_LENGTH}</strong></div></section>
    <div className="agent-progress"><div style={{ width: `${((scores.length + 1) / SESSION_LENGTH) * 100}%` }} /></div>
    <section className="agent-conversation">
      <div className="agent-bubble"><div className="mini-agent">HSE</div><div><small>HSE INTERVIEW AGENT</small><p>{name}, {current.prompt}</p><button onClick={repeatQuestion}>🔊 Repeat Question</button></div></div>
      <div className="candidate-bubble"><label>{name.toUpperCase()} — YOUR ANSWER</label><textarea value={answer} disabled={!!result} onChange={event => setAnswer(event.target.value)} rows={7} placeholder="Speak or type your answer..." /><button className={listening ? 'agent-mic listening' : 'agent-mic'} onClick={recordAnswer} disabled={listening || !!result}>{listening ? '◉ Listening…' : '🎙 Speak My Answer'}</button>{error && <p className="agent-error">{error}</p>}</div>
      {!result ? <button className="primary agent-analyze" disabled={answer.trim().length < 20} onClick={analyze}>Agent, Analyze My Answer</button> :
        <div className="agent-feedback"><header><div className={result.score >= 70 ? 'feedback-score strong' : result.score >= 40 ? 'feedback-score fair' : 'feedback-score weak'}>{result.score}%</div><div><small>AGENT FEEDBACK FOR</small><h2>{name}</h2></div></header>
          {result.matched.length > 0 && <section><h3>What you answered correctly</h3>{result.matched.map(point => <p className="positive" key={point}>✓ {point}</p>)}</section>}
          {result.missing.length > 0 && <section><h3>What should be added</h3>{result.missing.map(point => <p className="improve" key={point}>+ {point}</p>)}</section>}
          <section className="better-answer"><h3>A stronger interview answer</h3><p>{current.modelAnswer}</p><button onClick={() => speak(`${name}, a stronger answer is: ${current.modelAnswer}`)}>🔊 Hear Better Answer</button></section>
          <button className="primary" onClick={nextQuestion}>{scores.length + 1 === SESSION_LENGTH ? 'Finish Interview' : 'Ask My Next Question →'}</button>
        </div>}
    </section>
    <p className="adaptive-note">Adaptive level · Current average {average}%</p>
  </main>;
}

function AgentHeader({ onBack, speaking }: { onBack: () => void; speaking: boolean }) {
  return <header className="topbar agent-topbar"><button className="back" onClick={onBack}>←</button><div><strong>HSE Interview Agent</strong><small>{speaking ? 'Speaking…' : 'Live session'}</small></div><div className={speaking ? 'agent-wave active' : 'agent-wave'}><i /><i /><i /><i /></div></header>;
}
