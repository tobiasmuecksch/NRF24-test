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
	'0x72646f4e31',
	// Write Pipe
	'0x65646f4e31',
	// Auto ACK
	true,
	// Debug
	false
);


nrf.dataStream.subscribe((data) => {
	console.log('RECEIVED DATA: ', data);
});


let emitCount = 0;

const emitLoop = () => {
	emitCount++;

	nrf.emitString('EVENT ' + emitCount);
	setTimeout(emitLoop);
};

setInterval(() => {
	console.log('SENT PPS: ', emitCount);
	emitCount = 0;
}, 1 * 1000);

console.log('=== START SEDNING ===');
emitLoop();