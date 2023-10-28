import {
  collection,
  getDocs,
  DocumentData,
  query,
  limit,
  where,
} from "firebase/firestore";
import {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  listAll,
} from "firebase/storage";
import { db } from "../../firebase/firebase";
import { image } from "../types/interfaces";

const getHomeLandScapeImages = async () => {
  let newArr: image[] = [];
  try {
    const images = collection(db, "homelandscapeslider");
    const imagesSnap = await getDocs(images);
    if (!imagesSnap.empty) {
      imagesSnap.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        let obj = { id: doc.id, ...doc.data() };
        newArr.push(obj);
        return newArr;
      });
    } else {
      console.log("no such doc");
    }
    return newArr;
  } catch (err) {
    console.log(err);
  }
};

const getGalleryImages = async () => {
  let newArr: image[] = [];
  try {
    const images = collection(db, "galleriesPage");
    const imageQuery = query(images, limit(9));
    const imagesSnap = await getDocs(imageQuery);

    if (!imagesSnap.empty) {
      imagesSnap.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        let obj = { id: doc.id, ...doc.data() };
        newArr.push(obj);
        return newArr;
      });
    } else {
      console.log("no such doc");
    }
    return newArr;
  } catch (err) {
    console.log(err);
  }
};

const getPackageImages = async (packageName: string) => {
  let newArr: any[] = [];
  try {
    const images = collection(db, "packages");
    const imageQuery = query(
      images,
      where("group", "==", packageName.toString())
    );
    const imagesSnap = await getDocs(imageQuery);

    if (!imagesSnap.empty) {
      imagesSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let obj = { id: doc.id, ...doc.data() };
        newArr.push(obj);
      });

      return newArr;
    } else {
      console.log("no such doc");
    }
    return newArr;
  } catch (err) {
    console.log(err);
  }
};

const uploadBlogCoverImage = async (title: string, file: Blob | File) => {
  console.log(title);
  const filePath = `blogs/${title}/coverimage`;
  const newImageRef = ref(getStorage(), filePath);

  try {
    const fileSnapshot = await uploadBytes(newImageRef, file);
    console.log("success");
    const publicImageUrl = await getDownloadURL(newImageRef);
    console.log(publicImageUrl);
    return publicImageUrl;
  } catch (err) {
    console.log(err);
  }
};

const deleteCoverImage = async (title: string) => {
  const filePath = `blogs/${title}/coverimage`;
  const delImageRef = ref(getStorage(), filePath);
  try {
    const result = await deleteObject(delImageRef);
    console.log(result);
    return;
  } catch (err) {
    return err;
  }
};

const uploadImage = async (albumname: string, file: File) => {
  const filePath = `images/${albumname}/${file.name}`;
  const newImageRef = ref(getStorage(), filePath);
  const fileSnapshot = await uploadBytesResumable(newImageRef, file);
  const publicImageUrl = await getDownloadURL(newImageRef);
  return publicImageUrl;
};

const createImageURLMap = (
  albumName: string,
  array: any[],
  isAlbumCover: Boolean
) => {
  const imageObjects = array.map((item, i) => {
    return {
      imageName: `${albumName}_${i + 1}`,
      imageUri: item,
      albumName,
      isAlbumCover: isAlbumCover ? true : false,
    };
  });
  return imageObjects;
};

const deleteImage = async (albumName: string, imageName: string) => {
  const filePath = `images/${albumName}/${imageName}`;
  const delImageRef = ref(getStorage(), filePath);
  try {
    const result = await deleteObject(delImageRef);
    console.log(result);
    return;
  } catch (err) {
    return err;
  }
};

const listAllFiles = async (albumName: string): Promise<any> => {
  const filePath = `images/${albumName}`;
  const listImagesRef = ref(getStorage(), filePath);
  const files = await listAll(listImagesRef);
  console.log(files);
  return files.items;
};

export {
  getPackageImages,
  getHomeLandScapeImages,
  getGalleryImages,
  uploadImage,
  createImageURLMap,
  deleteImage,
  listAllFiles,
  uploadBlogCoverImage,
  deleteCoverImage,
};
