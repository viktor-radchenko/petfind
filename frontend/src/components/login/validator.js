import { validateUserForm } from "../register-tag-form/validator";

const validateTagForm = (values) => {
  console.log("Validating following", values);
  let errors = {};

  // Tag ID
  if (!values.tagId) {
    errors.tagId = "Tag ID is required";
  }

  // Tag name
  if (!values.tagName) {
    errors.tagName = "Tag Name is required";
  }

  return errors;
}


const validateForm = (values) => {
  console.log("Validating following", values);
  let errors = {};

  // Email
  if (!values.email) {
    errors.email = "Email required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  // Password
  if (!values.newPassword) {
    errors.newPassword = "Password is required"
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(values.newPassword)) {
    errors.newPassword = "Password should be between 8 and 15 characters, contain at least one uppercase letter, special character and digit"
  }

  return errors;
};

export default validateForm;
