import React, { useEffect, useState, useRef } from "react";

// Miscellaneous
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [windowY, setWindowY] = useState(0);
  const lastScrollTop = useRef(0);
  const [visible, setVisible] = useState(true);

  const navItems = [
    {
      item: "Post",
      path: "/",
    },
    {
      item: "Album",
      path: "/album",
    },
    {
      item: "Task",
      path: "/task",
    },
  ];

  useEffect(() => {
    function handleWindowResize() {
      setWindowY(window.scrollY);
    }
    window.addEventListener("scroll", handleWindowResize);

    window.addEventListener(
      "scroll",
      () => {
        let { scrollY } = window;
        if (scrollY > lastScrollTop.current) {
          setVisible(false);
        } else if (scrollY < lastScrollTop.current) {
          setVisible(true);
        }
        lastScrollTop.current = scrollY <= 0 ? 0 : scrollY;
      },
      { passive: true }
    );

    return () => {
      window.removeEventListener("scroll", handleWindowResize);
    };
  }, []);

  return (
    <nav
      className={`z-20 sticky top-0 p-shorter4 px-longer bg-custom-dim-gray/10
     ${windowY > 0 && "bg-custom-blue-1/60 backdrop-blur-sm shadow-md"}
    `}
    >
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
