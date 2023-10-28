import Link from "next/link";
import { packageImages } from "..";
import Image from "next/image";


const Packages: React.FC = () => {
    return (
        <div className="flex flex-col-reverse md:flex-col gap-24 justify-start p-4 items-center w-full max-w-[1400px]">
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
                                            priority={false}
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
                                <div className="md:hidden block absolute top-14 text-black left-4 bg-white opacity-50 px-2 py-1 rounded tracking-widest">
                                    <span className="text-base">Click to view package</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Packages;