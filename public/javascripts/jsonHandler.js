const fs = require("fs");
const file = require('express').Router();
const bodyParser = require('body-parser');

const writeEditJSONFile = file.post('/editJSON', bodyParser.json(), (req, res) => {
    const type = req.body.type;
    const id = req.body.hash;
    const path = './storedHash.json';

    console.log('type: ' + type)

    // if the file exists
    if (fs.existsSync(path)) {

        // read file
        fs.readFile(path, (err, data) => {

            let objectFromData = JSON.parse(data);
            let arr = objectFromData.data;

            const nameData = arr.map(x => x.type);

            console.log(nameData);

            // if key not in JSON file
            if (!(nameData.includes(type))) {

                // Add it and write it to file
                arr.push({type: type, hash: id});

                fs.writeFileSync(path, JSON.stringify(objectFromData), (err) => {
                    if (err) {
                        res.status(200).send({status:200, message: "could not add new record in JSON"});

                    }
                })
                // if key is in the JSON file - update it
            } else {

                // splice out old key:value
                arr.splice(nameData.indexOf(type),1);

                // push in new one and write to file
                arr.push({type: type, hash: id});

                fs.writeFileSync(path, JSON.stringify(objectFromData), (err) => {
                    if (err) {
                        res.status(200).send({status:200, message: "could not update JSON"});
                    }
                })
                res.status(201).send({status:201, message: "hashed"});
            }

        })

        // if the file doesnt exist
    } else {

        // Create and write to a new JSON file with the passed in values
        let ids = {
            name: 'hashlist',
            data: [{type: type, hash: id}]
        };

        fs.writeFileSync(path, JSON.stringify(ids), (err) => {
            if (err) {
                res.status(200).send({status:200, message: "could not create JSON file"});
            }
        })
    }
});


const getKeyFromJSON = file.post('/getkeyfromJSON', bodyParser.json(), (req, res) => {
    console.log("in key from JSON")

    const type = req.body.type;
    const path = './storedHash.json';

    if (fs.existsSync(path)) {

        fs.readFile(path, (err, data) => {
            let objectFromData = JSON.parse(data);
            let arr = objectFromData.data;

            const nameData = arr.map(x => x.type);

            const index = nameData.indexOf(type);

            res.status(201).send({status: 201, key: (arr[index].hash)});
        });

        } else {
            res.status(200).send({status:200, message: "JSON file does not exist"});
    }
});

module.exports = {
    writeEditJSONFile,
    getKeyFromJSON,
}
