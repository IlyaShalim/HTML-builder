const fs = require('fs');
const path = require('path');

async function copyFolder(input, output) {
  await fs.promises.rm(output, { recursive: true, force: true });
  await fs.promises.mkdir(output, { recursive: true });

  const files = await fs.promises.readdir(input);

  for (const file of files) {
    fs.stat(path.resolve(input, file), (err, stats) => {
      if (stats.isDirectory()) {
        copyFolder(
          path.resolve(input, file),
          path.resolve(output, file)
        );
      } else {
        fs.promises.copyFile(
          path.join(input, file),
          path.join(output, file)
        );
      }
    });
  }
}

copyFolder(
  path.resolve(__dirname, 'files'),
  path.resolve(__dirname, 'files-copy')
);
