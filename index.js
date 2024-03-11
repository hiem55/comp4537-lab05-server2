const http = require('http');
const url = require('url');
const { parse } = require('querystring');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const path = "temp" //replace later

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    // Parse the URL path and handle routes
    if (reqUrl.pathname === path && req.method === 'GET') {
        bookRouter.getBooks(req, res);
    } else if (reqUrl.pathname === path && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = parse(body);
            bookRouter.createBook(req, res, data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
