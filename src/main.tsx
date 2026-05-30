import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

document.title = 'CardHoldr';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
