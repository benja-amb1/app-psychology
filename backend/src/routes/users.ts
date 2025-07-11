import express from 'express'
import { createAdmin, createSemiAdmin, createUser, deleteUser, getAllUsers, getSession, getUser, login, logout, updateUser } from '../controllers/users';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { checkRole } from '../middlewares/checkRole';

const router = express.Router();

router.get('/get-user/:id', getUser)
router.get('/get-users', getAllUsers);
router.get('/get-session', isAuthenticated, getSession);

router.post('/create-user', createUser);
router.post('/create-semiadmin', isAuthenticated, checkRole('admin'), createSemiAdmin);
router.post('/create-admin', isAuthenticated, checkRole('admin'), createAdmin);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);

router.put('/update-user/:id', isAuthenticated, updateUser)

router.delete('/delete-user/:id', isAuthenticated, deleteUser);

export default router