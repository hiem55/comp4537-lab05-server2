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
    //     console.log("Received Get Request")
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'GET request received' }));
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            results = query(body)
        });
        res.end(JSON.stringify({ message: 'GET request received', results }));
    } else if (reqUrl.pathname === path && req.method === 'POST') {
        console.log("Received Post Request")
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            console.log(`Server received POST request body: ", ${body}`)
            // Parse the request body to extract data
            const data = JSON.parse(body);
            const queryStr = data.query;

            // Execute the SQL query
            pool.query(queryStr)
                .then(() => {
                    console.log("Data inserted successfully");
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'POST request received' }));
                })
                .catch((error) => {
                    console.error("Error inserting data:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error inserting data' }));
                });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
