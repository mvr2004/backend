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
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Define o diretório de destino para os uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueSuffix); // Define o nome do arquivo no destino
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
