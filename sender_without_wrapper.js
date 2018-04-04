'use strict';

const nrf24 = require('nrf24'); // Load the module

// Init the radio
const rf24 = new nrf24.nRF24(22, 0);
rf24.begin();

console.log('Radio connected:' + rf24.present());
console.log('Is + Variant:' + rf24.isP()); // Prints true/false if radio is + Variant

// Configure the radio
rf24.config({
	PALevel: nrf24.RF24_PA_LOW,
	DataRate: nrf24.RF24_2MBPS
});

// Register Reading pipes
const pipe = rf24.addReadPipe('0x65646f4e31', true) // listen in pipe '0x65646f4e31' with AutoACK enabled.

// Select the pipe address to write
rf24.useWritePipe('0x72646f4e31'); 

let count = 0;

const emitLoop = () => {
	count++;
	const data = Buffer.from('HELLO WORLD ' + count); // Create a node buffer for sending data
	rf24.write(data); // send the data
	
	// Recursively call self. Timeout needed to prevent blocking.
	setTimeout(emitLoop);
};


setInterval(() => {
	// If you want to stop listening
	console.log('SENT PPS:', count);

	count = 0;
}, 1000);

// Start Sending
console.log('=== START SENDING ===');
emitLoop();

