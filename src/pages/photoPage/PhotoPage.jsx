import React, { useEffect, useState, Fragment } from "react";

// Components
import CustomSelect from "../../components/CustomSelect";

// Constants

// Utils
import { getAlbumDisplayed } from "../../../utils";

const PhotoPage = () => {
  const albumAmountSelected = getAlbumDisplayed();
  const [selectedAlbumAmount, setSelectedAlbumAmount] = useState(
    albumAmountSelected || 10
  );

  const handleSelectChange = (e) => {
    setSelectedAlbumAmount(e.target.value);
    localStorage.setItem("displayedAlbum", e.target.value);
  };

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Album displayed:"
        value={selectedAlbumAmount}
        onChange={handleSelectChange}
        // deletedAmount={deletedPostAmount}
      />
    </section>
  );
};

export default PhotoPage;
