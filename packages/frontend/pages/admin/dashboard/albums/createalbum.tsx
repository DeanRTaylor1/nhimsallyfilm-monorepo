import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardContainer from "../../../../Components/Layout/Admin/DashboardContainer";
import { ImageSchema } from "../../../../lib/types/interfaces";
import Spinner from "../../../../Components/spinner/spinner";
import React, { useEffect, useState, useRef, Fragment, useReducer } from "react";
import NextImage from "next/image";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { awsImage, awsImageFile } from "../../../../lib/types/aws-types";
import { v4 as uuidv4 } from "uuid";
import CheckMark from "../../../../Components/checkmark/Checkmark";
import { Strings } from "../../../../lib/utils/strings";
import AlbumNameInput from "../../../../Components/Layout/Admin/inputs/AlbumNameInput";
import PackageNameSelect from "../../../../Components/Layout/Admin/inputs/PackageNameSelect";
import ConceptNameInput from "../../../../Components/Layout/Admin/inputs/ConceptNameInput";

interface FileWithMetadata extends File {
  metadata: any;
}

type ActionType =
  | { type: "SET_ALBUM_NAME"; payload: string }
  | { type: "SET_ALBUM_COVER"; payload: awsImage }
  | { type: "ADD_IMAGE"; payload: awsImageFile }
  | { type: "SET_PACKAGE_NAME"; payload: string }
  | { type: "SET_CONCEPT_NAME"; payload: string }
  | { type: "SET_ALBUM_ID"; payload: string }
  | { type: "UPDATE_IMAGES"; payload: awsImageFile[] };


type StateType = {
  albumName: string;
  albumId: string;
  packageName: string;
  albumCover: awsImage | null;
  images: awsImageFile[];
  conceptName: string;
};

const initialState: StateType = {
  albumName: "",
  albumId: "",
  conceptName: "",
  albumCover: null,
  images: [],
  packageName: "",
};

export const newAlbumReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_ALBUM_COVER":
      return { ...state, albumCover: action.payload };
    case "ADD_IMAGE": return { ...state, images: [...state.images, action.payload] };
    case "SET_PACKAGE_NAME":
      return { ...state, packageName: action.payload };
    case "SET_CONCEPT_NAME":
      return { ...state, conceptName: action.payload };
    case "SET_ALBUM_NAME":
      return { ...state, albumName: action.payload };
    case "UPDATE_IMAGES":
      return { ...state, images: action.payload };
    case "SET_ALBUM_ID":
      return { ...state, albumId: action.payload }
    default:
      return state;
  }
}

