const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para criar o diretório se não existir
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Diretório criado: ${directory}`);
  }
};

const uploadDirectory = path.join(__dirname, '../public/uploads/');
createDirectoryIfNotExists(uploadDirectory);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
