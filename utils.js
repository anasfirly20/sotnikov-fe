// GET POSTS FROM LOCAL STORAGE
export const getPostAmount = () => {
  const postAmount = localStorage.getItem("displayedPost");
  if (!postAmount) return;
  return JSON.parse(postAmount);
};

export const getFavorites = (postId) => {
  const favorite = localStorage.getItem(`post-${postId}`);
  if (!favorite) return;
  return JSON.parse(favorite);
};

// GET ALBUMS FROM LOCAL STORAGE
export const getAlbumDisplayed = () => {
  const albumDisplayed = localStorage.getItem("displayedAlbum");
  if (!albumDisplayed) return;
  return JSON.parse(albumDisplayed);
};

// GET ALBUMS FROM LOCAL STORAGE
export const getTasksDisplayed = () => {
  const taskDisplayed = localStorage.getItem("displayedTask");
  if (!taskDisplayed) return;
  return JSON.parse(taskDisplayed);
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
