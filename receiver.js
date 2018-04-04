'use strict';

const NRF24Wrapper = require('./controller/NRF24Wrapper');

const nrf = new NRF24Wrapper(
	// GPIO Pin
	22,
	// CE Pin
	0, 
	// Channel
	13, 
	// Power Level
	'high',
	// Read Pipe
	'0x65646f4e31',
	// Write Pipe
	'0x72646f4e31',
	// Auto ACK
	true,
	// Debug
	false
);

let pkgCount = 0;

nrf.dataStream.subscribe((data) => {
	pkgCount++;
});

setInterval(() => {
	console.log('INCOMING PPS:', pkgCount);

	pkgCount = 0;
}, 1 * 1000);

/*
setTimeout(() => {
	// If you want to stop listening
	console.log('STOP READ');
	radio.stop();
}, 360 * 1000);
*/