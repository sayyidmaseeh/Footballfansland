import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence verbose Vite HMR websocket connection noise and spam in sandbox logs
if (typeof window !== 'undefined') {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('[vite]') || args[0].includes('connected'))
    ) {
      return;
    }
    originalLog(...args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
