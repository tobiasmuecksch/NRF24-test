# NRF24-test

This is repository contains files to test the [NRF24 package](https://github.com/ludiazv/node-nrf24). I'm using these files on my Raspberry Pi 3B+ and Raspberry Zero W.

## Related issues

- [#3: Packages arrive only when auto_ack: true](https://github.com/ludiazv/node-nrf24/issues/3)
- [#4: Performance issues](https://github.com/ludiazv/node-nrf24/issues/4)

## Preparation

1. `npm i`

## Tests

### With wrapper:
**Receiver:**
`sudo node receiver`

**Sender:**
`sudo node sender`

### Without wrapper:
**Receiver:**
`sudo node receiver_without_wrapper`

**Sender:**
`sudo node sender_without_wrapper`
