import React, { Fragment } from "react";

const Contact: React.FC = () => {
  return (
    <Fragment>
      <div className="flex flex-col h-full  md:flex-col gap-24 justify-center p-4 items-center w-full max-w-[1400px]">
        <div className="h-full flex flex-col gap-8 justify-center items-start p-4 w-full overflow-auto">
          <div className="contactlinks">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ig.me/m/nhimsally.film"
            >
              Instagram
            </a>
          </div>
          <div className="contactlinks">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://m.me/nhimchupfilm"
            >
              Facebook
            </a>
          </div>
          <div className="contactlinks">
            {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto: nhimsally179@gmail.com"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;
