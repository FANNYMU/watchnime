import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#121212] font-[Poppins,sans-serif]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
