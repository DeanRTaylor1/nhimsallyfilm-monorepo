import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import DashboardContainer from "../../../../Components/Layout/Admin/DashboardContainer";
import AdminBlogCard from "../../../../Components/Layout/blog/admin-blog-card";
import Spinner from "../../../../Components/spinner/spinner";
import { BlogProps } from "../../../../lib/types/interfaces";

const BlogDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [blogPosts, setBlogPosts] = useState<BlogProps[]>([]);
  const [blogCount, setBlogCount] = useState<number>(0);

  const pageHandler = (task: string) => {
    switch (task) {
      case "increase":
        if (blogCount < currentPage + 1 * 5) {
          return;
        }
        setCurrentPage(currentPage + 1);
      case "decrease":
        if (currentPage === 0) {
          return;
        }
        setCurrentPage(currentPage - 1);
    }
  };

  const fetchBlogPosts = useCallback(async () => {
    const response = await axios.get("/api/blog", {
      headers: { page: currentPage },
    });
    // console.log(response.data.blogs);
    setBlogPosts(response.data.blogs);
    setBlogCount(response.data.count);
  }, [currentPage, setBlogPosts, setBlogCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchBlogPosts();
    setIsLoading(false);
  }, [currentPage, fetchBlogPosts]);

  return (
    <DashboardContainer>
      <div className="h-5/6 w-5/6 flex flex-col gap-4 justify-start items-start">
        <div className="h-fit w-full flex gap-4 justify-between items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Blog</h1>
            <span className="font-extralight text-xs">
              showing{" "}
              {`${(currentPage) * 5 + 1} - ${blogCount < (currentPage + 1) * 5 ? blogCount : (currentPage + 1) * 5
                } of ${blogCount}`}
            </span>
          </div>

          <div className="w-24">
            <Link href="/admin/dashboard/blog/create">
              <button className="submitButton h-8">Create Blog</button>
            </Link>
          </div>
        </div>
        {!!isLoading && <Spinner />}
        {!isLoading && (
          <div className="w-full flex flex-col md:flex-row md:flex-wrap items-center justify-center md:justify-between">
            {blogPosts.map((blogpost, index) => {
              return (
                <AdminBlogCard
                  key={index}
                  fetchBlogPosts={fetchBlogPosts}
                  title={blogpost.title}
                  content={blogpost.content}
                  description={blogpost.description}
                  imageUri={blogpost.imageUri}
                  createdAt={blogpost.createdAt}
                />
              );
            })}
          </div>
        )}
        <div className="w-full flex justify-center items-center pb-4">
          <div className="h-full flex justify-center items-center gap-2 border border-black w-fit">
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

export default BlogDashboard;
