var self = this;
export default () => {
    self.onmessage = function(e) {
        console.log('[WORKER] Recieved a message from Host:', e.data);
        console.log('[WORKER] Sending a message back to Host...');
        self.postMessage("PONG!");
    }
}