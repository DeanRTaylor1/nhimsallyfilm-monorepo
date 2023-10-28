import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-8">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="font-medium text-2xl">
        Loading, please wait
        <span className="ellipsis-dot">.</span>
        <span className="ellipsis-dot">.</span>
        <span className="ellipsis-dot">.</span>
      </div>
      <style jsx>{`
.ellipsis-dot {
  animation-name: ellipsis;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}

.ellipsis-dot:nth-child(1) {
  animation-delay: 0s;
}

.ellipsis-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.ellipsis-dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes ellipsis {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
`}</style>
    </div>
  );
};

export default Spinner;
