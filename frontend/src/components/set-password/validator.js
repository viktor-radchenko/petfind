const validateForm = (values) => {
  console.log("Validating following", values);
  let errors = {};

  // Tag name
  if (!values.username) {
    errors.username = "Old password is required";
  }

  if (!values.password) {
    errors.password = "New password is required"
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(values.password)) {
    errors.password = "Password should be between 8 and 15 characters, contain at least one uppercase letter, special character and digit"
  }

  return errors;
};

export default validateForm;
