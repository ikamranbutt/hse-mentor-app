import { useMemo, useState } from 'react';

type Part = { id: string; name: string; short: string; purpose: string; icon: string };

const parts: Part[] = [
  { id: 'sole', name: 'Sole Boards & Base Plates', short: 'Stable Foundation', purpose: 'Spread the scaffold load onto firm ground and provide a stable level base.', icon: '▰' },
  { id: 'standards', name: 'Standards', short: 'Vertical Members', purpose: 'Carry scaffold loads vertically down to the base plates.', icon: 'Ⅱ' },
  { id: 'ledgers', name: 'Ledgers', short: 'Horizontal Members', purpose: 'Connect standards longitudinally and maintain bay spacing.', icon: '═' },
  { id: 'transoms', name: 'Transoms', short: 'Cross Members', purpose: 'Connect inner and outer standards and support the working platform.', icon: '≡' },
  { id: 'bracing', name: 'Diagonal Bracing', short: 'Stability', purpose: 'Prevent racking and keep the scaffold square and stable.', icon: '╱' },
  { id: 'ties', name: 'Building Ties', short: 'Structural Restraint', purpose: 'Tie the scaffold to the structure at the designed pattern and spacing.', icon: '↔' },
  { id: 'platform', name: 'Fully Decked Platform', short: 'Working Surface', purpose: 'Provide a close-boarded, secured and correctly supported work platform.', icon: '▤' },
  { id: 'guardrails', name: 'Guardrails & Midrails', short: 'Edge Protection', purpose: 'Prevent people from falling from open platform edges.', icon: '☷' },
  { id: 'toeboards', name: 'Toe Boards', short: 'Falling Objects', purpose: 'Prevent tools and materials being kicked from the platform.', icon: '▱' },
  { id: 'access', name: 'Internal Ladder Access', short: 'Safe Access', purpose: 'Provide secured internal access without climbing the outside standards.', icon: '🪜' },
  { id: 'tag', name: 'Inspection & Scaffold Tag', short: 'Authorization', purpose: 'A competent person inspects and tags the completed scaffold before use.', icon: '✓' }
];

const unsafe = [
  { id: 'bricks', name: 'Loose Bricks as a Base', reason: 'Bricks can crush or move and are not suitable sole boards.' },
  { id: 'outside', name: 'Climb Outside Standards', reason: 'External climbing exposes the worker to an uncontrolled fall.' },
  { id: 'partial', name: 'Leave Gaps in the Platform', reason: 'An incomplete platform creates fall and dropped-object hazards.' },
  { id: 'remove-tie', name: 'Remove Ties for More Space', reason: 'Removing ties can make the entire scaffold unstable.' }
];

