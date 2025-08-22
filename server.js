const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'books.json');

function loadBooks() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('ფაილის წაკითხვის შეცდომა:', err);
    return [];
  }
}

function saveBooks(books) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), 'utf-8');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const path = url.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (method === 'GET' && path === '/books') {
    const books = loadBooks();
    res.statusCode = 200;
    res.end(JSON.stringify(books));
  } 
  else if (method === 'POST' && path === '/books') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.title) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'title ველი აუცილებელია' }));
        }

        let books = loadBooks();
        if (books.find(b => b.title === data.title)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: `"${data.title}" უკვე არსებობს` }));
        }

        books.push({ title: data.title });
        saveBooks(books);

        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'წიგნი დამატებულია', books }));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'არასწორი JSON' }));
      }
    });
  } 
  else if (method === 'DELETE' && path === '/books') {
    const title = url.searchParams.get('title');
    if (!title) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'title query param აუცილებელია' }));
    }

    let books = loadBooks();
    const initialLength = books.length;
    books = books.filter(b => b.title !== title);

    if (books.length < initialLength) {
      saveBooks(books);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: `წიგნი "${title}" წაშლილია`, books }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `"${title}" ვერ მოიძებნა` }));
    }
  } 
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'მოთხოვნილი როუტი არ არსებობს' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
