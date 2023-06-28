import React from "react";

import { Icon } from "@iconify/react";

const ButtonFavorite = ({ onClick, active, className }) => {
  return (
    <button onClick={onClick} active={active}>
      <Icon icon="material-symbols:favorite" className={className} />
    </button>
  );
};

export default ButtonFavorite;
