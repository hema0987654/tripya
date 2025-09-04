import express from 'express';
const router=express.Router();
import uploadUser from '../middleware/uploadImage.js';
import authController from '../controllers/authController.js';

router.post('/register',uploadUser.single("image"),(req,res,next)=>{
    authController.signup(req,res,next);
});
router.post('/activeAccount',uploadUser.none(),(req,res,next)=>{
    authController.activateAccount(req,res,next);
});
router.post('/login',uploadUser.none(),(req,res,next)=>{
    authController.login(req,res,next);
});
router.post('/sendForgetPasswordCode',uploadUser.none(),(req,res,next)=>{
    authController.sendForgetPasswordCode(req,res,next);
})
export default router;