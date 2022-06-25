'use strict';
const events = require('../events/events');
require('../pilot/pilot');
require('../../manager');

events.on('new-flight', flightSystem);
events.on('took-off', flightSystem);
events.on('arrived', flightSystem);

function flightSystem(payload) {
    let Flight = {
        event: payload.event,
        time: new Date().toLocaleString(),
        Details: {
            airLine: 'Royal Jordanian Airlines',
            flightID: payload.Details.flightID,
            pilot: payload.Details.pilot,
            destination: payload.Details.destination
        }
    }
    console.log({ Flight });
}

