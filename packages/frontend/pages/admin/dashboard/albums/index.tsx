import { useSession, getSession } from "next-auth/react";
import DashboardContainer from "../../../../Components/Layout/Admin/DashboardContainer";
import Spinner from "../../../../Components/spinner/spinner";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AdminGalleryCard from "../../../../Components/Layout/Admin/AdminGalleryCardNew";
import CheckMark from "../../../../Components/checkmark/Checkmark";

const Albums: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  const getImages = () => {
    setRequestSuccess(false);
    setLoading(true);
    axios
      .get("/api/albumcovers")
      .then((response) => {
        // console.log(response.data)
        setImages(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        setLoading(false);
      });
  };

  useEffect(() => {
    getImages();
  }, []);

  if (requestSuccess) {
    return (
      <DashboardContainer>
        <CheckMark />
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <div className="h-5/6 w-5/6 max-w-[1400px] flex flex-wrap gap-4 justify-start items-start lg:justify-center">
        <div className="h-fit w-full flex gap-4 justify-between items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Albums</h1>
            <h3>Number of Albums: {images.length}</h3>
          </div>

          <div className="w-24">
            <Link href="/admin/dashboard/albums/createalbum">
              <button className="submitButton h-8">Add Album</button>
            </Link>
          </div>

        </div>
        {loading && <Spinner />}
        {!loading &&
          images.length > 0 &&
          images.map((item) => {
            return (
              <Fragment key={item.imageId}>
                <AdminGalleryCard
                  image={item}
                  getImages={getImages}
                  setLoading={setLoading}
                  setRequestSuccess={setRequestSuccess}
                />
              </Fragment>
            );
          })}
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

export default Albums;
