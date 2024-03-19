const http = require('http');
const url = require('url');
const { parse } = require('querystring');
require('dotenv').config();
const { pool, query } = require('./database.js');

const PORT = process.env.PORT || 5000;

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

    // Parse the URL path and handle routes
    const reqUrl = url.parse(req.url, true);
    if (req.method === 'GET') {
        console.log("Received Get Request");

        // Extract the query parameter from the URL
        const queryStr = reqUrl.query.query;
        console.log("Query parameter:", queryStr);

        pool.query(queryStr)
            .then((result) => {
                console.log("Data retrieved successfully");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows));
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error retrieving data' }));
            });
    } else if (req.method === 'POST') {
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
