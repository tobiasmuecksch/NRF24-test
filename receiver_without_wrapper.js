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
	DataRate: nrf24.RF24_1MBPS
});

// Register Reading pipes
const pipe = rf24.addReadPipe('0x72646f4e31', true) // listen in pipe '0x65646f4e31' with AutoACK enabled.

let count = 0;

// Register callback for reading
rf24.read( (data, pipe) => {
	// when data arrive on any registered pipe this function is called
	// data -> node buffer with the data
	// pipe -> number of the pipe   
	count++;
},( isStopped, by_user, error_count ) => {
	// This will be if the listening process is stoped.
	console.log('ERROR: ', isStopped, by_user, error_count);
});

setInterval(() => {
	console.log('INCOMING PPS: ' + count);
	count = 0;
}, 1000);

