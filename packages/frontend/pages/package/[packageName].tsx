
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { dynamoDBSingleton } from "../../lib/aws/aws-dynamo.js";
import { GalleryProps } from "../../lib/types/aws-types";
import { Strings } from "../../lib/utils/strings";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import Link from "next/link";
import ClickToView from "../../Components/icons/ClickToView";

interface PackageGalleryProps extends GalleryProps {
    concepts: string[];
    packageName: string;
}



const PackageGallery: React.FC<PackageGalleryProps> = ({ galleryImages, concepts, packageName }) => {

    const images = [
        true && `/package/${packageName.toLowerCase()}_1.jpg`,
        true && `/package/${packageName.toLowerCase()}_2.jpg`,
        (packageName.toLowerCase() === "personal") && `/package/${packageName.toLowerCase()}_3.jpg`
    ].filter(Boolean) as string[]

    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePrevClick = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextClick = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    return (
        <Fragment>
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                <h2 className="flex  font-medium text-4xl tracking-widest w-full justify-center">GOI CHUP &quot;{packageName.toUpperCase()}&quot;</h2>
                <div className={`pb-8 justify-center  grid grid-cols-1   grid-flow-row gap-4 justify-items-center items-center p-4 w-full overflow-auto ${packageName.toLowerCase() === "personal" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>

                    <div className="lg:hidden relative aspect-[2/3] w-full h-full overflow-hidden group hover:cursor-pointer">
                        <Image
                            src={images[currentSlide]}
                            alt={packageName}
                            loading="eager"
                            priority={true}
                            fill={true}
                        />
                        <button
                            onClick={handlePrevClick}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent hover:scale-125 text-gray-200 font-medium text-3xl py-2 px-4 rounded"
                        >
                            &#x276E;
                        </button>
                        <button
                            onClick={handleNextClick}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent hover:scale-125 text-gray-200 text-3xl font-medium py-2 px-4 rounded"
                        >
                            &#x276F;
                        </button>
                    </div>
                    {images.map((image) => {
                        return (
                            <div key={image} className="hidden lg:flex relative aspect-[2/3] w-full h-full overflow-hidden group hover:cursor-pointer">
                                <Image
                                    src={image}
                                    alt={packageName}
                                    loading="eager"
                                    priority={true}
                                    fill={true}

                                />
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            {
                concepts.map((concept, index) => {
                    return (
                        <Fragment key={index}>
                            <h2 className="flex font-medium text-4xl tracking-widest w-full justify-center sticky top-[-4px] bg-white z-10 ">
                                Concept: &quot;{Strings.displayFriendlyString(concept)}&quot;
                            </h2>
                            <div className="grid grid-cols-4 lg:grid-cols-7  grid-flow-row gap-4 justify-items-center items-center p-4 w-full overflow-auto">
                                {galleryImages
                                    .filter((item) => {
                                        return item.conceptName === concept
                                    }
                                    )
                                    .map((item) => {
                                        return (
                                            <div key={item.imageId} className="relative aspect-[2/3] w-full h-full overflow-hidden group hover:cursor-pointer">
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

                                                <Link href={`/gallery/${item.albumId}`}>
                                                    <div
                                                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 group-focus:opacity-50 flex items-center justify-center transition-opacity duration-300"
                                                    >
                                                        <span className="text-xl font-semibold tracking-widest">{Strings.displayFriendlyString(item.conceptName)}</span>
                                                    </div>
                                                </Link>
                                                {/* <ClickToView name={`${Strings.displayFriendlyString(item.conceptName)} concept`} offsety={4} /> */}

                                            </div>
                                        )
                                    })}

                            </div>
                        </Fragment>
                    )
                })
            }


        </Fragment >
    );
};

export default PackageGallery;
export const getServerSideProps: GetServerSideProps = async (context) => {
    const packageName = context.params!.packageName;
    try {
        const galleryImages = await dynamoDBSingleton.getInstance().getMiscPhotosByPackage("misc-album-id", Strings.capitalizeFirstLetter(packageName as string));
        const concepts = galleryImages.reduce<string[]>((uniqueConcepts, item) => {
            if (!uniqueConcepts.includes(item.conceptName)) {
                uniqueConcepts.push(item.conceptName);
            }
            return uniqueConcepts;
        }, []);

        // console.log(concepts)

        return {
            props: {
                galleryImages,
                concepts,
                packageName
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};
