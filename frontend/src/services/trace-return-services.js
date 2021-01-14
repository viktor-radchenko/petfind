import { createAuthProvider } from "react-token-auth";
import axios from 'axios';

export const [useAuth, authFetch, login, logout] = createAuthProvider({
  accessTokenKey: "access_token",
  onUpdateToken: (token) =>
    fetch("/api/auth/refresh", {
      method: "POST",
      body: token.access_token,
    }).then((res) => res.json()),
});

// export const lookUpTagId = async (tagId) => {
//   let tagIdData = await fetch(`/api/tag-id-lookup/${tagId}`);
//   let tagIdJson = await tagIdData.json();
//   return tagIdJson;
// }

export const lookUpTagId = async (tagId) => {
  return await fetch(`/api/tag-id-lookup/${tagId}`)
    .then((res) => res.json(res))
    .then((res) => res);
}

// export async function _lookUpTagId(tagId) {
//   return await fetch(`/api/tag-id-lookup/${tagId}`)
//     .then((res) => res.json())
//     .then((res) => res.message);
    // .then((res) => {
    //   console.log(res);
    //   if (res.message === "Tag ID is valid for registration") {
    //     return 1;
    //   } else {
    //     return 2;
    //   }
    // });
  // try {
  //   console.log(tagId);
  //   const response = await axios.get(`/api/tag-id-lookup/${tagId}`);
  //   return response.data;
  // } catch (e) {
  //   console.log(e);
  // }

  // fetch(`/api/tag-id-lookup/${tagId}`)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.log(res);
  //     if (res.message === "Tag ID is valid for registration") {
  //       return 1;
  //     } else {
  //       return 2;
  //     }
  //   });
// };
