import React, { useState, useMemo } from "react";
import { render } from "react-dom";
import "./index.css";

// Header Component
const Header = () => (
  <div className="mt-2">
    <h1>AKQA</h1>

    <h3 className="mt-2">Your Basket</h3>

    <small>
      Items you have added to your basket are shown below.
      <br />
      Adjust the quantities or remove items before continuing your purchase.
    </small>
  </div>
);

// Cart Table Component
const CartTable = ({
  cartItems,
  onChange,
  incrementQuantity,
  decrementQuantity,
  deleteItem
}) => (
  <table className="cart-table mt-2">
    <thead>
      <tr className="border-bottom">
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Cost</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {// Loop through Cart Items,
      // where item will be each of the cart item
      cartItems.map(item => (
        <tr className="cart-item">
          <td>{item.name}</td>
          <td>£{item.price}</td>
          <td className="quantity">
            <input
              type="name"
              onChange={e => onChange(e, item)}
              value={item.quantity}
            />
            <div className="actions">
              <button onClick={() => incrementQuantity(item)}>+</button>
              <button onClick={() => decrementQuantity(item)}>-</button>
            </div>
          </td>
          <td>£{(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <i className="material-icons" onClick={() => deleteItem(item)}>
              delete
            </i>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Total Display Component
const Totals = ({ calcSubtotal, calcVat }) => (
  <div className="totals mt-2">
    <div className="text-gray">
      <span>Subtotal</span>
      <span>£{calcSubtotal.toFixed(2)}</span>
    </div>
    <div className="text-gray">
      <span>VAT @ 20%</span>
      <span>£{calcVat.toFixed(2)}</span>
    </div>
    <div className="mt-2 font-weight-bold">
      <span>Total Cost</span>
      <span>£{(calcSubtotal + calcVat).toFixed(2)}</span>
    </div>
  </div>
);

// Buy Now Button Component
const BuyButton = ({ onBuy }) => (
  <div className="buy-button mt-2">
    <button onClick={onBuy}>
      Buy Now <i className="material-icons">double_arrow</i>
    </button>
  </div>
);

// Fixed Bottom Footer Component
const Footer = () => (
  <footer>
    &copy; <strong>2013 AKQA Ltd.</strong> Registered in England; 2964394
  </footer>
);

// Main Application Entry w/ State
const App = () => {
  // Cart Item Management w/ useState Hooks
  const [cartItems, setCartItems] = useState([
    {
      name: "Cotton T-Shirt, Medium",
      price: 1.99,
      quantity: 1
    },
    {
      name: "Baseball Cap, One Size",
      price: 2.99,
      quantity: 2
    },
    {
      name: "Swim Shorts, Medium",
      price: 3.99,
      quantity: 1
    }
  ]);

  // onChange Callback for Quantity Input Field
  const onChange = (e, item) => {
    // Regular Expression for accepting numbers from 1 to 10
    const re = /^([1-9]|1[0])$/;

    // Test if RegExp is valid, then modify item quantity, else exit
    if (e.target.value === "" || re.test(e.target.value)) {
      const newCartItems = [...cartItems];
      const index = newCartItems.findIndex(x => x.name === item.name);
      newCartItems[index].quantity = e.target.value;
      setCartItems(newCartItems);
    }
  };

  // Callback to Increment Quantity
  const incrementQuantity = item => {
    // If quantity is 10 or above, don't do anything
    if (item.quantity >= 10) return;
    const newCartItems = [...cartItems];
    const index = newCartItems.findIndex(x => x.name === item.name);
    newCartItems[index].quantity++;
    setCartItems(newCartItems);
  };

  // Callback to Decrement Quantity
  const decrementQuantity = item => {
    // If quantity is 1 or below, don't do anything
    if (item.quantity <= 1) return;
    const newCartItems = [...cartItems];
    const index = newCartItems.findIndex(x => x.name === item.name);
    newCartItems[index].quantity--;
    setCartItems(newCartItems);
  };

  // Callback to Delete Item
  const deleteItem = item => {
    const newCartItems = [...cartItems];
    const index = newCartItems.findIndex(x => x.name === item.name);
    newCartItems.splice(index, 1); // Delete by Index
    setCartItems(newCartItems);
  };

  // Calculate Subtotal
  // useMemo has been used for performance purposes, so as to not recalculate the total every single time the function is called, but only when cartItems has been modified.
  const calcSubtotal = useMemo(
    () => cartItems.reduce((acc, val) => acc + val.price * val.quantity, 0),
    [cartItems]
  );

  // Calculate VAT
  // useMemo has been used for the same reason as calcSubtotal, but this is recalculated on when calcSubtotal has been modified.
  const calcVat = useMemo(() => (calcSubtotal * 20) / 100, [calcSubtotal]);

  // onClick Handler for Buy Now Button
  // Displays JSON to be sent to Server as an alert dialog message
  const onBuy = () => {
    const data = {
      cart: cartItems,
      subtotal: calcSubtotal,
      vat: calcVat,
      total: calcSubtotal + calcVat
    };

    alert(JSON.stringify(data));
  };

  return (
    <div id="App" className="container">
      <Header />

      <CartTable
        cartItems={cartItems}
        onChange={onChange}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        deleteItem={deleteItem}
      />

      <Totals calcSubtotal={calcSubtotal} calcVat={calcVat} />

      <BuyButton onBuy={onBuy} />

      <Footer />
    </div>
  );
};

render(<App />, document.getElementById("root"));
