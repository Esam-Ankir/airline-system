'use strict';
const events = require('./lib/events/events');
const { faker } = require('@faker-js/faker');
require('./lib/pilot/pilot');
require('./lib/system/system');


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
    events.emit('new-flight', Flight)
}, 10000)


events.on('arrived', flightArrived);
function flightArrived(Flight) {
    console.log('====================================');
    console.log(`Manager: we’re greatly thankful for the amazing flight, ${Flight.Details.pilot}`);
    console.log('====================================');
}
