import React from "react";
import ReactDOM from "react-dom/client";
import Checkout from "../../checkout/src/Checkout"
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <Checkout />
  </React.StrictMode>
);