export default function ScaffoldBuilder({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'intro'|'build'|'dismantle'|'done'>('intro');
  const [built, setBuilt] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('');
  const expected = phase === 'dismantle' ? [...parts].reverse()[parts.length - built.length] : parts[built.length];
  const score = Math.max(0, 100 - mistakes * 5);
  const choices = useMemo(() => {
    if (phase === 'dismantle') return [...built].reverse().map(id => parts.find(p => p.id === id)!).filter(Boolean);
    return [...parts.slice(built.length, Math.min(parts.length, built.length + 4)), ...unsafe.slice(0, 2)] as (Part | typeof unsafe[number])[];
  }, [built, phase]);

  const choose = (item: Part | typeof unsafe[number]) => {
    if ('reason' in item) { setMistakes(v => v + 1); setMessage(`STOP: ${item.reason}`); return; }
    if (!expected || item.id !== expected.id) {
      setMistakes(v => v + 1);
      setMessage(phase === 'dismantle' ? `Unsafe sequence. Remove ${expected?.name} first.` : `Not yet. Install ${expected?.name} first.`);
      return;
    }
    setMessage(`${phase === 'dismantle' ? 'Removed' : 'Installed'} correctly: ${item.name} — ${item.purpose}`);
    if (phase === 'dismantle') {
      const remaining = built.filter(id => id !== item.id);
      setBuilt(remaining);
      if (!remaining.length) setPhase('done');
    } else {
      const updated = [...built, item.id];
      setBuilt(updated);
      if (updated.length === parts.length) window.setTimeout(() => setPhase('dismantle'), 900);
    }
  };

  if (phase === 'intro') return <main className="scaffold-game"><header className="scaffold-top"><button onClick={onBack}>←</button><div><strong>Scaffolding Practical</strong><small>Build · Inspect · Dismantle</small></div></header><section className="scaffold-intro"><div className="scaffold-logo">╱╲<b>HSE</b></div><span>INTERACTIVE COMPETENCY GAME</span><h1>Build it safely.<br/><em>Take it down safely.</em></h1><p>You are the scaffolding supervisor. Select every component in the correct erection sequence, authorize the scaffold, then dismantle it in reverse order.</p><div className="game-facts"><b><strong>11</strong>Components</b><b><strong>2</strong>Practical phases</b><b><strong>100</strong>Starting score</b></div><button onClick={() => setPhase('build')}>Start Scaffold Erection →</button><article><strong>Learning outcome</strong><p>Recognize the main scaffold components, understand their purpose and apply a safe erection and dismantling sequence. This exercise does not replace competent scaffolder training or an approved scaffold design.</p></article></section></main>;

  if (phase === 'done') return <main className="scaffold-game"><header className="scaffold-top"><button onClick={onBack}>←</button><div><strong>Practical Complete</strong><small>Scaffold Builder</small></div></header><section className="scaffold-complete"><div>✓</div><span>ERECTION & DISMANTLING COMPLETED</span><h1>{score >= 80 ? 'Competent Performance' : 'More Practice Required'}</h1><div className="scaffold-score"><strong>{score}%</strong><small>Final Score</small></div><p>You completed the scaffold sequence from stable foundation to inspection tag, then dismantled it in the correct reverse order.</p><button onClick={() => {setPhase('build');setBuilt([]);setMistakes(0);setMessage('');}}>Start New Attempt</button><button className="outline" onClick={onBack}>Back to HSE Mentor</button></section></main>;

  const progress = phase === 'build' ? (built.length / parts.length) * 100 : ((parts.length - built.length) / parts.length) * 100;
  return <main className="scaffold-game"><header className="scaffold-top"><button onClick={onBack}>←</button><div><strong>Scaffolding Practical</strong><small>{phase === 'build' ? 'Erection Phase' : 'Dismantling Phase'}</small></div><b>{score}%</b></header>
    <section className={`scaffold-yard scaffold-step-${built.length}`}><div className="yard-building"><i/><i/><i/></div><div className="yard-ground"/><div className="scaffold-model">
      {built.includes('sole') && <div className="model-sole"><i/><i/><i/><i/></div>}{built.includes('standards') && <div className="model-standards"><i/><i/><i/><i/></div>}{built.includes('ledgers') && <div className="model-ledgers"><i/><i/><i/><i/></div>}{built.includes('transoms') && <div className="model-transoms"><i/><i/><i/></div>}{built.includes('bracing') && <div className="model-bracing"><i/><i/></div>}{built.includes('ties') && <div className="model-ties"><i/><i/><i/></div>}{built.includes('platform') && <div className="model-platform"><i/><i/></div>}{built.includes('guardrails') && <div className="model-rails"><i/><i/><i/></div>}{built.includes('toeboards') && <div className="model-toes"><i/><i/></div>}{built.includes('access') && <div className="model-ladder"/>}{built.includes('tag') && <div className="model-tag">SAFE<br/>SCAFFOLD</div>}
    </div><div className="scaffold-worker"><i>⛑</i><span/><b>SCAFFOLDER</b></div><div className="scaffold-supervisor"><i>⛑</i><span/><b>SUPERVISOR</b></div><div className="yard-label">{phase === 'build' ? 'ERECTION IN PROGRESS' : 'DISMANTLING IN PROGRESS'}</div></section>
    <section className="build-panel"><div className="phase-progress"><div><span>{phase === 'build' ? 'ERECTION SEQUENCE' : 'REVERSE DISMANTLING'}</span><b>{phase === 'build' ? built.length : parts.length - built.length}/{parts.length}</b></div><i><b style={{width:`${progress}%`}}/></i></div><div className="next-instruction"><span>{phase === 'build' ? '＋' : '−'}</span><div><small>NEXT SAFE ACTION</small><h2>{phase === 'build' ? 'Select the next component to install' : 'Select the next component to remove'}</h2></div></div>
      {message && <div className={message.startsWith('STOP') || message.startsWith('Not') || message.startsWith('Unsafe') ? 'sequence-message bad' : 'sequence-message good'}>{message}</div>}
      <div className="component-grid">{choices.map(item => <button key={item.id} onClick={() => choose(item)} className={'reason' in item ? 'unsafe-part' : ''}><i>{'icon' in item ? item.icon : '⚠'}</i><div><strong>{item.name}</strong><small>{'short' in item ? item.short : 'Looks possible—but is it safe?'}</small></div><span>›</span></button>)}</div>
      <section className="component-guide"><h3>Installed Component Guide</h3>{parts.filter(p => built.includes(p.id)).map((p, index) => <article key={p.id}><b>{index + 1}</b><div><strong>{p.name}</strong><p>{p.purpose}</p></div><span>✓</span></article>)}</section>
    </section></main>;
}
