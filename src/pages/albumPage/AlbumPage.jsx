import React, { useEffect, useState, Fragment, useRef } from "react";

// Api
import userApi from "../postPage/api/user.api";
import albumApi from "./api/album.api";

// Miscellaneous
import { Icon } from "@iconify/react";
import imageNy from "../../assets/ny-photo.avif";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Constants
import { menuItems } from "../postPage/constants";

// Utils
import { getAlbumDisplayed, capitalizeFirstLetter } from "../../../utils";

// Components
import CustomSelect from "../../components/CustomSelect";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";
import ModalAdd from "../../components/ModalAdd";

const AlbumPage = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState();

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
  };

  // DELETE
  const [albumIdToDelete, setAlbumIdToDelete] = useState(null);
  const [deleteModalConfirmation, setDeleteModalConfirmation] = useState(false);
  const [deleteAlbumAmount, setDeleteAlbumAmount] = useState(0);

  const handleDeleteAlbum = (albumId) => {
    setAlbumIdToDelete(albumId);
    setDeleteModalConfirmation(true);
  };

  const confirmDeleteAlbum = async () => {
    try {
      await albumApi.deleteAlbumById(albumIdToDelete);
      const updatedData = data?.filter(
        (album) => album?.id !== albumIdToDelete
      );
      setData(updatedData);
      setSelectedAlbumAmount((prev) => prev - 1);
      setDeleteAlbumAmount((prev) => prev + 1);
      setIsEdit(false);
    } catch (err) {
      console.log(err);
    }
    setAlbumIdToDelete(null);
    setDeleteModalConfirmation(false);
  };

  const cancelDeleteAlbum = () => {
    setDeleteModalConfirmation(false);
  };

  // EDIT ALBUMS
  const [isEdit, setIsEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  const handleChangeEditPost = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setDataEdit({ ...dataEdit, user: { ...dataEdit?.user, [name]: value } });
    } else {
      setDataEdit({ ...dataEdit, [name]: value });
    }
  };

  const editAlbum = async (id, body) => {
    try {
      if (dataEdit) {
        const res = await albumApi.editAlbumById(id, body);
        const updatedData = data?.map((album) =>
          album?.id === id ? { ...album, ...res?.data } : album
        );
        setData(updatedData);
        setIsEdit(!isEdit);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickEdit = (albumId) => {
    if (selected === albumId) {
      const updatedAlbum = [...data];
      setDataEdit(updatedAlbum[albumId]);
      setIsEdit(!isEdit);
    } else {
      setSelected(albumId);
      setIsEdit(!isEdit);
    }
  };

  // ADD NEW ALBUM
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState({
    userId: 1,
    title: "",
    user: {
      name: "TESTER",
    },
  });

  const cancelAddAlbum = () => {
    setIsOpenAddModal(false);
  };

  const addNewAlbum = async () => {
    try {
      if (newAlbumTitle?.title) {
        const res = await albumApi.addNewAlbum(newAlbumTitle);
        const updateData = [res?.data, ...data];
        setData(updateData);
      } else {
        toast.error("Cannot leave the field blank");
      }
    } catch (err) {
      console.log(err);
    }
    setIsOpenAddModal(false);
    setNewAlbumTitle({
      title: "",
    });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewAlbumTitle({ ...newAlbumTitle, [name]: value });
  };

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Album displayed:"
        value={selectedAlbumAmount}
        onChange={handleSelectChange}
        deletedAmount={deleteAlbumAmount}
        labelButton="Add Album"
        onClick={() => {
          setIsOpenAddModal(true);
        }}
      />
      <div className={`mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-5`}>
        <CustomModal
          cancelDeletePost={cancelDeleteAlbum}
          confirmDeletePost={confirmDeleteAlbum}
          show={deleteModalConfirmation}
          post={selected ? data.find((album) => album.id === selected) : null}
        />
        <ModalAdd
          cancelAdd={cancelAddAlbum}
          q
          confirmAdd={addNewAlbum}
          show={isOpenAddModal}
          handleChange={handleAddChange}
          name="title"
          value={newAlbumTitle?.title}
        />
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
                  handleClickFavorite(dataInfo?.id);
                }}
              />
            )}
            <div className="p-shorter4">
              <div className="flex justify-between">
                {selected === i && isEdit ? (
                  <CustomInput
                    name="title"
                    value={dataEdit?.title}
                    onChange={handleChangeEditPost}
                  />
                ) : (
                  <h3
                    className="pBigger cursor-pointer hover:opacity-50 active:opacity-100"
                    onClick={() => {
                      navigate(`/album/${dataInfo?.id}`);
                    }}
                  >
                    {(dataInfo?.title &&
                      capitalizeFirstLetter(dataInfo?.title)) ||
                      ""}
                  </h3>
                )}
                <div className="relative">
                  {/* MORE BUTTON START */}
                  {selected === i && isEdit ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-custom-blue-1 text-white font-medium rounded-lg hover:bg-custom-blue-2 active:bg-custom-blue-1"
                        onClick={() => {
                          editAlbum(dataInfo?.id, dataEdit);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="px-3 py-1 bg-transparent text-black border font-medium border-black rounded-lg hover:opacity-60 active:bg-custom-blue-1"
                        onClick={() => setIsEdit(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Icon
                      icon="ri:more-fill"
                      className="text-4xl rounded-full border border-black p-1 hover:cursor-pointer hover:opacity-50"
                      onClick={() => {
                        if (selected === i) {
                          setIsMenuOpen(!isMenuOpen);
                        } else {
                          setIsMenuOpen(true);
                          setSelected(i);
                        }
                      }}
                    />
                  )}
                  {/* MORE BUTTON END */}
                  {selected === i && isMenuOpen && (
                    <div className="absolute flex flex-col bg-custom-black/50 top-[100%] left-[50%] translate-x-[-50%] translate-y-[2%] divide-y-2 divide-custom-cream rounded-b-xl z-30">
                      {menuItems.map((e) => (
                        <div
                          className="flex text-custom-cream items-center cursor-pointer gap-3 px-4 py-2 group"
                          onClick={() => {
                            if (e?.name === "Favorite") {
                              handleClickFavorite(dataInfo?.id);
                              setIsMenuOpen(!isMenuOpen);
                            } else if (e?.name === "Delete") {
                              handleDeleteAlbum(dataInfo?.id);
                              setIsMenuOpen(!isMenuOpen);
                            } else if (e?.name === "Edit") {
                              if (selected === i) {
                                handleClickEdit(i);
                                setIsMenuOpen(false);
                              } else {
                                setIsMenuOpen(false);
                              }
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
              {selected === i && isEdit ? (
                <CustomInput
                  name="name"
                  value={dataEdit?.user?.name}
                  onChange={handleChangeEditPost}
                  className="w-fit"
                />
              ) : (
                <p className="text-gray-600 pSmaller">
                  By{" "}
                  {(dataInfo?.user?.name &&
                    capitalizeFirstLetter(dataInfo?.user?.name)) ||
                    ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlbumPage;
