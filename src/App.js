import React, { Component } from 'react';
import HelloWorkerComponent from './hello-worker/HelloWorkerComponent';
import PrimesWorkerComponent from './primes-worker/PrimesWorkerComponent';
import PrimesNonWorkerComponent from './primes-non-worker/PrimesNonWorkerComponent';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Web Worker App</h1>
        <hr />
        <HelloWorkerComponent></HelloWorkerComponent>
        <hr />
        <PrimesWorkerComponent></PrimesWorkerComponent>
        <hr />
        <PrimesNonWorkerComponent></PrimesNonWorkerComponent>
      </div>
    );
  }
}

export default App;
