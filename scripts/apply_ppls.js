const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('ppls.txt', 'utf8');
const files = content.split(/^==== (.*?) ====/m);

// The split returns: [ preamble, filename1, content1, filename2, content2, ... ]
for (let i = 1; i < files.length; i += 2) {
  const filePath = path.join(__dirname, files[i].trim());
  const fileContent = files[i+1].replace(/^\n/, ''); // remove the leading newline after the ==== marker
  
  if (filePath.includes("ScaleWrapper")) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, fileContent);
    console.log(`Written ${filePath}`);
  }
}
