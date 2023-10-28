import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, Fragment } from "react";
import DashboardContainer from "../../../../Components/Layout/Admin/DashboardContainer";
import Spinner from "../../../../Components/spinner/spinner";
import { uploadBlogCoverImage, deleteCoverImage } from "../../../../lib/utils/blogHelpers";
import { removeImageTags } from "../../../../lib/utils/remove-image-tags";
import Image from "next/image"

const CreateBlog: React.FC = () => {
  const router = useRouter();
  //TODO Update any
  const [coverImage, setCoverImage] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [coverImageUploaded, setcoverImageUploaded] = useState<
    true | false | "pending"
  >(false);
  const [input, setInput] = useState<string>("");
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const blogTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogTitle(e.currentTarget.value);
  };

  const uploadImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blogTitle === "") {
      return;
    }
    setcoverImageUploaded("pending");
    const file = e.currentTarget.files![0];
    // console.log(file);
    const uri = await uploadBlogCoverImage(blogTitle, file);
    setCoverImage(uri!);
    setcoverImageUploaded(true);
  };

  const submitBlogHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // console.log(removeImageTags(input));
    if (blogTitle === "" || !coverImageUploaded) {
      return;
    }
    const description = removeImageTags(input.slice(0, 100));
    try {
      const result = axios.post("/api/blog", {
        title: blogTitle,
        description,
        content: input,
        imageuri: coverImage,
      });
      // console.log(result);
    } catch (err) {
      console.log(err);
    } finally {
      router.push('/admin/dashboard/blog');
    }
  };
  const deleteCoverImageHandler = async () => {
    setcoverImageUploaded("pending");
    await deleteCoverImage(blogTitle);
    setcoverImageUploaded(false)
    setCoverImage('')
  }
  return (
    <DashboardContainer>
      <div className="h-5/6 w-5/6 flex flex-col gap-4 justify-start items-start">
        <div className="h-fit flex gap-4 items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Blog Title: {blogTitle}</h1>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {!coverImageUploaded && (
              <Fragment>
                <label>Blog Title:</label>
                <input
                  className="statusCreator"
                  placeholder="Please enter your album name"
                  onChange={(e) => blogTitleHandler(e)}
                  value={blogTitle}
                ></input>
              </Fragment>
            )}
            {coverImageUploaded === "pending" && <Spinner />}
            {!!coverImageUploaded && (
              <Fragment>
                <Image
                  width={800}
                  height={451}
                  src={coverImage}
                  alt={"coverimage"}
                />
                <button
                  onClick={deleteCoverImageHandler}
                  className="submitButton"
                >
                  Delete Image
                </button>
              </Fragment>
            )}


            {!coverImageUploaded && (
              <div className="flex flex-col justify-start items-center h-fit gap-10">
                <button
                  onClick={() => inputFile.current!.click()}
                  className="submitButton"
                >
                  Upload Blog Cover
                </button>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={uploadImageHandler}
                  ref={inputFile}
                  style={{ display: "none" }}
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              {!isLoading && <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                onInit={(evt, editor) => setInput(editor.getContent())}
                initialValue="<p>This is the initial content of the editor.</p>"
                value={input}
                onEditorChange={(newValue, editor) => setInput(newValue)}
                init={{
                  height: 500,
                  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | fontsize | image | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />}
            </div>
            <button
              onClick={(e) => submitBlogHandler(e)}
              className="submitButton"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </DashboardContainer>
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


export default CreateBlog;
