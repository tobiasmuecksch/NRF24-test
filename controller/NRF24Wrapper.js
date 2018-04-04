'use strict';

const Subject = require('rxjs').Subject;
const nrf24 = require("nrf24"); // Load the module

class NRF24Wrapper {

	constructor(
		gpioPin = 22,
		cePin = 0,
		// 1 - 127
		channel = 13,
		// min, low, high, max
		powerLevel = 'low',
		writePipeAddress = '0x72646f4e31',
		readPipeAddress = '0x65646f4e31',
		auto_ack = true,
		debug = false
	) {
		// Instantiate NRF module
		this.radio = new nrf24.nRF24(gpioPin, cePin);
		// Initialize the hardware for transmitting an receiving
		this.radio.begin(debug);

		// Check if radio is connected. This function must be called after begin to work properly.
		this.isPresent = this.radio.present();
		// Check if the connected radio is nRF24L01+ variant.
		this.isPlus = this.radio.isP();

		// Configure the radio
		this.radio.config({
			// Transmission power (MIN, LOW, HIGH, MAX)
			PALevel: this._mapPowerLevel(powerLevel),
			// Speed of transmission bps (2MBPS,1MBPS,250KB)
			DataRate: nrf24.RF24_2MBPS,
			//
			CRCLength: nrf24.RF24_CRC_DISABLED,  // RF24_CRC_DISABLED,RF24_CRC_8,RF24_CRC_16
			// 1 - 127
			Channel: channel,
			// 1 - 32
			PayloadSize: 32
		});

		this._preStart();
		
		// Register Reading pipes
		this.readPipe = this.radio.addReadPipe(readPipeAddress, auto_ack);
		// Register Write Pipe
		this.radio.useWritePipe(writePipeAddress);

		// Create event stream behavior subject
		this.dataStream = new Subject();

		// Start reading
		this._listen();
	}

	emitBuffer(buffer) {
		this.radio.write(buffer);
	}

	emitString(str) {
		this.radio.write(Buffer.from(str, 'utf8'));
	}

	stop() {
		console.log('SHUTTING DOWN RADIO');
		this.radio.stop_read();
	}

	_preStart() {
		if (!this.isPresent) {
			console.error('ERROR: Radio hardware seems to be not present');
		}
	}

	_listen() {
		console.log('=== START LISTENING ===');
		this.radio.read(( buffer, pipe ) => {
			// when data arrives on any registered pipe this function is called
			// data -> node buffer with the data
			// pipe -> number of the pipe
			this.dataStream.next(buffer);
		},( isStopped, by_user, error_count ) => {
			// This function will also be called if the listening process is stoped.
			if (!isStopped) {
				console.log("RADIO ERROR: ", 'by_user', by_user, 'error_count', error_count);
			}
		});
	}

	_mapPowerLevel(levelStr = 'low') {
		// Transmission power (MIN, LOW, HIGH, MAX)
		if (levelStr === 'min') {
			return nrf24.RF24_PA_MIN;
		}
		if (levelStr === 'low') {
			return nrf24.RF24_PA_LOW;
		}
		if (levelStr === 'high') {
			return nrf24.RF24_PA_HIGH;
		}
		if (levelStr === 'max') {
			return nrf24.RF24_PA_MAX;
		}

		// Default if string is unkown
		return nrf24.RF24_PA_LOW;
	}

}

module.exports = NRF24Wrapper;