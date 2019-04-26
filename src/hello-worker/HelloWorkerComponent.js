import React, { Component } from 'react';
import worker from './hello-worker';
import WebWorker from '../worker-blob-setup';

class HelloWorkerComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);
    this.worker.addEventListener("message", (m) => { this.handleMessageFromWorker(m) }, false);
  }

  handleClick() {
    console.log("[HOST] Sending a message to my worker...");
    this.worker.postMessage("PING!");
  }

  handleMessageFromWorker(m) {
    console.log("[HOST] Received a message from my worker: ", m.data);
  }

  render() {
    return (
      <React.Fragment>
        <b>Hello Worker</b> <br />
        <button onClick={this.handleClick}>
          Post Message to Worker
        </button>
      </React.Fragment>
    );
  }
}

export default HelloWorkerComponent;
