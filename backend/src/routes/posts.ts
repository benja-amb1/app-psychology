import multer from 'multer';
import path from 'path';
import express from 'express';
import {
  addComment,
  addPost,
  deletePost,
  getAllPosts,
  getCommentsByPost,
  getPost,
  toggleLikes,
  updatePost
} from '../controllers/posts';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { checkRole } from '../middlewares/checkRole';

// MULTER config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
    cb(new Error('Only JPEG, JPG, PNG, WEBP or AVIF images are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Routes
const router = express.Router();


router.post('/create-post', upload.single('image'), isAuthenticated, checkRole('admin'), addPost);
router.post('/add-comment/:postId', isAuthenticated, addComment);
router.post('/toggle-like/:postId', isAuthenticated, toggleLikes);


router.get('/get-posts', getAllPosts);
router.get('/get-post/:id', getPost);
router.get('/get-comment/:postId', getCommentsByPost);

router.put('/update-post/:id', upload.single('image'), isAuthenticated, checkRole('admin'), updatePost);
router.delete('/delete-post/:id', isAuthenticated, checkRole('admin'), deletePost);

export default router;
