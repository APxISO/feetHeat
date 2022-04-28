import { SearchOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.PNG";

const Navbar = ({ user, setToken, setUser, token }) => {
  return (
    <div className="navbar">
      <div className="navcont">
        <div className="navleft">
          EN
          <div className="searchcont">
            <input placeholder="Search"></input>
            <SearchOutlined />
          </div>
        </div>
        <Link to="/" className="navcenter">
          <img src={logo} alt="Feet Heat Logo" />
        </Link>
        <div className="navright">
          <div className="menuCont">
            <Link to="/" className="menuItem">
              HOME
            </Link>
            <Link to="/Products" className="menuItem">
              ALL SHOES
            </Link>
            {user ? (
              <Link
                to="/"
                onClick={() => {
                  setToken("");
                  setUser(null);
                  localStorage.removeItem("token");
                }}
                className="menuItem"
              >
                LOGOUT
              </Link>
            ) : (
              <>
                <Link to="/Login" className="menuItem">
                  SIGN IN
                </Link>
                <Link to="/Register" className="menuItem">
                  REGISTER
                </Link>
              </>
            )}
            {user ? (
              user.isAdmin === true ? (
                <Link to="/admin" className="menuItem">
                  ADMIN
                </Link>
              ) : null
            ) : null}

            <Link to="/Cart" className="menuItem">
              <ShoppingCartOutlined />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
