const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Default route for server
app.get('/', (req, res) => res.status(200).send({
    message: "Server is running..."
}));


const WriteTextToFileAsync = async(contentToWrite) => {
    fs.writeFile('./src/data.json', contentToWrite, (error) =>  {
        console.log(contentToWrite);
        if (error) {
            console.log(error);
        } else {
            console.log('Success!')
        }
    })
}

// Declare Post / Write route to accept incoming request with data
app.post('/beers', async (req, res, next) => {
    //Takes the body from incoming requests by using req.body and converts into a string 
    const requestContent = JSON.stringify(req.body);
    await WriteTextToFileAsync(requestContent)
});

// 404 route for server
app.use((req, res, next) => res.status(404).send({
    message: "Could not find requested route"
}));

// Run server
app.listen(PORT, () => {
    console.log(
        `
        !!! Server is running
        !!! Listening for incoming requests on port ${PORT}
        !!! http://localhost:8080
        `
    )
});

