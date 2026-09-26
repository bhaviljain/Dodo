import { useState } from "react";
import { Products } from "./utils";
import { Drawer } from "@mui/material";
import { DodoCheckout } from "../../dist/dodo-payments";
import Toast from "./Toast";
import { Heart, IndianRupee, Loader, ShoppingBag, Trash2, User, XIcon } from "lucide-react";

type ProductsType = {
  id: string;
  name: string;
  price: number;
};

const Product = () => {
  const [cart, setCart] = useState<ProductsType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showCart, setShowCart] = useState(false);
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };
  const addToCart = (product: ProductsType) => {
    setCart((prev) => [...prev, product]);
    showToast("success", `${product.name} added to cart`);
  };

  const total = cart.reduce((acc, pro) => {
    return acc + pro.price;
  }, 0);

  const handlePay = (product: ProductsType) => {
    DodoCheckout.open({
      productId: product.id,
      productName: product.name,
      productAmount: product.price,

      onProcessing: (processing) => {
        setIsProcessing(processing);
      },
      onSuccess: (data) => {
        setIsProcessing(false);

        showToast("success", data.message);
        setCart([]);
      },

      onClose: (data) => {
        setIsProcessing(false);

        if (data.reason === "user_closed") {
          showToast("error", "Payment declined by user");
        }
      },

      onError: (data) => {
        setIsProcessing(false);

        showToast("error", data.message);
      },
    });
  };

  const deleteCart = (index:number) =>{
    const delCart = cart.filter((c,i)=> i !==index )
    setCart(delCart)
     showToast("success", "Item deleted successfully");
  }

  return (
    <>
    <div className="flex items-center justify-end mt-3 px-5">
      <button
        className="cursor-pointer rounded-md  flex flex-col items-center  bg-white px-4 py-2 text-sm font-medium text-gray-800  transition hover:bg-gray-50"
      >
        <User size={16} />
        <div>Profile</div>
      </button>
      <button
        className="cursor-pointer rounded-md  flex flex-col items-center  bg-white px-4 py-2 text-sm font-medium text-gray-800  transition hover:bg-gray-50"
      >
       
        <Heart size={16} />
         <div>
          Wishlist
        </div>
      </button>
      <button
       onClick={() => setShowCart(true)}
        className="relative cursor-pointer rounded-md  flex flex-col items-center  bg-white px-4 py-2 text-sm font-medium text-gray-800  transition hover:bg-gray-50"
      >
        <span className="absolute right-2 p-0.5 px-1.5 bg-yellow-400 text-[10px] rounded-full">{cart.length}</span>
        <ShoppingBag size={16} /> 
        <div>
          Bag
        </div>
      </button>
      </div>
      <div className="p-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {isProcessing && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
            <div className="rounded-md bg-white px-3 flex items-center gap-1 py-2 text-sm font-medium text-gray-900 shadow-lg">
              <Loader className="animate-spin" size={14}/> Processing payment...
            </div>
          </div>
        )}
        {Products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm "
          >
            <img
              src={product.imageSrc}
              alt={product.name}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900">
                {product.name}
              </h3>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                ₹{product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <ShoppingBag size={16} /> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
  
      <Drawer anchor="right" open={showCart} onClose={() => setShowCart(false)}>
        <div className="flex h-full w-[40vw] flex-col bg-gray-50">
          <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Your Cart <ShoppingBag size={20} />
            </h3>
             <XIcon className="cursor-pointer" size={16} onClick={()=>setShowCart(false)}/>
          </div> 
            <p className="mt-1 text-sm text-gray-500">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((product,index) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">

                      <button className="p-2 h-[32px] bg-gray-100 rounded-md cursor-pointer"
                      onClick={()=>deleteCart(index)}
                      >
                        <Trash2 size={14} className="text-red-500"/>
                      </button>  

                      <button
                        onClick={() => {
                          setShowCart(false);
                          handlePay(product);
                        }}
                        className="cursor-pointer flex items-center gap-1 rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                      >
                        <IndianRupee size={12} /> Pay
                      </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Amount</span>

                <span className="text-lg font-semibold text-gray-900">
                  ₹{total}
                </span>
              </div>
            </div>
          )}
        </div>
      </Drawer>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Product;
