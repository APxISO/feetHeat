import { SearchOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.PNG";

const Navbar = ({ user, setToken, setUser, token }) => {
  const isLoggedIn = !!user && !!token;

  return (
    <div className="navbar">
      <div className="navcont">
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
            {isLoggedIn ? (
              <>
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
                <Link to="/Cart" className="menuItem">
                  <ShoppingCartOutlined />
                </Link>
              </>
            ) : (
              <>
                <Link to="/Login" className="menuItem">
                  SIGN IN
                </Link>
                <Link to="/Register" className="menuItem">
                  REGISTER
                </Link>
                <Link to="/Cart" className="menuItem">
                  <ShoppingCartOutlined />
                </Link>
              </>
            )}
            {isLoggedIn && user.isAdmin === true ? (
              <Link to="/admin" className="menuItem">
                ADMIN
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
