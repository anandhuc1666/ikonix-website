import React from "react";
import catNotfind from "../anime/83627cee-1153-11ee-b832-fb1242dd7de9.gif"
function PageLess() {
  return (
    <div className="w-full h-screen bg-white text-black flex items-center justify-center flex-col gap-5 p-5">
      <img
        src={catNotfind}
        alt="Page Not Found"
        className="sm:w-80 sm:h-80 w-50"
      />
      <h1 className="sm:text-3xl text-xl font-bold">404 - Page Not Found</h1>
      <a
        href="/"
        className="sm:text-lg text-[12px] text-blue-500 hover:underline"
      >
        Go back to the Products Page
      </a>
      <p className="sm:text-lg text-[12px]">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}

export default PageLess;
