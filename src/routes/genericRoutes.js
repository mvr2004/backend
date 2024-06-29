// src/routes/genericRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/generic/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('Arquivo genérico enviado com sucesso!');
});

module.exports = router;
