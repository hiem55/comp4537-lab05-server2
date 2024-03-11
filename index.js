const http = require('http');
const url = require('url');
const { parse } = require('querystring');
require('dotenv').config();
const { pool, query } = require('./database.js');

const PORT = process.env.PORT || 5000;
const path = "/patient" //replace later

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);

    // Parse the URL path and handle routes
    if (reqUrl.pathname === path && req.method === 'GET') {
        console.log("Received Get Request")
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'GET request received' }));
        // let body = '';
        // req.on('data', (chunk) => {
        //     body += chunk;
        // });
        // req.on('end', () => {
        //     console.log(`Server received GET request body: ", ${body}`)
        //     res.writeHead(200, { 'Content-Type': 'application/json' });
        //     // Pool.query(body)
        //     res.end(JSON.stringify({ message: 'GET request received', body }));
        // });
    } else if (reqUrl.pathname === path && req.method === 'POST') {
        console.log("Received Post Request")
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            console.log(`Server received POST request body: ", ${body}`)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            query(body)
            res.end(JSON.stringify({ message: 'POST request received', body }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
