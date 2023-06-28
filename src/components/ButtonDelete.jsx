import React from "react";

import { Icon } from "@iconify/react";

const ButtonDelete = ({ onClick, active, className }) => {
  return (
    <button onClick={onClick} active={active}>
      <Icon icon="material-symbols:delete" className={className} />
    </button>
  );
};

export default ButtonDelete;
