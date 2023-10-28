const CheckMark = () => {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="-2 -2 28 28"
                strokeWidth={1.5}
                stroke="green"
                className="w-40 h-40"
            >

                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                    className="tick"
                />
            </svg>
            <style jsx>{`
          .tick {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: draw 2s forwards;
          }
  
          @keyframes draw {
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
        </div>
    );
};

export default CheckMark;
