const fs = require('fs');
const path = require('path');
const os = require('os');

fs.writeFile(path.resolve(__dirname, 'text.txt'),'', ()=> {
  process.stdout.write(`Hi. Ctrl + c or 'Exit' to finish!) ${os.EOL}`);
  process.stdin.on('data', (data)=>{
    if(data.toString().trim() === 'exit' ){

      process.exit();
    }
    fs.appendFile(path.resolve(__dirname, 'text.txt'), data.toString(), ()=>{console.log('writed text');});
  });
  process.on('SIGINT', process.exit);
  process.on('exit', ()=>{
    process.stdout.write(`${os.EOL} Good Bye ${os.EOL}`);
    process.exit();
  });
  
});