import React from 'react';
import {PokedexModal} from './components/PokedexModal'
import './index.css';

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
