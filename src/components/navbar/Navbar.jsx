import React from "react";

// Miscellaneous
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      item: "Post",
      path: "/",
    },
    {
      item: "Photo",
      path: "/photo",
    },
    {
      item: "Task",
      path: "/task",
    },
  ];

  return (
    <nav className="p-shorter4 px-longer bg-custom-dim-gray/10">
      <section className="flex justify-between items-center">
        <h2
          className="text-custom-lavender cursor-pointer"
          onClick={() => navigate("/")}
        >
          TZ
        </h2>
        <ul className="flex gap-10">
          {navItems.map((e, i) => (
            <NavLink
              key={i}
              to={e.path}
              className={({ isActive }) =>
                `uppercase font-semibold text-custom-black animate500 ${
                  isActive
                    ? "border-b-2 border-custom-black scale-100"
                    : " border-b-2 border-transparent"
                }`
              }
            >
              {e.item}
            </NavLink>
          ))}
        </ul>
      </section>
    </nav>
  );
};

export default Navbar;
