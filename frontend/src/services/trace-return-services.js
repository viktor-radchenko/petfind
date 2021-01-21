import { createAuthProvider } from "react-token-auth";

const _geolocationDbKey = process.env.GEOLOCATION_DB_KEY || "";

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

export const fetchLocation = async () => {
  return await fetch(`http://ip-api.com/json/`).then((res) => res.json());
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
  formData.append("tag_id", tagId.toUpperCase())
  formData.append("ip_address", location.query)
  formData.append("zip_code", location.postal)
  formData.append("lat", location.lat)
  formData.append("lon", location.lon)
  formData.append("city", location.city)

  return await fetch(`/api/send_private_message`, {
    method: "post",
    body: formData,
  }).then(res => res.json());
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
  formData.append("state", options.tagState);
  formData.append("status", options.tagStatus);
  formData.append("is_private", options.isPrivate);

  return await authFetch(`/api/registered_tag/modify/${tagId}`, {
    method: "POST",
    body: formData,
  });
};

export const addRegisteredTag = async (options) => {
  console.log("Preparing state to add new tag", options);
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
