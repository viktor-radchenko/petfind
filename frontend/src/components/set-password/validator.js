const validateForm = (values) => {
  console.log('Values', values);
  let errors = {};

  // Tag name
  if (!values.oldPassword) {
    errors.oldPassword = "Old password is required";
  }

  if (!values.newPassword) {
    errors.newPassword = "New password is required"
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(values.newPassword)) {
    errors.newPassword = "Password should be between 8 and 15 characters, contain at least one uppercase letter, special character and digit"
  }

  console.log("Errors", errors);
  return errors;
};

export default validateForm;
