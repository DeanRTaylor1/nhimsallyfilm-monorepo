import axios from "axios";
import { Fragment, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { AdminBlogProps } from "../../../lib/types/interfaces";
import { deleteCoverImage } from "../../../lib/utils/blogHelpers";
import { getRelativeDate } from "../../../lib/utils/getRelativeDate";
import ConfirmModal from "../Admin/confirm-modal";
import Image from "next/image";

export default function AdminBlogCard(props: AdminBlogProps) {
  const { title, content, description, imageUri, createdAt, fetchBlogPosts } =
    props;

  const [confirmDeleteModalActive, setConfirmDeleteModalActive] =
    useState<Boolean>(false);

  const modalHandler = () => {
    confirmDeleteModalActive === false
      ? setConfirmDeleteModalActive(true)
      : setConfirmDeleteModalActive(false);
  };

  const deletePostHandler = async () => {
    await deleteCoverImage(title);
    await axios.delete("/api/blog", { headers: { imageuri: imageUri } });
    fetchBlogPosts();
  };
  return (
    <Fragment>
      <div
        className={`z-10 absolute top-0 left-0 h-screen w-screen flex flex-col gap-4 min-h-fit bg-white rounded-md px-8 py-4 text-xl font-bold opacity-30 ${confirmDeleteModalActive ? 'filter blur-md' : 'hidden'
          }`}
      ></div>
      <article className="flex flex-col gap-2 h-[500px] w-[450px] rounded-md p-4">
        <figure className="w-full aspect-video">
          <Image src={imageUri} alt={title} width={800} height={550} />
        </figure>
        <div>
          <p className="font-extralight text-s italic">
            {getRelativeDate(new Date(createdAt))}
          </p>
          <span className="flex flex-col gap-2">
            <span className="flex justify-between w-full">
              <h2 className="font-black text-2xl">{title}</h2>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmDeleteModalActive(true);
                }}
                className="text-red-600 font-bold hover:underline underline-offset-2"
              >
                Delete
              </button>
            </span>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(description),
              }}
              suppressHydrationWarning={true}
            />
          </span>
        </div>
        {confirmDeleteModalActive && <ConfirmModal
          information={"Are you sure you want to delete this blog?"}
          confirm={deletePostHandler}
          closeModal={modalHandler}
        />}
      </article>
    </Fragment>
  );
}
