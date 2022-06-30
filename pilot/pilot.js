'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3030;

const io = require('socket.io-client');
let host = `http://localhost:${PORT}`;
const systemConnection = io.connect(host);
let airLineConnection = io.connect(`${host}/airline`);

///for msgQueue
systemConnection.emit('get_all');
systemConnection.on('flight', (flight) => { //m2
    console.log(`Pilot:Sorry i didnt catch this flight ID ${flight.id}`);
    systemConnection.emit('received', flight); //m3
})
///
airLineConnection.on('new-flight', tookOff); //(4)
function tookOff(payload) {
    setTimeout(() => {
        let Flight = {
            event: 'took_off',
            time: new Date().toLocaleString(),
            Details: {
                airLine: 'Royal Jordanian Airlines',
                flightID: payload.Details.flightID,
                pilot: payload.Details.pilot,
                destination: payload.Details.destination
            }
        }
        console.log(`Pilot: flight with ID ‘${payload.Details.flightID}’ took-off`);
        airLineConnection.emit('took-off', Flight) //(5)
    }, 4000);
}

airLineConnection.on('took-off', flightArrived); //(8)
function flightArrived(payload) {
    setTimeout(() => {
        let Flight = {
            event: 'arrived',
            time: new Date().toLocaleString(),
            Details: {
                airLine: 'Royal Jordanian Airlines',
                flightID: payload.Details.flightID,
                pilot: payload.Details.pilot,
                destination: payload.Details.destination
            }
        }
        console.log(`Pilot: flight with ID '${payload.Details.flightID}' has arrived`);
        airLineConnection.emit('arrived', Flight) //(9)
    }, 3000)
}