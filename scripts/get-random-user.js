const fs = require('fs');

// This script grabs a random user from a text file labled as `userz.txt`

module.exports = async function() {
    fs.readFile('../data/userz.txt', function (err, fileData) {
        var userArray = fileData.toString().split('\n');

        var randUser = userArray[Math.floor(Math.random() * userArray.length)];
        randUser = randUser.split(',');

        var userCred = {
            username: randUser[7],
            password: randUser[8]
        }

        return userCred;
    })
}