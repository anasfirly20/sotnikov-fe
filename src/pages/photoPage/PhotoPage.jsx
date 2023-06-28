import React, { useEffect, useState, Fragment, useRef } from "react";

// Api
import userApi from "../postPage/api/user.api";
import albumApi from "./api/album.api";

// Miscellaneous
import { Icon } from "@iconify/react";
import imageNy from "../../assets/ny-photo.avif";

// Constants
import { menuItems } from "../postPage/constants";

// Utils
import { getAlbumDisplayed, capitalizeFirstLetter } from "../../../utils";

// Components
import CustomSelect from "../../components/CustomSelect";

const PhotoPage = () => {
  const [selected, setSelected] = useState();
  const [isChecked, setIsChecked] = useState({});

  const albumAmountSelected = getAlbumDisplayed();
  const [selectedAlbumAmount, setSelectedAlbumAmount] = useState(
    albumAmountSelected || 10
  );

  const handleSelectChange = (e) => {
    setSelectedAlbumAmount(e.target.value);
    localStorage.setItem("displayedAlbum", e.target.value);
  };

  // GET All albums
  const [data, setData] = useState([]);

  const getAllAlbums = async () => {
    try {
      const responseAlbum = await albumApi.getAllAlbum();
      const responseUser = await userApi.getAllUser();
      const albums = responseAlbum?.data;
      const users = responseUser?.data;
      const albumData = albums?.map((album) => {
        const user = users?.find((u) => u?.id === album?.userId);
        const storageKey = `album-${album?.id}`;
        const storedAlbum = JSON.parse(localStorage.getItem(storageKey)) || {};
        return { ...album, user, isFavorite: storedAlbum.isFavorite || false };
      });
      setData(albumData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAlbums();
  }, []);

  // TOGGLE MENU
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FAVORITES
  const handleClickFavorite = (albumId) => {
    const updatedData = data?.map((album) => {
      if (album?.id === albumId) {
        const updatedAlbum = { ...album, isFavorite: !album?.isFavorite };
        localStorage.setItem(`album-${albumId}`, JSON.stringify(updatedAlbum));
        return updatedAlbum;
      }
      return album;
    });
    setData(updatedData);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Album displayed:"
        value={selectedAlbumAmount}
        onChange={handleSelectChange}
        // deletedAmount={deletedPostAmount}
      />
      <div className={`mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-5`}>
        {data?.slice(0, selectedAlbumAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`relative flex flex-col gap-y-2 text-custom-black shadow-lg animate300 bg-transparent rounded-t-xl hover:shadow-[2px_2px_16px_gray]
            ${dataInfo?.isFavorite && " shadow-[2px_2px_16px_gray]"}
            `}
          >
            <img
              src={imageNy}
              alt="New York Image"
              className="bg-cover w-full h-full rounded-t-xl -z-10 aspect-square"
            />
            {dataInfo?.isFavorite && (
              <Icon
                icon="material-symbols:favorite"
                className="absolute text-red-500 text-3xl cursor-pointer z-10 right-5 top-5 hover:scale-150 animate500 active:scale-0"
                onClick={() => {
                  setSelected(dataInfo?.id);
                  handleClickFavorite(dataInfo?.id);
                }}
              />
            )}
            <div className="p-shorter4">
              <div className="flex justify-between">
                <h3 className="pBigger">
                  {capitalizeFirstLetter(dataInfo?.title)}
                </h3>
                <div className="relative">
                  <Icon
                    icon="ri:more-fill"
                    className="text-4xl rounded-full border border-black p-1 hover:cursor-pointer hover:opacity-50"
                    onClick={() => {
                      if (selected === i) {
                        setIsMenuOpen(!isMenuOpen);
                      } else {
                        setSelected(i);
                        setIsMenuOpen(true);
                      }
                    }}
                  />
                  {selected === i && isMenuOpen && (
                    <div className="absolute flex flex-col bg-custom-black/50 top-[100%] left-[50%] translate-x-[-50%] translate-y-[2%] divide-y-2 divide-custom-cream rounded-b-xl z-30">
                      {menuItems.map((e) => (
                        <div
                          className="flex text-custom-cream items-center cursor-pointer gap-3 px-4 py-2 group"
                          onClick={() => {
                            if (e?.name === "Favorite") {
                              handleClickFavorite(dataInfo?.id);
                            }
                          }}
                        >
                          <Icon
                            icon={e.icon}
                            className="group-hover:opacity-70 text-lg"
                          />
                          <p className="pSmaller group-hover:opacity-70">
                            {e.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 pSmaller cursor-pointer">
                By {capitalizeFirstLetter(dataInfo?.user?.name)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoPage;
