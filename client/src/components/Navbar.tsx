import React from "react";
import { Link } from "react-router-dom";
interface IProps {
  isLoggedIn: boolean;
}
interface INavigation {
  id: string;
  name: string;
  path: string;
}
const loggedInNavs: Array<INavigation> = [
  {
    id: "nav_home",
    name: "Home",
    path: "/",
  },
  {
    id: "nav_about",
    name: "About",
    path: "/about",
  },
];
const loggedOutNavs: Array<INavigation> = [
  {
    id: "nav_home",
    name: "Home",
    path: "/",
  },
  {
    id: "nav_register",
    name: "Register",
    path: "/register",
  },
];

const Navbar: React.FC<IProps> = ({ isLoggedIn }) => {
  return (
    <ul>
      {isLoggedIn ? (
        <>
          {loggedInNavs.map((navItem) => (
            <li key={navItem.id}>
              <Link to={navItem.path}>{navItem.name}</Link>
            </li>
          ))}
        </>
      ) : (
        <>
          {loggedOutNavs.map((navItem) => (
            <li key={navItem.id}>
              <Link to={navItem.path}>{navItem.name}</Link>
            </li>
          ))}
        </>
      )}
    </ul>
  );
};

export default Navbar;
