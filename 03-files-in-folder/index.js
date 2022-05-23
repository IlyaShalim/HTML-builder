const fs = require('fs');
const path = require('path');

async function readFile(){
  const files = await fs.promises.readdir(path.resolve(__dirname, 'secret-folder'));

  files.forEach(async (file)=> {
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats)=>{
      if(!stats.isDirectory()){
        const extName = path.extname(file);
        const baseName = path.basename(file, extName);
        process.stdout.write(`${baseName} - ${extName.slice(1)} - ${stats.size}KB\n`);
      }
    });

  });
  
} 
readFile();
