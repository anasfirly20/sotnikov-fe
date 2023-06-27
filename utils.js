export const getIdInstance = () => {
  const idInstance = localStorage.getItem("idInstance");
  if (!idInstance) return;
  return JSON.parse(idInstance);
};

export const getApiTokenInstance = () => {
  const apiTokenInstance = localStorage.getItem("apiTokenInstance");
  if (!apiTokenInstance) return;
  return JSON.parse(apiTokenInstance);
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
