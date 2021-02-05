import { createAuthProvider } from "react-token-auth";

// const _geolocationDbKey = process.env.GEOLOCATION_DB_KEY || "";

export const [useAuth, authFetch, login, logout] = createAuthProvider({
  accessTokenKey: "access_token",
  onUpdateToken: (token) =>
    fetch("/api/auth/refresh", {
      method: "POST",
      body: token.access_token,
    }).then((res) => res.json()),
});

export const completeRegistration = async (
  tagId,
  tagName,
  tagImage,
  firstName,
  lastName,
  phone,
  email,
  address,
  city,
  country,
  zipCode,
  userState
) => {
  const formData = new FormData();
  formData.append("tagId", tagId.toUpperCase());
  formData.append("tagName", tagName);
  formData.append("tagImage", tagImage);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("address", address);
  formData.append("city", city);
  formData.append("country", country);
  formData.append("zipCode", zipCode);
  formData.append("userState", userState);

  return await fetch(`/api/auth/register`, {
    method: "POST",
    body: formData,
  });
};

export const resendConfirmationEmail = async (email) => {
  return await fetch("/api/auth/resend_registration_email", {
    method: "POST",
    body: JSON.stringify(email),
  });
};

export const fetchLocation = async () => {
  return await fetch(`https://freegeoip.app/json`).then((res) => res.json());
  // return await fetch(`https://geolocation-db.com/json/${_geolocationDbKey}`).then((res) => res.json());
};

export const lookUpTagId = async (tagId, location) => {
  return await fetch(`/api/registered_tag/${tagId}`, {
    method: "post",
    body: JSON.stringify(location),
  }).then((res) => res.json());
};

export const sendPrivateMessage = async (contactName, phone, text, tagId, location) => {
  const formData = new FormData();
  formData.append("name", contactName);
  formData.append("phone_number", phone);
  formData.append("text", text);
  formData.append("tag_id", tagId.toUpperCase());
  formData.append("ip_address", location.query);
  formData.append("zip_code", location.postal);
  formData.append("lat", location.lat);
  formData.append("lon", location.lon);
  formData.append("city", location.city);

  return await fetch(`/api/send_private_message`, {
    method: "post",
    body: formData,
  }).then((res) => res.json());
};

export const updateRegisteredTag = async (tagId, options) => {
  const formData = new FormData();
  formData.append("tag_name", options.tagName);
  formData.append("tag_image", options.tagImage);
  formData.append("phone", options.phone);
  formData.append("email", options.email);
  formData.append("address", options.address);
  formData.append("city", options.city);
  formData.append("country", options.country);
  formData.append("zip_code", options.zipCode);
  formData.append("state", options.userState);
  formData.append("status", options.tagStatus);
  formData.append("is_private", options.isPrivate);

  return await authFetch(`/api/registered_tag/modify/${tagId}`, {
    method: "POST",
    body: formData,
  });
};

export const addRegisteredTag = async (options) => {
  const formData = new FormData();
  formData.append("tag_id", options.tagId.toUpperCase());
  formData.append("tag_name", options.tagName);
  formData.append("tag_image", options.tagImage);
  formData.append("phone", options.phone);
  formData.append("email", options.email);
  formData.append("address", options.address);
  formData.append("city", options.city);
  formData.append("country", options.country);
  formData.append("zip_code", options.zipCode);
  formData.append("state", options.userState);
  formData.append("status", options.tagStatus);

  return await authFetch(`/api/registered_tag/add_new`, {
    method: "POST",
    body: formData,
  });
};

export const deleteRegisteredTag = async (tagId) => {
  return await authFetch(`/api/registered_tag/delete/${tagId}`, {
    method: "DELETE",
  });
};

export const getUserData = async () => {
  return await authFetch(`/api/auth/get_user_data`);
};

export const requestPasswordReset = async (email) => {
  const formData = new FormData();
  formData.append("email", email);

  return await fetch("/api/auth/forgot_password", {
    method: "POST",
    body: formData,
  });
};

export const resetPassword = async (password, passwordConfirmation, token) => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirmation);

  return await fetch("/api/auth/verify_reset", {
    method: "POST",
    body: formData,
  });
};

export const updateProfile = async (data) => {
  const formData = new FormData();
  formData.append("first_name", data.firstName);
  formData.append("last_name", data.lastName);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("country", data.country);
  formData.append("zip_code", data.zipCode);
  formData.append("state", data.userState);
  formData.append("old_password", data.oldPassword);
  formData.append("new_password", data.newPassword);

  return await authFetch("/api/auth/update_profile", {
    method: "POST",
    body: formData,
  });
};
