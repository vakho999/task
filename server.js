const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

// წიგნების "ბაზა" მეხსიერებაში
let books = [
  { title: 'Book One' },
  { title: 'Book Two' },
  { title: 'Book Three' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  // პასუხისთვის ჰედერი
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (method === 'GET' && path === '/books') {
    // ყველა წიგნის დაბრუნება
    res.statusCode = 200;
    res.end(JSON.stringify(books));
  } 
  else if (method === 'POST' && path === '/books') {
    // ახალი წიგნის დამატება
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.title) {
          books.push({ title: data.title });
          res.statusCode = 201;
          res.end(JSON.stringify({ message: 'წიგნი დამატებულია', books }));
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'title ველი აუცილებელია' }));
        }
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'არასწორი JSON' }));
      }
    });
  } 
  else if (method === 'DELETE' && path === '/books') {
    // წასაშლელი წიგნი query-ში
    const title = parsedUrl.query.title;
    if (!title) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'title query parameter აუცილებელია' }));
      return;
    }

    const initialLength = books.length;
    books = books.filter(b => b.title !== title);

    if (books.length < initialLength) {
      res.statusCode = 200;
      res.end(JSON.stringify({ message: `წიგნი "${title}" წაშლილია`, books }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'ასეთი წიგნი ვერ მოიძებნა' }));
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
