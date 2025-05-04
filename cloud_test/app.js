require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Verify Cloudinary config is loading
console.log('Cloudinary Config:', {
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'form_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file received');
    return res.status(400).json({ 
      status: 'error',
      message: 'No file uploaded' 
    });
  }

  console.log('Upload success:', {
    originalname: req.file.originalname,
    size: req.file.size,
    cloudinaryUrl: req.file.path
  });

  res.json({
    status: 'success',
    file: {
      url: req.file.path,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});