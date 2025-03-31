export const validateName = (name) => /^[A-Za-z ]+$/.test(name);

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validateSignupForm = ({ firstName, lastName, emailId, password }) => {
  let errors = {};

  if (!firstName) {
    errors.firstName = "First name is required.";
  } else if (!validateName(firstName)) {
    errors.firstName = "First name should contain only letters.";
  }

  if (!lastName) {
    errors.lastName = "Last name is required.";
  } else if (!validateName(lastName)) {
    errors.lastName = "Last name should contain only letters.";
  }

  if (!emailId) {
    errors.emailId = "Email is required.";
  } else if (!validateEmail(emailId)) {
    errors.emailId = "Invalid email format.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!validatePassword(password)) {
    errors.password = "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
  }

  return errors;
};
