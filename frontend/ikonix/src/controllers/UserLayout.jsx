import React from "react";
import { Outlet } from "react-router-dom";

import Navigation from "./Navigation/Navigation.jsx";
import Footer from "./Footer/Footer.jsx";

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* USER NAVIGATION */}

      <Navigation />

      {/* USER PAGE */}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* USER FOOTER */}

      <Footer />

    </div>
  );
}

export default UserLayout;