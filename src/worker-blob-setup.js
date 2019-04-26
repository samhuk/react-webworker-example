// This is an abstraction on the standard "new Worker()" way to create a web worker.
// Accepts worker javascript, and turns it into an blob object URL.
export default class WebWorker {
	constructor(worker) {
		const code = worker.toString();
		const blob = new Blob(['('+code+')()']);
		return new Worker(URL.createObjectURL(blob));
	}
}