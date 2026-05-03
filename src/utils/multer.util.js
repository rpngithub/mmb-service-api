const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'application/zip', 'application/x-zip-compressed',
];
// images, pdf, .ai, psd
const ALLOWED_MIME_TYPES_ASSETS = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'application/postscript', 'image/vnd.adobe.photoshop',
];


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('uploads', req.user.id, 'designs');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const assetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('uploads', req.user.id, 'assets');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const assetFileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES_ASSETS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

const assetUpload = multer({
  storage: assetStorage,
  fileFilter: assetFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per file
});

module.exports = { upload, assetUpload };
