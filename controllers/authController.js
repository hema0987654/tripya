import authService from '../services/authService.js';
import bcrypt from 'bcryptjs';

class authController {
  async signup(req, res, next) {
    try {
      const { name, password, email, phone,birthDay } = req.body;
      let imageURL = null;
      let imagePublicId = null;

      if (req.file) {
        imageURL = req.file.path;
        imagePublicId = req.file.filename;
      }

      await authService.signup(name, email, imageURL, phone, imagePublicId, password,birthDay);

      res.status(201).json({
        success: true,
        message: "Signup successful! Please check your email for the activation code.",
      });
    } catch (err) {
      next(err);
    }
  }

  async activateAccount(req, res, next) {
    try {
      const { email, code } = req.body;
      const user = await authService.activeAccount(email, code);

      res.status(200).json({
        message: "Activation success",
        token: user.token,
      });
    } catch (err) {
      next(err); 
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      res.status(200).json({
        message: "Login success",
        token: user.token,
      });
    } catch (err) {
      next(err);
    }
  }

  async sendForgetPasswordCode(req, res, next) {
    try {
      const { email } = req.body;
      await authService.sendForgetPasswordCode(email);

      res.status(200).json({
        message: "Check your inbox for the password reset code",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new authController();
