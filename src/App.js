import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./Admin";
import Cart from "./Cart";
import PurchaseSuccessful from "./components/PurchaseSuccessful";
import Announcement from "./components/Announcement";
import Footer from "./components/Footer";
import AllProducts from "./components/AllProducts";
import Home from "./pages/Home";
import ProductSingleView from "./productSingleView";

const App = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const response = await fetch(`/api/products`);
    const info = await response.json();
    setProducts(info);
  };

  const fetchUser = async () => {
    const lsToken = localStorage.getItem("token");

    if (lsToken) {
      setToken(lsToken);
    }
    const response = await fetch(`/api/user/me`, {
      headers: {
        Authorization: `Bearer ${lsToken}`,
      },
    });

    const data = await response.json();

    if (!data.error) {
      setUser(data);
    }
  };

  const addItemToCart = async (currentProduct) => {
    console.log(user, "Item added!");
    if (user) {
      const productInCart = user.cart.products.find(
        (product) => product.id === currentProduct.id
      );

      if (productInCart) {
        const response = await fetch(`/api/order/updateCartItem`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: user.cart.id,
            productId: currentProduct.id,
          }),
        });

        await fetchUser();
        return;
      } else {
        const response = await fetch(`/api/order/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: user.cart.id,
            productId: currentProduct.id,
            price: currentProduct.price,
            quantity: 1,
          }),
        });

        await fetchUser();
        return;
      }
    } else {
      const productInCart = cartItems.find(
        (item) => item.id === currentProduct.id
      );

      if (productInCart) {
        const itemToAdd = cartItems.map((cartItem) => {
          const tempItem = { ...productInCart, qty: cartItem.qty + 1 };
          tempItem.displayPrice = tempItem.price * tempItem.qty;
          return cartItem.id === currentProduct.id ? tempItem : cartItem;
        });

        setCartItems(itemToAdd);
      } else {
        setCartItems([
          ...cartItems,
          { ...currentProduct, qty: 1, displayPrice: currentProduct.price },
        ]);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, [token]);

  return (
    <div id="container">
      <Announcement />
      <Navbar user={user} setUser={setUser} setToken={setToken} token={token} />

      <div id="main">
        <Routes>
          <Route element={<Home user={user} />} path="/" />
          <Route
            element={
              <Login
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                user={user}
                setUser={setUser}
                setToken={setToken}
                error={error}
                setError={setError}
              />
            }
            path="/Login"
          />

          <Route
            element={
              <Register
                setUsername={setUsername}
                username={username}
                password={password}
                setPassword={setPassword}
                setConfirm={setConfirm}
                confirm={confirm}
                setToken={setToken}
                setError={setError}
              />
            }
            path="/Register"
          />

          <Route
            element={
              <AllProducts
                products={products}
                fetchProducts={fetchProducts}
                addItemToCart={addItemToCart}
              />
            }
            path="/Products"
          />

          <Route
            element={
              <ProductSingleView
                fetchProducts={fetchProducts}
                addItemToCart={addItemToCart}
                products={products}
              />
            }
            path="/Products/:id"
          />
          <Route element={<PurchaseSuccessful />} path="/PurchaseSuccessful" />

          <Route
            element={
              <Admin
                fetchUser={fetchUser}
                products={products}
                user={user}
                token={token}
                fetchProducts={fetchProducts}
              />
            }
            path="/admin"
          />
          <Route
            element={
              <Cart
                setCartItems={setCartItems}
                cartItems={cartItems}
                addItemToCart={addItemToCart}
                user={user}
                token={token}
                products={products}
                fetchUser={fetchUser}
              />
            }
            path="/Cart"
          ></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
