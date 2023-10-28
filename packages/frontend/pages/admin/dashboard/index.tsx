import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "../../../Components/spinner/spinner";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return <div>dashboard</div>;
};

export default Dashboard;

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
