import React, { useState, useEffect } from "react";

// Miscellaneous
import { useParams } from "react-router-dom";

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
      console.log("RES>>>", res?.data);
      setData(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPhotosByAlbumId(id);
  }, []);

  return (
    <section className="px-longer py-shorter2">
      <h2>Photos from album {id}</h2>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {data?.map((photo, i) => (
          <div
            key={i}
            className={`relative flex flex-col gap-y-2 text-custom-cream shadow-lg animate300 bg-gray-900 rounded-t-xl hover:shadow-[2px_2px_16px_gray] overflow-hidden cursor-pointer`}
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
    </section>
  );
};

export default PhotoPage;
