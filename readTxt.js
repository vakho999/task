const fs = require('fs');
const path = require('path');

const filepath = process.argv[2];


if (!filepath) {
console.error('გამოყენება: node readTxt.js <path/to/file.txt>');
process.exit(1);
}

const full = path.resolve(filepath);

fs.readFile(full, 'utf8', (err, data) => {
if (err) {
console.error('შეცდომა ფაილის წაკითხვისას:', err.message);
process.exit(1);
}
console.log('\n=== ფაილის შემცველობა ===');
console.log(data);
});