export const getPostAmount = () => {
  const postAmount = localStorage.getItem("amountOfPost");
  if (!postAmount) return;
  return JSON.parse(postAmount);
};

export const getFavorites = (postId) => {
  const favorite = localStorage.getItem(`post-${postId}`);
  if (!favorite) return;
  return JSON.parse(favorite);
};

export const getTelephone = () => {
  const telephone = localStorage.getItem("telephone");
  if (!telephone) return;
  return telephone;
};

export function getRole() {
  const role = localStorage.getItem("role");
  if (!role) return;
  return role;
}

export const LoadToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const LoadToBottom = () => {
  window.scrollTo({
    bottom: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
