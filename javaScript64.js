const { 
  readFileSync,
  writeFileSync,
  mkdir,
  rm,
  readdirSync,
  existsSync
} = require('fs');
const { extname } = require('path');

let SecretJpg = {
  decodedDirName: 'decoded',
  encodedFileName: 'encoded.json', 

  /*
  * Метод кодирует все файлы с расширением jpg,
  * находящиеся в одной папке со скриптом
  * и создаст json файл, в который поместит
  * результат
  * 
  */
  encode: function () {
    const encodedFiles = readdirSync('./')
      .filter(file => extname(file) === '.jpg')
      .map(file => [file, readFileSync(file).toString('base64')]);

    writeFileSync(`./${this.encodedFileName}`, JSON.stringify(encodedFiles));
  },


  /*
  * Метод раскодирует информацию из файла json
  * и создаст папку, в которую поместит
  * результат
  * 
  */
  decode: async function () {
    if (!this.existsEncodedFile()) {
      throw `${this.encodedFileName} not exists`
    }
    if (this.existsDirection()) {
      // this.clearDirection(() => {
      //   this.makeDirection(() => {
      //     this.writeDecodedFiles();
      //   });
      // });
      this.clearDirection()
        .then(() => this.makeDirection())
        .then(() => this.writeDecodedFiles());
    } else {
      this.makeDirection()
        .then(() => this.writeDecodedFiles());
    }
  },

  clearDirection: async function () {
    rm(`./${this.decodedDirName}`, {recursive: true}, (err) => {
      if (err) throw err;
    });
  },

  clearCode: function (callback) {
    rm(`./${this.encodedFileName}`, (err) => {
      if (err) throw err;
      callback && callback();
    });
  },

  clearAll: function () {
    this.clearDirection();
    this.clearCode();
  },

  makeDirection: async function () {
    mkdir(`./${this.decodedDirName}`, { recursive: false }, (error) => {
      if (error) throw error 
    });
  },

  existsDirection: function () {
    return existsSync(`./${this.decodedDirName}`);
  },

  existsEncodedFile: function () {
    return existsSync(`./${this.encodedFileName}`);
  },

  writeDecodedFiles: function () {
    require(`./${this.encodedFileName}`)
      .map(file => [file[0], Buffer.from(file[1], 'base64')])
      .forEach(file => writeFileSync(`./${this.decodedDirName}/${file[0]}`, file[1]));
  }
}

// SecretJpg.encode();
SecretJpg.decode();

module.exports = SecretJpg;