import React, { Fragment, useEffect, useState } from "react";
import BlogCard from "../../Components/Layout/blog/blog-card";
import connectMongo from "../../mongoose/connectMongo";
import Blog from "../../models/Blog";
import { BlogListProps, BlogProps } from "../../lib/types/interfaces";
import { useRouter } from "next/router";

import sanitizeHtml from "sanitize-html";
import Spinner from "../../Components/spinner/spinner";
import axios from "axios";
import Image from "next/image";

const BlogPage: React.FC<BlogProps> = () => {
  const router = useRouter();
  const { blogtitle } = router.query
  const [blogTitle, setBlogTitle] = useState<string>(blogtitle as string)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentBlog, setCurrentBlog] = useState<BlogProps>();

  const getCurrentBlog = async () => {
    try {
      console.log(blogtitle)
      const response = await axios.get("/api/blog/blogpage", {
        headers: { title: blogtitle },
      });
      console.log(response.data.blog);
      setCurrentBlog(response.data.blog);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    console.log("Router: " + router)
    if (router && router.query) {
      const { blogtitle } = router.query;
      setBlogTitle(blogtitle as string);
    }

    getCurrentBlog();

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <Fragment>
      <div className="flex flex-col gap-8 justify-start items-center p-4 md:w-5/6 overflow-auto">
        <div className="contactlinks">{blogtitle}</div>
        {isLoading && <Spinner />}
        {!isLoading && !!currentBlog && (
          <Fragment>
            <Image src={currentBlog.imageUri} alt={currentBlog.title} width={800} height={550} />
            <div className="md:max-w-[800px] w-4/5 flex flex-col gap-4 justify-center "
              dangerouslySetInnerHTML={{
                __html: currentBlog.content!,
              }}
              suppressHydrationWarning={true}
            />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default BlogPage;
