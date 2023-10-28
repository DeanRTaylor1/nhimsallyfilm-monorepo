import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dynamoDBSingleton } from "../lib/aws/aws-dynamo";
import { awsImage } from "../lib/types/aws-types";
import ClickToView from "../Components/icons/ClickToView";
import fs from "fs";
import axios from "axios";

export const packageImages = [
  "/personal-package.jpg",
  "/couple-package.jpg",
  "/wedding-package.jpg",
];

interface IndexProps {
  homeImageArr: awsImage[];
}

const Home: React.FC<IndexProps> = ({
  homeImageArr,
}) => {
  const [selectedImages, setSelectedImages] = useState<awsImage[]>([]);
  const [_imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const shuffledImages = homeImageArr.sort(() => Math.random() - 0.5);
    const randomImages = shuffledImages.slice(0, 3);
    setSelectedImages(randomImages);
    setImageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div className="flex flex-col-reverse md:flex-col gap-24 justify-start md:justify-between p-4 items-center w-full max-w-[1400px]">

        <div className="flex flex-col lg:flex-row gap-8  w-full">
          {selectedImages.map((image) => {
            return (
              <div key={image.image_id} className="w-full h-fit overflow-hidden lg:max-w-[calc(100%/3)] relative group">

                <Link href="/gallery">
                  <div className="relative aspect-[2/3] w-full h-full overflow-hidden">

                    <Image
                      src={image.cloudfront_uri!}
                      alt={"Album Cover"}
                      fill={true}
                      loading="lazy"
                      priority={false}
                      className="w-full h-auto object-cover "
                      sizes="100vw"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 group-focus:opacity-50 flex items-center justify-center transition-opacity duration-300"
                  >
                    <span className="text-xl font-semibold tracking-widest">View galleries</span>
                  </div>

                </Link>
                <ClickToView name="Galleries" offsety={4} />
              </div>
            )
          })}
        </div>
        <h2 className="md:hidden flex font-medium text-4xl tracking-widest w-full justify-start">My galleries</h2>
        <div className="w-full flex flex-col gap-8">
          <h2 className="font-medium text-4xl tracking-widest">My packages</h2>
          <div className="flex flex-col lg:flex-row gap-8 overflow-x-hidden w-full">
            {packageImages.map((image, id) => {
              const title = image.split("/")[1].split("-")[0];
              return (
                <div key={id} className="w-full lg:max-w-[calc(100%/3)] relative group">

                  <Link href={`/package/${title}`}>
                    <div className="relative aspect-[2/3] w-full h-full overflow-hidden">
                      <Image
                        src={image}
                        alt={image.split("/")[1]}
                        fill={true}
                        sizes="100vw"
                        loading="eager"
                        priority={true}
                        className="w-full h-auto object-cover "
                      />
                      <div className="absolute top-4 left-4 bg-white opacity-50 px-2 py-1 rounded tracking-widest">
                        <h3 className="text-xl font-semibold">{title}</h3>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 group-focus:opacity-50 flex items-center justify-center transition-opacity duration-300"
                    >
                      <span className="text-xl font-semibold">View package</span>
                    </div>
                  </Link>
                  {/* New label for mobile devices */}
                  <ClickToView name="Click to View Package" offsety={14} />
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </Fragment >
  );
};

const getStaticProps = async () => {
  const response = await axios.get("http://localhost:3000/api/v1/images/banner");

  const { data: coverImages } = response.data;


  return {
    props: {
      homeImageArr: coverImages,
    },
    revalidate: 60 * 60 * 24 * 7,
  };
};

export { getStaticProps };

export default Home;
