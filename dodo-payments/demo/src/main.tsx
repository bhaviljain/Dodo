import ReactDOM from "react-dom/client";
import Product from "./Product.js";
import "./style.css";


// DodoCheckout.open({
//   productId:"123",
//   onClose({reason}) {
//     console.log(reason)
//   },
//   onSuccess({sessionId}) {
//     console.log(sessionId)
//   },
// onError({ code, message }) {
//     console.log(code, message);
//   },
// })


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Product />
);
