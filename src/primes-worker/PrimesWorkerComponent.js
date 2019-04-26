import React, { Component } from 'react';
import './PrimesWorkerComponent.css';
import worker1 from './primes-worker';
import worker2 from './primes-worker';
import WorkerBlobSetup from '../worker-blob-setup';
import primeConfig from '../config/prime';

class PrimesWorkerComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {loading: false, workerDone: false, hostDone: false}
  }

  componentDidMount() {
    this.worker1 = new WorkerBlobSetup(worker1); // this returns a worker, initialised via creating a blob 
    this.worker1.postMessage({workerIndex: 1});
    this.worker1.postMessage({url: document.location.protocol + '//' + document.location.host + '/'});
    this.worker1.addEventListener("message", (m) => { this.handleMessageFromWorker(m) }, false);

    this.worker2 = new WorkerBlobSetup(worker2);
    this.worker2.postMessage({workerIndex: 2});
    this.worker2.postMessage({url: document.location.protocol + '//' + document.location.host + '/'});
    this.worker2.addEventListener("message", (m) => { this.handleMessageFromWorker(m) }, false);
  }

  handleClick() {
    this.setState({
        loading: true,
        worker1Done: false,
        worker2Done: false,
        worker1Factors: null,
        worker2Factors: null,
        start: Date.now(),
        end: null
      });
    console.log("[HOST] Sending number to factor to my workers...");
    this.worker1.postMessage(primeConfig.numberToFactor);
    this.worker2.postMessage(primeConfig.numberToFactor);
  }

  handleMessageFromWorker(m) {
    if (!m.data.isError) {
      console.log("[HOST] Recieved answer from worker: ", m.data.workerIndex,". Prime Factors: ", m.data.primeFactors);
      console.log("[HOST] That took ", Date.now() - this.state.start, ' ms.');
      if (m.data.workerIndex === 1) {
        this.setState({worker1Done: true, worker1Factors: m.data.primeFactors});
      } else if (m.data.workerIndex === 2) {
        this.setState({worker2Done: true, worker2Factors: m.data.primeFactors});
      }
    } else {
      console.log("There was an error in the primes worker. Error Message:", m.data.errorMessage);
    }

    if (this.state.worker1Done && this.state.worker2Done) {
      this.setState({loading: false, end: Date.now()});
    }
  }

  render() {
    const loading = this.state.loading;
    const worker1Done = this.state.worker1Done;
    const worker2Done = this.state.worker2Done;
    let timeTaken, timeTakenHTML, worker1FactorsHTML, worker2FactorsHTML;
    const worker1Factors = this.state.worker1Factors;
    const worker2Factors = this.state.worker2Factors;

    if (worker1Done) {
      worker1FactorsHTML = worker1Factors.map((number, i) =>
        <span className="prime-factor-list-item" key={i}>{number}</span>
      );
    }
    if (worker2Done) {
      worker2FactorsHTML = worker2Factors.map((number, i) =>
        <span className="prime-factor-list-item" key={i}>{number}</span>
      );
    }
    if (worker1Done && worker2Done) {
      timeTaken = this.state.end - this.state.start;
    }

    // setting time-taken/loading HTML
    if (!loading && (!worker1Done || !worker2Done)) {
      timeTakenHTML = <span>[not started]</span>
    } else if (loading && (!worker1Done || !worker2Done)) {
      timeTakenHTML = <span>[factorising...]</span>
    } else {
      timeTakenHTML = <b>{timeTaken}ms</b>
    }
    return (
      <React.Fragment>
        <b>Primes Worker</b> <br />
        This runs two prime factorisations of {primeConfig.numberToFactor}, each on it's own web worker. <br />
        <button disabled={loading} onClick={this.handleClick}>Begin</button> <br />
        Time Taken: {timeTakenHTML} <br />
        <span className="prime-factor-list">Worker 1 Prime Factors: {worker1FactorsHTML}</span> <br />
        <span className="prime-factor-list">Worker 2 Prime Factors: {worker2FactorsHTML}</span> <br />
      </React.Fragment>
    );
  }
}

export default PrimesWorkerComponent;
