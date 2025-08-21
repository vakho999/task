const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'books.json');

function loadBooks() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('books.json უნდა იყოს მასივი');
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      saveBooks([]);
      return [];
    }
    console.error('შეცდომა ჩატვირთვისას:', err.message);
    process.exit(1);
  }
}

function saveBooks(list) {
  fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), 'utf8');
}

function listBooks() {
  const books = loadBooks();
  if (books.length === 0) return console.log('არ არის შენახული წიგნები.');
  console.log('📚 წიგნები:');
  books.forEach((b, i) => console.log(`${i + 1}. ${b}`));
}

function addBook(title) {
  if (!title) {
    console.error('გამოყენება: node books.js add "Book Title"');
    process.exit(1);
  }
  const books = loadBooks();
  if (books.includes(title)) {
    console.log('ეს წიგნი უკვე არსებობს სიაში.');
    return;
  }
  books.push(title);
  saveBooks(books);
  console.log('დაემატა:', title);
}

function removeBook(title) {
  if (!title) {
    console.error('გამოყენება: node books.js remove "Book Title"');
    process.exit(1);
  }
  const books = loadBooks();
  const idx = books.indexOf(title);
  if (idx === -1) {
    console.log('ამ სათაურით წიგნი ვერ მოიძებნა.');
    return;
  }
  books.splice(idx, 1);
  saveBooks(books);
  console.log('წაიშალა:', title);
}

function help() {
  console.log(`გამოყენება:
  node books.js list
  node books.js add "Clean Code"
  node books.js remove "Clean Code"`);
}

const [,, cmd, ...rest] = process.argv;

switch (cmd) {
  case 'list':
    listBooks();
    break;
  case 'add':
    addBook(rest.join(' ').trim());
    break;
  case 'remove':
    removeBook(rest.join(' ').trim());
    break;
  default:
    help();
}
