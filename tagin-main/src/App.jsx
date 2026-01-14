import { useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Registerproduct from "./pages/Registerproduct";
import TransferOwnership from "./pages/TransferOwnership";
import { MdFactory } from "react-icons/md";
import { BsArrowLeftShort } from "react-icons/bs";

function App() {
  const [open, setOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const navItems = [
    { name: "Register Product", path: "/Registerproduct" },
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Transfer Ownership", path: "/transfer" },
  ];

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setUserAddress={setUserAddress} />
          }
        />

        {/* Protected routes (require login) */}
        {isLoggedIn ? (
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen">
                {/* Sidebar */}
                <nav
                  className={`sidebar transition-all border-r ${
                    open ? "w-72" : "w-20"
                  } relative`}
                >
                  {/* Collapse/Expand button */}
                  <BsArrowLeftShort
                    className={`absolute -right-3 top-6 bg-purple-400 rounded-full text-xl cursor-pointer border border-purple-700 z-10 transition-transform ${
                      open ? "" : "rotate-180"
                    }`}
                    onClick={() => setOpen(!open)}
                  />

                  {/* Logo section */}
                  <div className="flex items-center gap-4 p-4">
                    <MdFactory size={24} />
                    {open && <h1 className="text-xl font-bold">Manufacturer</h1>}
                  </div>

                  {/* Navigation links */}
                  <ul className="px-4">
                    {navItems.map((item, index) => (
                      <li key={index} className="my-2">
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-[16px] font-medium transition ${
                              isActive
                                ? "bg-[#f0f4fa] text-[#6aa9ff]"
                                : "text-[var(--muted)] hover:bg-[#f0f4fa] hover:text-[#6aa9ff]"
                            } ${open ? "text-left" : "text-center"}`
                          }
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Main Content */}
                <div className="flex-1">
                  <Routes>
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Registerproduct" element={<Registerproduct />} />
                    <Route path="/transfer" element={<TransferOwnership />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
