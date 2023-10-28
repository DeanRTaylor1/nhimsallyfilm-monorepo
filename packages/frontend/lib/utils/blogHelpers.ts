import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadBytes,
} from "firebase/storage";

const uploadBlogCoverImage = async (title: string, file: File) => {
  // console.log(title);
  const filePath = `blogs/${title}/coverimage`;
  const newImageRef = ref(getStorage(), filePath);

  try {
    const fileSnapshot = await uploadBytes(newImageRef, file);
    // console.log("success");
    const publicImageUrl = await getDownloadURL(newImageRef);
    // console.log(publicImageUrl);
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
    // console.log(result);
    return;
  } catch (err) {
    return err;
  }
};

export { uploadBlogCoverImage, deleteCoverImage };
