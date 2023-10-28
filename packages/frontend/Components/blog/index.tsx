import React, { Fragment, useEffect, useState } from "react";
import BlogCard from "../../Components/Layout/blog/blog-card";
import connectMongo from "../../mongoose/connectMongo";
import Blog from "../../models/Blog";
import { BlogListProps, BlogProps } from "../../lib/types/interfaces";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const BlogPage: React.FC<BlogListProps> = ({ blogs }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [blogPosts, setBlogPosts] = useState<BlogProps[]>([]);

  const pageHandler = (task: string) => {
    switch (task) {
      case "increase":
        if (blogCount < currentPage + 1 * 5) {
          return;
        }
        setCurrentPage(currentPage + 1)
      case "decrease":
        if (currentPage === 0) {
          return;
        }
        setCurrentPage(currentPage - 1);
    }
  };

  const fetchBlogPosts = async () => {
    const response = await axios.get("/api/blog", {
      headers: { page: currentPage },
    });
    setBlogPosts(response.data.blogs);
    setBlogCount(response.data.count);
  };

  useEffect(() => {
    setIsLoading(false);
    setBlogPosts(blogs);

    axios
      .get("/api/blog", {
        headers: { page: currentPage },
      })
      .then((response) => {
        if (response.data.count) {
          setBlogCount(response.data.count);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchBlogPosts()
  }, [currentPage])

  return (
    <Fragment>
      <div className="flex flex-col gap-8 justify-start items-center p-4 md:w-4/6 overflow-auto">
        <div className="w-full flex justify-between">
          <div className="contactlinks">Blog</div>
          <span className="font-extralight" >
            showing{" "}
            {`${currentPage * 5 + 1} - ${blogCount < (currentPage + 1) * 5
              ? blogCount
              : (currentPage + 1) * 5
              } of ${blogCount}`}
          </span>
        </div>
        <div className="md:max-w-[1300px] md:w-full md:flex md:flex-row md:flex-wrap justify-center">
          {!isLoading &&
            blogPosts.map((blog, index) => {
              return (
                <BlogCard
                  key={index}
                  title={blog.title}
                  content={blog.content}
                  description={blog.description}
                  imageUri={blog.imageUri}
                  createdAt={blog.createdAt}
                />
              );
            })}
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="flex justify-center items-center gap-2 border border-black w-fit">
            <div
              className="font-extralight text-xs flex justify-center items-center pl-2 hover:cursor-pointer"
              onClick={() => pageHandler("decrease")}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </div>
            <div className="border-l border-r border-black p-2">
              {" "}
              {currentPage + 1}
            </div>
            <div
              className="font-extralight text-xs flex justify-center items-center pr-2 hover:cursor-pointer"
              onClick={() => pageHandler("increase")}
            >
              <ArrowRightIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BlogPage;

const getStaticProps = async () => {
  let res;
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    res = await Blog.find().sort({ createdAt: "desc" }).limit(5);
    const blogs = JSON.parse(JSON.stringify(res));

    return {
      props: {
        blogs,
      },
      revalidate: 120,
    };
  } catch (err) {
    console.log(err);
  }
};

export { getStaticProps };
