import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './exam.css';
import './progress.css';
import './motion.css';
import './hero.css';
import './curriculum.css';
import './interview.css';
import './voice.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
