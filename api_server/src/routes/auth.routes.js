import express from 'express';
import multer from 'multer';

import { register, login, logout, getProfile, changePassword, changeAvatar, registerRequest, registerVerify, subscribeChannel, unsubscribeChannel, getNotifications } from '../controller/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, 
  storage: multer.memoryStorage()
});

router.post('/register', register);
router.post('/register-request', registerRequest);
router.post('/register-verify', registerVerify);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isAuthenticated, getProfile);
router.post('/change-password', isAuthenticated, changePassword);
router.post('/change-avatar', isAuthenticated, upload.single('avatar'), changeAvatar);
router.post('/subscribe/:channelId', isAuthenticated, subscribeChannel);
router.post('/unsubscribe/:channelId', isAuthenticated, unsubscribeChannel);
router.get('/notifications', isAuthenticated, getNotifications);

export default router;
