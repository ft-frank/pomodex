import React from 'react';
import { PokedexModal } from './components/PokedexModal';
import BattleScreen from "./components/BattleScreen.tsx";
import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navigation */}
        <nav>
          <Link to="/">Battle</Link>
          <Link to="/pokedex">Pokedex</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<BattleScreen />} />
          <Route 
            path="/pokedex" 
            element={
              <PokedexModal 
                isOpen={true} 
                onClose={() => console.log("bruh")}
                caughtPokemon={[1]} 
              />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;