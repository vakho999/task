const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
const message = 'გამარჯობა Node სერვერიდან!';

res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain; charset=utf-8');
res.end(message + '\n');
});

server.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});