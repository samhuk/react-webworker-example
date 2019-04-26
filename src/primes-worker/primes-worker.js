// Web worker that finds the prime factor of a number.
// Use: First message to the worker must be a string specifying
// the host url, i.e.: document.location.protocol + '//' + document.location.host
// and further messages of type Number will be processed normally to find the prime factors.

var self = this;
// eslint-disable-next-line
var workerIndex = 0;

export default () => {
    self.onmessage = (e) => {
        console.log('[WORKER] Recieved message from Host:', e.data);
        if (e.data.url) {
            console.log('[WORKER] Recieved host url message from Host.');
            self.importScripts(e.data.url + 'worker-scripts/prime-factoring-script.js');
        } else if (e.data.workerIndex) {
            console.log('[WORKER] Recieved my workerIndex number message from Host.');
            self.workerIndex = e.data.workerIndex;
        } else if (typeof e.data === "number") {
            console.log('[WORKER] Recieved number message from Host.');
            let number = e.data;
            if (number > 2) {
                console.log('[WORKER] Calculating the prime factors of ', number , '...');
                let primeFactors = self.calcPrimeFactors(number);
                console.log('[WORKER] Sending answer to Host...');
                self.postMessage({ primeFactors, isError: false, errorMessage: null, workerIndex: self.workerIndex });
            } else {
                self.postMessage({ isPrime: false, isError: false, errorMessage: null, workerIndex: self.workerIndex });
            }
        } else {
            self.postMessage({ 
                isPrime: null,
                isError: true,
                errorMessage: "ingress message data is not of number or string type.",
                workerIndex: self.workerIndex
            });
        }
    }
}