const validateForm = (values) => {
  let errors = {};

  // Email
  if (!values.email) {
    errors.email = "Email required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  return errors;
};

export default validateForm;
