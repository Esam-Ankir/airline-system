'use strict';
require('dotenv').config();
const PORT = process.env.PORT ;
const { faker } = require('@faker-js/faker');

const io = require('socket.io-client');
let host = `http://localhost:${PORT}`;
const systemConnection = io.connect(host);
let airLineConnection = io.connect(`${host}/airline`);


setInterval(() => {
    let Flight = {
        event: 'new-flight',
        time: new Date().toLocaleString(),
        Details: {
            airLine: 'Royal Jordanian Airlines',
            flightID: faker.datatype.uuid(),
            pilot: faker.name.findName(),
            destination: faker.address.cityName()
        }
    }
    console.log(`Manager: new flight with ID ‘${Flight.Details.flightID}’ have been scheduled`);
    systemConnection.emit('new-flight', Flight)  //(1)
}, 10000)

airLineConnection.on('arrived', flightArrived); //(12)
function flightArrived(Flight) {
    console.log(`Manager: we’re greatly thankful for the amazing flight, ${Flight.Details.pilot}`);
}
