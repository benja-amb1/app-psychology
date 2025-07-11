import multer from 'multer'
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/png'];
    const mimetype = allowedTypes.includes(file.mimetype);
    const extname = /\.(jpeg|jpg|webp|avif|png)$/i.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, WEBP o AVIF images.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// router.post('/upload', upload.single('imagen')


