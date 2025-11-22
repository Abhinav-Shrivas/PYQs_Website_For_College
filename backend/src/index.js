const express = require ('express');
const multer = require('multer');
const path = require ('path');
const {getData,uploadData} = require ('./controller');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where files will be stored (create "uploads" folder in root)
  },
  filename: (req, file, cb) => {
    // Example: pdfFile-1631029381293.pdf
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// file filter (optional: accept only pdf)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

// max size = 5 MB
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


app.get('/data',getData);
app.post('/upload',upload.single("pdfFile"),uploadData)
const startServer = async () => {
    app.listen(3003, ()=>{
        console.log("server started at : 3003")
    })
}
startServer();