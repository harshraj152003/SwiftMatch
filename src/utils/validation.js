const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || validator.isEmpty(firstName.trim())) {
    throw new Error("First name is required.");
  }
  // if (!lastName || validator.isEmpty(lastName.trim())) {
  //     throw new Error("Last name is required.");
  // }
  if (!emailId) {
    throw new Error("Email address is required.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }

  // Validate email format
  if (!validator.isEmail(emailId.trim())) {
    throw new Error("The provided email address is not valid.");
  }

  // Validate password strength (default options)
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }

  // Optional: Validate first name only contains alphabetic characters
  if (!validator.isAlpha(firstName.trim())) {
    throw new Error("First name should only contain alphabetic characters.");
  }

  return true;
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;

  // 1. Check for missing email
  if (!emailId || validator.isEmpty(emailId.trim())) {
    throw new Error("Email address is required.");
  }

  // 2. Check for missing password
  if (!password) {
    throw new Error("Password is required.");
  }

  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Invalid email format.");
  }

  return true;
};

module.exports = { validateSignUpData, validateLoginData };
