export const validateLoginForm = (formData) => {
    const errors = {};
  
    // Email validation
    if (!formData.emailId.trim()) {
      errors.emailId = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      errors.emailId = "Invalid email format.";
    }
  
    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase, one lowercase, one number, and one special character.";
    }
  
    return errors;
  };
  