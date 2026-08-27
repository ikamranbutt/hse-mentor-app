import { useMemo, useState } from 'react';
import { catalog } from './data/catalog';
import type { Module } from './types';

function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  return <button className="module-card" onClick={onOpen}>
    <span className="module-number">MODULE {module.order}</span>
    <h3>{module.title}</h3>
    <p>{module.description}</p>
    <div className="module-meta"><span>{module.lessons.length} lessons</span><span>{module.passingScore}% pass</span></div>
  </button>;
}

export default function App() {
  const [selected, setSelected] = useState<Module | null>(null);
  const totals = useMemo(() => ({ modules: catalog.length, lessons: catalog.reduce((n, m) => n + m.lessons.length, 0) }), []);

  if (selected) return <main>
    <header className="topbar"><button className="back" onClick={() => setSelected(null)}>←</button><div><strong>HSE Mentor</strong><small>Foundation Level</small></div></header>
    <section className="module-hero"><span>MODULE {selected.order}</span><h1>{selected.title}</h1><p>{selected.description}</p></section>
    <section className="lesson-list">
      {selected.lessons.map(l => <article key={l.id} className="lesson-row">
        <div className="lesson-index">{l.order}</div><div><h3>{l.title}</h3><p>{l.estimatedMinutes} min · Content import pending</p></div><span>›</span>
      </article>)}
    </section>
  </main>;

  return <main>
    <header className="brand"><div className="mark">✓</div><div><h1>HSE Mentor</h1><p>Learn safely. Think practically.</p></div></header>
    <section className="welcome"><span>FOUNDATION LEVEL</span><h2>Build strong safety knowledge</h2><p>Study practical lessons, complete quizzes and prepare for real workplace situations.</p>
      <div className="stats"><strong>{totals.modules}<small>Modules</small></strong><strong>{totals.lessons}<small>Lessons</small></strong><strong>80%<small>Pass score</small></strong></div>
    </section>
    <section className="section"><div className="section-title"><h2>Your learning path</h2><span>0% complete</span></div>
      <div className="module-grid">{catalog.map(m => <ModuleCard key={m.id} module={m} onOpen={() => setSelected(m)} />)}</div>
    </section>
    <nav className="bottom-nav"><button className="active">⌂<span>Learn</span></button><button>✓<span>Practice</span></button><button>◎<span>Progress</span></button><button>☻<span>Profile</span></button></nav>
  </main>;
}
