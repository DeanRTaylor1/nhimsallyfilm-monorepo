import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Image from "next/image";
import { GetStaticProps } from 'next';
import { dynamoDBSingleton } from "../../lib/aws/aws-dynamo.js";
import { GalleryProps } from "../../lib/types/aws-types";
import { useRouter } from "next/router";
import { Strings } from "../../lib/utils/strings";

const MiscGallery: React.FC<GalleryProps> = ({ galleryImages }) => {
  const router = useRouter();



  return (
    <Fragment>
      {/* {!imageLoaded && <Spinner />} */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 justify-items-center items-center p-4 w-full overflow-auto">
        {/* {imageLoaded && */}
        {galleryImages.map((item) => {
          return (
            <div
              key={item.imageId}
              className="relative aspect-[2/3] w-full h-full overflow-hidden group hover:cursor-pointer"
            >
              <Image
                priority={false}
                key={item.imageId}
                fill={true}
                loading="lazy"
                className="hover:cursor-pointer"
                data-imagename={item.key}
                alt="galleryimage"
                src={item.cloudfrontUri!}
              />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 group-focus:opacity-50 flex items-center justify-center transition-opacity duration-300">
                <span className="text-xl font-semibold tracking-widest">
                  {Strings.displayFriendlyString(item.conceptName)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default MiscGallery;


export const getStaticProps: GetStaticProps = async () => {
  const albumId = "misc-album-id";

  try {
    const galleryImages = await dynamoDBSingleton.getInstance().getAlbumById(albumId);

    return {
      props: {
        galleryImages,
      },
      revalidate: 60 * 60 * 24 * 7, // Revalidate once a week
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
