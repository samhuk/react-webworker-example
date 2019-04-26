import React, { Component } from 'react';
import calcPrimeFactors from '../worker-scripts/prime-factoring-script';
import primeConfig from '../config/prime';

class PrimesNonWorkerComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {loading: false, prime1Done: false, prime2Done: false};
  }

  handleClick() {
    console.log('Beginning concurrent prime factorisation of ', primeConfig.numberToFactor ,'(non-worker method)...');
    this.doTwoPrimeFactorisations();
  }

  async doTwoPrimeFactorisations() {
    // "PARALLEL"
    // Need a little (~100ms) delay to give time for react to add and complete component rerender
    // ("render()") task after the below setState() is called to task queue before the factorisation
    // scripts are, otherwise the { loading: true } sub-state won't be represented in the UI.
    var delayMs = 100;
    this.setState({ loading: true, prime1Done: false, prime2Done: false, start: Date.now()+delayMs });
    // even calling "this.forceUpdate();" here won't work. Long-running syncronous tasks completely block
    // all other tasks in the queue, so we definitely need the delay.
    setTimeout(() => {
      this.doPrimeFactorisation1().then(factors => {
        console.log('1st Prime factors:', factors, '. That took ', Date.now() - this.state.start1, 'ms.');
        this.setState({ prime1Done: true });
        if (this.state.prime2Done) {
          this.setState({ loading: false, end: Date.now() });
        }
      });
      this.doPrimeFactorisation2().then(factors => {
        console.log('2nd Prime factors:', factors, '. That took ', Date.now() - this.state.start2, 'ms.');
        this.setState({prime2Done: true});
        if (this.state.prime1Done) {
          this.setState({ loading: false, end: Date.now() });
        }
      });
    }, delayMs);

    // CONCURRANT
    // even trying this method doesn't work. Due to the syncronous nature of the factorisation scripts, they
    // still cause major UI blocking issues if ran on the host thread. Need a worker...

    // Promise.all([this.doPrimeFactorisation1(), this.doPrimeFactorisation2()]).then((factorsLists) => {
    //   console.log(factorsLists[0]);
    //   console.log(factorsLists[1]);
    //   console.log('That took ', Date.now() - this.state.start1);
    // });
  }

  doPrimeFactorisation1 () {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Beginning 1st factorisation...');
        this.setState({ start1: Date.now() });
        var factors = calcPrimeFactors(primeConfig.numberToFactor);
        resolve(factors);
      }, 0);
    });
  }

  doPrimeFactorisation2 () {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Beginning 2nd factorisation...');
        this.setState({ start2: Date.now() });
        var factors = calcPrimeFactors(primeConfig.numberToFactor);
        resolve(factors);
      }, 0);
    });
  }

  render() {
    const loading = this.state.loading;
    const bothPrimesDone = this.state.prime1Done && this.state.prime2Done;
    const start = this.state.start;
    let timeTakenHTML;
    if (!loading && !bothPrimesDone) {
      timeTakenHTML = <span>[not started]</span>
    } else if (loading && !bothPrimesDone) {
      timeTakenHTML = <span>[factorising...]</span>
    } else {
      timeTakenHTML = <b>{Date.now() - start}ms</b>
    }
    return (
      <React.Fragment>
        <b>Primes Non Worker</b> <br />
        This runs two prime factorisations on {primeConfig.numberToFactor}, both asyncronously on the host thread <br />
        <button disabled={loading} onClick={this.handleClick}>Begin</button> <br />
        Time Taken: {timeTakenHTML}
      </React.Fragment>
    );
  }
}

export default PrimesNonWorkerComponent;
