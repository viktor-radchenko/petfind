const validateForm = (values) => {
  let errors = {};

  // User Name
  if (!values.name) {
    errors.name = "Name is required";
  }

  // Email
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  // Message
  if (!values.message) {
    errors.message = "Message text is required";
  }

  if (!values.recaptcha) {
    console.log("RECAPTHCHAS!@£!@£!@£!");
    errors.recaptcha = "Please confirm you are not a robot";
  }

  return errors;
};

export default validateForm;
