import React from 'react';
import { supabase } from '../supabase/supabase';

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="h-screen w-screen bg-[#303030] flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest uppercase font-['VT323'] text-yellow-400 drop-shadow-lg">
            Pomodex
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Catch Pokémon. Stay focused.</p>
        </div>

        <div className="w-48 h-48 flex items-center justify-center">
          <img
            src="/sprites/387.png"
            alt="Turtwig"
            className="w-40 h-40"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
