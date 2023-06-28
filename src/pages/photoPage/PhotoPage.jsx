import React, { useState, useEffect, Fragment } from "react";

// Miscellaneous
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";

// Api
import albumApi from "../albumPage/api/album.api";

// Utils
import { capitalizeFirstLetter } from "../../../utils";

const PhotoPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  // Get photos by albumId
  const getPhotosByAlbumId = async (id) => {
    try {
      const res = await albumApi.getPhotosByAlbumId(id);
      setData(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPhotosByAlbumId(id);
  }, []);

  // Toggle modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({});

  // Get photos by Id
  const getPhotoById = async (id) => {
    try {
      const res = await albumApi.getPhotoById(id);
      setSelectedPhoto(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="px-longer py-shorter2">
      <h2>Photos from album {id}</h2>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {data?.map((photo, i) => (
          <div
            key={i}
            className={`relative flex flex-col gap-y-2 text-custom-cream shadow-lg animate300 bg-gray-900 rounded-t-xl hover:shadow-[2px_2px_16px_gray] overflow-hidden cursor-pointer`}
            onClick={() => {
              setIsOpen(!isOpen);
              getPhotoById(photo?.id);
            }}
          >
            <img
              src={photo?.thumbnailUrl}
              alt={photo?.title}
              className="object-cover aspect-square"
            />
            <p className="pSmaller p-shorter4">
              {capitalizeFirstLetter(photo?.title)}
            </p>
          </div>
        ))}
      </div>
      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => setIsOpen(false)}
          className="fixed bg-black/90 max-lg:top-[50%] max-lg:left-[50%] max-lg:-translate-x-[50%] max-lg:-translate-y-[50%] lg:inset-20 lg:inset-x-80 z-20 text-white rounded-xl"
        >
          <Icon
            icon="zondicons:close-solid"
            color="darkred"
            className="absolute bg-white text-black rounded-full -right-5 -top-5 text-5xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
          <Dialog.Panel className="w-full h-full flex flex-col items-center gap-5 p-normal">
            <Dialog.Description className="w-[15rem] md:w-[30rem]">
              <img
                src={selectedPhoto?.thumbnailUrl}
                alt={selectedPhoto?.title}
                className="object-cover w-full h-full rounded-xl"
              />
            </Dialog.Description>
            <Dialog.Title className="pBigger2">
              {(selectedPhoto?.title &&
                capitalizeFirstLetter(selectedPhoto?.title)) ||
                ""}
            </Dialog.Title>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </section>
  );
};

export default PhotoPage;
