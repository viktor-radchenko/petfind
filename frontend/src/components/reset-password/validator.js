const validateForm = (values) => {
  let errors = {};

  // Tag name
  if (!values.password) {
    errors.password = "Password is required";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(values.password)) {
    errors.password =
      "Password should be between 8 and 15 characters, contain at least one uppercase letter, special character and digit";
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = "Password confirmation is required";
  } else if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation =
      "Password and password confirmation do not match. Check your input and try again";
  }

  return errors;
};

export default validateForm;
