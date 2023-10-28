import { Fragment, PropsWithChildren } from "react";
import MobileDashBoardNav from "./DashboardMobileNav";
import DashBoardNav from "./DashBoardNav";

const AdminDashboardLayout: React.FC<PropsWithChildren> = (props) => {
  return (
    <Fragment>
      <div className="md:grid h-screen w-screen grid-cols-dashboard grid-rows-1 md:justify-items-center">
        <MobileDashBoardNav />
        <DashBoardNav />
        {props.children}
      </div>
    </Fragment>
  );
};

export default AdminDashboardLayout;
