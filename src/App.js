// src/App.js
import React from 'react';
import PressureChart from './PressureChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pressure Simulation</h1>
      </header>
      <main>
        <PressureChart />
      </main>
    </div>
  );
}

export default App;
