const fs = require('fs');
const path = require('path');

async function createStyleBundle() {
  const files = await fs.promises.readdir(path.resolve(__dirname, 'styles'));
  let data = '';
  
  for (const file of files) {
    if (path.extname(file) !== '.css') continue;
    let stream = fs.createReadStream((path.resolve(path.resolve(__dirname, 'styles'), file)));
    stream.setEncoding('utf8');
    for await (const chunk of stream) {
      data += chunk +'\n';
    }
  }
  
  const outputStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));
  outputStream.write(data);
  outputStream.end();

}

createStyleBundle();