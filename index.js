const http = require('http');
const url = require('url');
const { parse } = require('querystring');
require('dotenv').config();
const { pool, query } = require('./database.js');

const PORT = process.env.PORT || 5000;

// Generated by ChatGPT
// Function to check if the 'patient' table exists
async function patientTableExists() {
    try {
        const queryText = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = 'patient'
            );
        `;
        const { rows } = await pool.query(queryText);
        return rows[0].exists;
    } catch (error) {
        console.error("Error checking 'patient' table existence:", error);
        return false;
    }
}



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
    // const reqUrl = url.parse(req.url, true);
    if (req.method === 'GET') {
        console.log("Received Get Request");
        // This portion (49 to 62) was generated by ChatGPT
        // Check if the 'patient' table exists
        patientTableExists()
            .then((exists) => {
                if (!exists) {
                    // If 'patient' table does not exist, create it
                    const createTableQuery = `
                        CREATE TABLE patient (
                            patientId SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            dateOfBirth DATE NOT NULL
                        )
                    `;
                    return pool.query(createTableQuery);
                }
            })

        // Extract the query parameter from the URL
        // const queryStr = reqUrl.query;
        // console.log("Query parameter:", queryStr);
        const { url: requestUrl } = req;
        let queryStr = decodeURIComponent(requestUrl.split([1]));
        queryStr = queryStr.replace("/", "")
        console.log("Query parameter:", queryStr);

        pool.query(queryStr)
            .then((result) => {
                console.log("Data retrieved successfully");
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(result.rows));
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ message: 'Error retrieving data' }));
            });
    } else if (req.method === 'POST') {
        console.log("Received Post Request")

        // This portion (94 to 107) was generated by ChatGPT
        // Check if the 'patient' table exists
        patientTableExists()
            .then((exists) => {
                if (!exists) {
                    // If 'patient' table does not exist, create it
                    const createTableQuery = `
                        CREATE TABLE patient (
                            patientId SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            dateOfBirth DATE NOT NULL
                        )
                    `;
                    return pool.query(createTableQuery);
                }
            })

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
                    res.writeHead(200, {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ message: 'POST request received' }));
                })
                .catch((error) => {
                    console.error("Error inserting data:", error);
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ message: 'Error inserting data' }));
                });
        });
    } else {
        res.writeHead(404, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
