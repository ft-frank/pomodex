import { useState, useEffect, lazy, Suspense } from 'react';
import BattleScreen from "./components/BattleScreen.tsx";
import LoginScreen from "./components/LoginScreen.tsx";

const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy.tsx"));
import './styles/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import { supabase } from './supabase/supabase';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <BattleScreen /> : <LoginScreen />} />
        <Route path="/privacy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;