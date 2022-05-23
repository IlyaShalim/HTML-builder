const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');


async function createFolder() {
  let outputDirPath = path.resolve(__dirname, 'project-dist');
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });
}

async function createBundleStyles() {
  const files = await fs.promises.readdir(path.resolve(__dirname, 'styles'));
  let data = '';

  for (const file of files) {
    if (path.extname(file) !== '.css') continue;
    data += (await getData(path.resolve(path.resolve(__dirname, 'styles'), file))) + '\n';
  }

  const outputChunkStream = fs.createWriteStream(
    path.resolve(__dirname, 'project-dist', 'style.css')
  );
  outputChunkStream.write(data);
  outputChunkStream.end();
}

async function getData(file) {
  let stream = fs.createReadStream(file);
  stream.setEncoding('utf8');
  let data = '';
  for await (const chunk of stream) {
    data += chunk;
  }
  return data;
}

async function createHtmlFile() {
  let outputStream = fs.createWriteStream(
    path.resolve(__dirname, 'project-dist', 'index.html')
  );
  let stream = fs.createReadStream(path.resolve(__dirname, 'template.html'));
  const TransformTemplate = new Transform({
    async transform(chunk) {
      const regexp = /{{(.*)}}/g;
      const replacement = [...chunk.toString().matchAll(regexp)];

      const results = await Promise.all(
        replacement.reduce((acc, el) => {
          acc.push(
            (async (el) => {
              let html = await getData(
                path.resolve(__dirname, 'components', el[1] + '.html')
              );
              return { placeholder: el[0], html: html };
            })(el)
          );
          return acc;
        }, [])
      );
      let html = chunk.toString();
      results.forEach((result) => {
        html = html.replace(result.placeholder, result.html);
      });
      this.push(html);
    },
  });

  stream.pipe(TransformTemplate).pipe(outputStream);
}

async function copyFolder(inputDirPath, outputDirPath) {
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });

  const files = await fs.promises.readdir(inputDirPath);
  for (const file of files) {
    fs.stat(path.resolve(inputDirPath, file), (err, stats) => {
      if (!stats.isDirectory()) {
        fs.promises.copyFile(
          path.join(inputDirPath, file),
          path.join(outputDirPath, file)
        );
      } else {
        copyFolder(
          path.resolve(inputDirPath, file),
          path.resolve(outputDirPath, file)
        );
      }
    });
  }
}

async function copyFiles() {
  await copyFolder(
    path.resolve(__dirname, 'assets'),
    path.resolve(__dirname, 'project-dist', 'assets')
  );
}

async function bundler() {
  await createFolder();
  createBundleStyles();
  createHtmlFile();
  copyFiles();
}

bundler();