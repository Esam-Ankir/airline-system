'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3030;
const ioServer = require('socket.io')(PORT);
const airLineSystem = ioServer.of('/airline');

const uuid = require('uuid').v4;
const msgQueue = {
    flights: {
    }
}
ioServer.on('connection', (socket) => {
    console.log('connected to ioServer ', socket.id);
    socket.on('new-flight', (payload) => { //(2)
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
        const id = uuid();
        msgQueue.flights[id] = payload;
        airLineSystem.emit('new-flight', payload) //(3)
        console.log({ Flight });
    });
    /////for msgQueue
    socket.on('get_all', () => {
        console.log('get all waiting flights');
        Object.keys(msgQueue.flights).forEach((id) => {
            socket.emit('flight', { //m1
                id: id,
                payload: msgQueue.flights[id],
            })
            console.log(id,msgQueue.flights[id]);
        })
    })
    socket.on('received', (flight) => { //m4
        delete msgQueue.flights[flight.id];
        console.log('flight done and deleted');
    })
    /////
});

airLineSystem.on('connection', (socket) => {
    console.log('connected to airline system ', socket.id);
    socket.on('new-flight', (payload) => {
        console.log('manager is adding new flight');
        const id = uuid();
        msgQueue.flights[id] = payload;
        airLineSystem.emit('flight', {
            id: id,
            payload: msgQueue.flights[id]
        })
    })
    socket.on('took-off', (payload) => { //(6)
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
        airLineSystem.emit('took-off', payload) //(7)
        console.log({ Flight });
    });
    socket.on('arrived', (payload) => { //(10)
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
        airLineSystem.emit('arrived', payload) //(11)
        console.log({ Flight });
        console.log('====================================');
    });
});






