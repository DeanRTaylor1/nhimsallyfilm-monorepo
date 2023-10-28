
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { awsImage } from "../../../lib/types/aws-types";
import { Strings } from "../../../lib/utils/strings";
import Link from "next/link";

export interface AdminGalleryCardProps {
    image: awsImage;
    getImages: () => void;
    setLoading: (status: boolean) => void;
    setRequestSuccess: (status: boolean) => void;
}

const AdminGalleryCard: React.FC<AdminGalleryCardProps> = ({
    image,
    getImages,
    setLoading,
    setRequestSuccess
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const deleteHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/album/${image.albumId}`);
            // console.log(res);
        } catch (err) {
            console.log(err);
        }
        setRequestSuccess(true);
        setTimeout(() => {
            getImages();
        }, 1500);
    };
    return (
        <div key={image.imageId} className="dashboardImageContainer">
            <div>
                <Image
                    className="hover:cursor-pointer"
                    alt="galleryimage"
                    src={image.imageUri}
                    width={100}
                    height={150}
                />
            </div>
            <div className="flex flex-col justify-between gap-4 ">
                <span className="flex gap-4 items-center text-2xl font-bold">
                    <h3>Album Name:</h3> <p className="text-lg font-light">{Strings.displayFriendlyString(image.albumName)}</p>
                </span>
                <span>
                    Download:{" "}
                    <Link
                        className="underline underline-offset-4 hover:opacity-75"
                        href={image.imageUri}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Here
                    </Link>
                    { }
                </span>
                <span>
                    View Album:{" "}
                    <Link
                        className="underline underline-offset-4 hover:opacity-75"
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${image.albumId}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Here
                    </Link>
                    { }
                </span>
                {!deleteConfirm && (
                    <div
                        onClick={() => setDeleteConfirm(true)}
                        className="font-bold text-red-600 hover:underline underline-offset-2"
                    >
                        Delete
                    </div>
                )}
                {deleteConfirm && (
                    <div className="font-bold flex gap-6">
                        <span
                            className="hover:underline underline-offset-2"
                            onClick={deleteHandler}
                        >
                            Confirm
                        </span>
                        <span
                            onClick={() => setDeleteConfirm(false)}
                            className="hover:underline underline-offset-2"
                        >
                            Cancel
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGalleryCard;
