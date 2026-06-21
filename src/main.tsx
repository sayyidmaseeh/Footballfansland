import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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

// Dynamically fetch Supabase credentials from the Cloudflare Pages backend to support runtime environments
async function bootstrap() {
  try {
    const res = await fetch('/api/supabase/config').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.configured && data.supabaseUrl && data.supabaseAnonKey) {
        (window as any).__SUPABASE_URL__ = data.supabaseUrl;
        (window as any).__SUPABASE_ANON_KEY__ = data.supabaseAnonKey;
        console.log("[Dynamic Bootstrap] Set global window.__SUPABASE_URL__ and window.__SUPABASE_ANON_KEY__ from API endpoint.");
      }
    }
  } catch (err) {
    console.warn("[Dynamic Bootstrap] Failed to fetch dynamic configurations:", err);
  }

  // Import the App component dynamically AFTER setting the window variables
  const { default: App } = await import('./App.tsx');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
