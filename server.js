/*
UTILITIES
 */
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require("path");

/*
WEBSERVER
 */
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const app = express();
const https_server = https.createServer(options, app);

// public root
app.use(express.static(path.resolve(__dirname, 'public')));

// start server
const PORT = 8000;
https_server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
