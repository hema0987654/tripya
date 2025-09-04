import User from '../models/authModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import generateToken from '../utils/genrateToken.js';
import sendEmail from '../utils/EmailSender.js';
import bcrypt from 'bcryptjs';

class AuthService {
  async signup(name, email, imageURL, phone,imagePublicId, password,birthDay) {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler("User already exists", 409);
    }

    
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

 
    const user = await User.create({
      name,
      email,
      image: imageURL,
      imagePublicId,
      phone,
      password,
      activationCode,
      birthDay
    });

    
    
    
    await sendEmail({
      to: user.email,
      subject: "Welcome to Tripya - Activate Your Account 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 10px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333; text-align: center; font-size: 24px;">Welcome to <span style="color:#4CAF50;">Tripya</span>, ${name} 🎉</h2>
          <p style="color: #555; font-size: 16px; text-align: center;">
            We're excited to have you on board! Use the following code to activate your account:
          </p>
          <div style="background: #4CAF50; color: white; font-size: 22px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; letter-spacing: 3px;">
            ${activationCode}
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 20px; text-align: center;">
            If you didn’t sign up for Tripya, please ignore this email.
          </p>
        </div>
      `,
    });

    
    return {
      user,
      activationCode,
     
    };
  }

  async activeAccount(email,code){
    const user=await User.findOne({email});
    if(!user)
    {
      throw new ErrorHandler("user not found",404);
    }
    if(user.isActive)
    {
      throw new ErrorHandler("user alread active",400);
    }
    if(user.activationCode===code)
    {
      user.isActive=true;
    }
    user.activationCode=null;
    const token=await generateToken({userId:user._id,email:user.email});
  await user.save();  
return {
  user, token
}
  }
  async login(email,password){
    const user=await  User.findOne({email});
    if(!user)
    {
      throw new ErrorHandler("Invalid email or password",404);

    }
    const IsCompare=await bcrypt.compare(password,user.password);
    if(!IsCompare)
    {  throw new ErrorHandler("Invalid email or password",404);
    
    }
    const token=await generateToken({userId:user._id});
    user.token=token;
    await user.save();
    return{
      token
    }
    

  }
async sendForgetPasswordCode(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const now = Date.now();

  if (user.resetPasswordToken && user.resetPasswordExpires > now) {
    await sendEmail({
      to: user.email,
      subject: "Tripya - Password Reset Request 🔑",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 10px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333; text-align: center; font-size: 24px;">Reset Your Password 🔑</h2>
          <p style="color: #555; font-size: 16px; text-align: center;">
            Hello ${user.name}, your reset code is still valid.  
            Use the code below to reset your password. It will expire at <strong>${new Date(user.resetPasswordExpires).toLocaleTimeString()}</strong>.
          </p>
          <div style="background: #e91e63; color: white; font-size: 22px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; letter-spacing: 3px;">
            ${user.resetPasswordToken}
          </div>
        </div>
      `,
    });

    return {
      message: "Existing reset code re-sent. Please check your inbox.",
    };
  }

  const ForgetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordToken = ForgetPasswordCode;
  user.resetPasswordExpires = now + 15 * 60 * 1000; 
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Tripya - Password Reset Request 🔑",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 10px; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333; text-align: center; font-size: 24px;">Reset Your Password 🔑</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">
          Hello ${user.name}, we received a request to reset your password.  
          Use the code below to reset it. This code will expire in <strong>15 minutes</strong>.
        </p>
        <div style="background: #e91e63; color: white; font-size: 22px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; letter-spacing: 3px;">
          ${ForgetPasswordCode}
        </div>
      </div>
    `,
  });

  return {
    message: "A new password reset code was sent to your email",
  };
}
async resetPassword(email,code){
  
}


}

export default new AuthService();
