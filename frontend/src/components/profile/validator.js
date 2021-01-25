const validateForm = (values) => {
  let errors = {};

  // User Name
  if (!values.firstName) {
    errors.firstName = "First Name is required";
  }

  if (!values.lastName) {
    errors.lastName = "Last Name is required";
  }

  // Phone
  if (!values.phone) {
    errors.phone = "Phone number required";
  } else if (
    !/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/.test(
      values.phone
    )
  ) {
    errors.phone = "Phone number is invalid";
  }

  return errors;
};

export default validateForm;