const CreateAlbum: React.FC = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(newAlbumReducer, initialState);
  const [albumNameExists, setAlbumNameExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const albumNameInput = useRef<HTMLInputElement>(null);
  const packageNameInput = useRef<HTMLSelectElement>(null);
  const conceptNameInput = useRef<HTMLInputElement>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const fullAlbumInputFile = useRef<HTMLInputElement>(null);

  const packageNameHandler = () => {
    if (packageNameInput.current) {
      dispatch({ type: "SET_PACKAGE_NAME", payload: packageNameInput.current.value });
    }
  };

  useEffect(() => {
    let timerId: any = null;

    const checkAlbumName = async () => {
      if (state.albumName === '') {
        setAlbumNameExists(false);
        return;
      }

      const response = await axios.get(`/api/album/check-name`, {
        params: {
          albumName: state.albumName,
        }
      });

      setAlbumNameExists(response.data.exists);
    };

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      checkAlbumName();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [state.albumName]);

  const handleImagesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    let currentAlbumId = state.albumId;
    if (!currentAlbumId) {
      currentAlbumId = uuidv4();
      dispatch({ type: "SET_ALBUM_ID", payload: currentAlbumId });
    }

    const files = Array.from(event.target.files);

    for (const [index, file] of files.entries()) {
      if (state.images.length >= 9 || state.images.length + index >= 9) break;

      const reader = new FileReader();
      reader.onloadend = () => {
        const tempImage = new Image();
        tempImage.src = reader.result as string;

        tempImage.onload = () => {
          const isLandscape = tempImage.width > tempImage.height;

          // Add the image to the local state
          const imageData: awsImageFile = {
            imageId: uuidv4(),
            imageUri: reader.result as string,
            file, // Add this line
            createdAt: new Date(),
            updatedAt: new Date(),
            packageName: state.packageName,
            conceptName: state.conceptName,
            isCoverImage: (state.images.length === 0 && index === 0),
            isLandscape,
            albumId: currentAlbumId,
            albumName: state.albumName,
            key: "",
            cloudfrontUri: "",
          };
          dispatch({ type: "ADD_IMAGE", payload: imageData });
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...state.images];
    updatedImages.splice(index, 1);
    if (updatedImages.length > 0 && updatedImages.filter(image => image.isCoverImage).length === 0) {
      updatedImages[0].isCoverImage = true;
    }
    dispatch({ type: "UPDATE_IMAGES", payload: updatedImages });
  };

  const handleSetCoverImage = (index: number) => {
    const updatedImages = state.images.map((image, i) => {
      return {
        ...image,
        isCoverImage: i === index,
      };
    });
    dispatch({ type: "UPDATE_IMAGES", payload: updatedImages });
  };

  const CustomUploadButton: React.FC = () => {
    return (
      <div>
        <input
          type="file"
          id="customFileInput"
          className="hidden"
          onChange={handleImagesSelect}
          multiple
        />
        <label
          htmlFor="customFileInput"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-700"
        >
          Upload Files
        </label>
      </div>
    );
  };

  const submitForm = async () => {
    if (
      state.images.length === 0 ||
      state.albumName === "" ||
      state.packageName === "" ||
      state.conceptName === "" ||
      albumNameExists
    )
      return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("albumName", state.albumName);
      formData.append("packageName", state.packageName);
      formData.append("conceptName", state.conceptName);

      state.images.forEach((image, index) => {
        // console.log(image)
        formData.append("images", image.file);

        const metadata = {
          ...image,
          imageUri: "",
          albumName: Strings.sanitizeString(state.albumName),
          conceptName: Strings.sanitizeString(state.conceptName),
          file: undefined, // Remove the file property to avoid circular reference
        };
        formData.append(`metadata[${index}]`, JSON.stringify(metadata));
      });

      const response = await axios.post("/api/album/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        console.log("Form submitted successfully");
        setIsLoading(false);
        setUploadSuccess(true);

        setTimeout(() => {
          router.push('/admin/dashboard/albums');
        }, 1500);
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      // Handle errors in the API call
      console.error(`Error submitting form: ${error}`);
      router.push('/admin/dashboard/albums');
    }
  };


  if (isLoading) {
    return (
      <DashboardContainer>
        <Spinner />
      </DashboardContainer>
    )
  }
  if (uploadSuccess) {
    return (
      <DashboardContainer>
        <CheckMark />
      </DashboardContainer>
    )
  }
  return (
    <DashboardContainer>
      <div className="min-h-[90%] h-fit w-5/6 flex flex-col gap-4 justify-start items-start border border-gray-200 shadow-md rounded-md p-8">
        <div className="h-fit w-full flex gap-4 items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Album Name: {Strings.displayFriendlyString(state.albumName) || 'Please enter album name'}</h1>
            <h3>Number of Images: {state.images.length || 0}</h3>
          </div>
        </div>
        <AlbumNameInput
          albumName={state.albumName}
          setAlbumName={(value) => dispatch({ type: 'SET_ALBUM_NAME', payload: value })}
          albumNameExists={albumNameExists}
        />
        <PackageNameSelect
          packageName={state.packageName}
          setPackageName={(value) => dispatch({ type: 'SET_PACKAGE_NAME', payload: value })}
        />

        <ConceptNameInput
          conceptName={state.conceptName}
          setConceptName={(value) => dispatch({ type: 'SET_CONCEPT_NAME', payload: value })}
        />
        {state.images.length < 9 && <CustomUploadButton />}
        <div className="flex flex-wrap gap-2 justify-center">
          {state.images.map((item, index) => (
            <div
              key={item.imageId}
              className={`relative h-fit w-fit border-2 rounded-md p-2 ${item.isLandscape ? "border-red-400" : "border-gray-200"
                }`}
            >
              <NextImage
                alt="useruploadedcontent"
                className="h-fit"
                src={item.imageUri}
                width="128"
                height="300"
              /><div className="flex w-full justify-between items-center">
                {item.isCoverImage ? (
                  <p className="text-sm text-green-500">Cover Image</p>
                ) : (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={() => handleSetCoverImage(index)}
                    />
                    <span className="ml-2 text-sm">Set as Cover</span>
                  </label>
                )}
                <button
                  className="text-red-500 mt-2"
                  onClick={() => handleDeleteImage(index)}
                >
                  <AiOutlineCloseCircle size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {state.images.length >= 1 && <div className="w-full flex justify-center">
          <div className="flex flex-col gap-2 w-[105px] justify-center">
            <button onClick={submitForm} className="submitButton  font-bold px-4 rounded cursor-pointer ">
              Submit
            </button>
          </div>
        </div>}
      </div>

    </DashboardContainer >
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default CreateAlbum;
