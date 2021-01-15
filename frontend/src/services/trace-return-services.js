import { createAuthProvider } from "react-token-auth";

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
