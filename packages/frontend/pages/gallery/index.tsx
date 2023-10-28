import React from "react";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryProps } from "../../lib/types/aws-types";
import { dynamoDBSingleton } from "../../lib/aws/aws-dynamo.js";
import ClickToView from "../../Components/icons/ClickToView";

const Galleries: React.FC<GalleryProps> = ({ galleryImages }) => {
  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 justify-items-center items-center p-4 w-full overflow-auto">
        {galleryImages.map((item) => {
          return (

            <div key={item.imageId} className="relative aspect-[2/3] w-full h-full overflow-hidden group hover:cursor-pointer">

              <Link href={`/gallery/${item.albumId}`}>
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
                <div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 group-focus:opacity-50 flex items-center justify-center transition-opacity duration-300"
                >
                  <span className="text-xl font-semibold tracking-widest">View this album</span>
                </div>
              </Link>
              <ClickToView name="Click to View Album" offsety={4} />
            </div>
          )
        })}
      </div>
    </Fragment>
  );
};

const getStaticProps = async () => {
  const galleryImages = await dynamoDBSingleton.getInstance().getAllCoverImages();


  return {
    props: {
      galleryImages,
    },
    revalidate: 432000,
  };
};

export default Galleries;

export { getStaticProps };
//comment
