require('dotenv').config();

const mongoose = require('mongoose');
const Room = require('../model/Room.model');
const ROOMS = require('../data/rooms.json');
const Company = require('../model/Company.model');
const COMPANIES = require('../data/companies.json');
const Player = require('../model/Player.model');
const PLAYERS = require('../data/players.json')


require('../config/db.config');

mongoose.connection.once('open', () => {
    mongoose.connection.db
        .dropDatabase()
        .then(() => {
            console.log('Database dropped')
            return Company.create(COMPANIES);
        })
        .then((createdCompanies) => {
            createdCompanies.forEach((company) => {
                console.log(`The company ${company.companyName} has been created`);
            });
            ROOMS.forEach((room) => {
                const companyMatch = createdCompanies.find((company) => {

                    return company.companyName === room.companyName
                });

                if (companyMatch) {
                    room.company = companyMatch._id;
                }
            })
            return Room.create(ROOMS);
        })
        .then((createdRooms) => {
            createdRooms.forEach((room) => {
                console.log(`The room ${room.name} has been created`)
            });

            return Player.create(PLAYERS)

        })
        .then((createdPlayers) => {
            createdPlayers.forEach((player) => {
                console.log(`The player ${player.name} has been created`)
            })

            return mongoose.connection.close();
        })
        .then(() => {
            console.log('Connection closed');
        })
        .catch((err) => {
            console.error(err);
        })
})