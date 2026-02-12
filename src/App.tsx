import React from 'react';
import {PokedexModal} from './components/PokedexModal'
import {BattleMenu} from './components/BattleMenu.tsx'
import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const router = createBrowserRouter([

  {
    path:"/",
    element: <BattleMenu />

  },

  {
    path: "/Pokedex",
    element: <PokedexModal 
        isOpen={true} 
        onClose={() => console.log("bruh")}
        caughtPokemon={[1]} 
                          />
  },





])





function App() {
  return (
    <div className="App">
      <PokedexModal 
        isOpen={true} 
        onClose={() => console.log("bruh")}
        caughtPokemon={[1]}
      />
    </div>
  );
}

export default App;
