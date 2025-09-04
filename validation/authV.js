

class validatin{
   emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;  

   validateEmail(email) {
    const trimmed = email?.trim();
    if (!trimmed) return { success: false, message: "Email is required" };
    if (!this.emailRegex.test(trimmed))
      return { success: false, message: "Email format is invalid" };
    return { success: true };
  }

    validatePassword(password) {
    if (!password) return { success: false, message: "Password is required" };
    if (password.length < 8)
      return { success: false, message: "Password too short" };
    if (password.length > 20)
      return { success: false, message: "Password too long" };
    if (!this.passwordRegex.test(password))
      return {
        success: false,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      };
    return { success: true };
  }

  validateName(name) {
    const trimmed = name?.trim();
    if (!trimmed) return { success: false, message: "Name is required" };
    if (trimmed.length > 50)
      return { success: false, message: "Name too long" };
    return { success: true };
  }

  validatin(name,email,password){
    const nameValidation = this.validateName(name);
    if (!nameValidation.success) return nameValidation;
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.success) return emailValidation;
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.success) return passwordValidation;
    return { success: true, message: "Validation passed"}
  }
}

export default new validatin();