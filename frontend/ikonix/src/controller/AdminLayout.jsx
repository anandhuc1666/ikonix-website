import React from "react";
import { Outlet } from "react-router-dom";

import Navigation from "./navigation/navigation.jsx";

function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#f7f8fa]">

      {/* ADMIN SIDEBAR */}

      <Navigation />

      {/* ADMIN CONTENT */}

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;