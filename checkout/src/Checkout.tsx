import { CreditCard, Loader, RefreshCcw, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
  productId: string;
  productName: string;
  productAmount: number;
};

function Checkout() {
  const PARENT_ORIGIN = import.meta.env.VITE_PARENT_ORIGIN;
  const [product, setProduct] = useState<Product | null>(null);
  const [cardError, setCardError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "process" | "idle" | "success" | "error"
  >("idle");
  const [cardNumber, setCardNumber] = useState("");
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== PARENT_ORIGIN) return;
      if (
        event.data.type === "INIT" &&
        typeof event.data.productId === "string" &&
        event.data.productId.trim() !== ""
      ) {
        console.log(event.data);
        setProduct(event.data);
      }
    };

    window.addEventListener("message", handleMessage);

    window.parent.postMessage(
      {
        type: "READY",
      },
      PARENT_ORIGIN,
    );

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleClose = () => {
    window.parent.postMessage(
      {
        type: "CLOSE",
        reason: "user_closed",
      },
      PARENT_ORIGIN,
    );
  };

  const handlePay = () => {
    if (cardNumber.trim() === "") {
      setCardError("Card number cannot be empty");
      return;
    }
    if (cardNumber.length !== 19) {
      setCardError("Card number must be 16 digits");
      return;
    }

    setPaymentStatus("process");

    window.parent.postMessage(
      {
        type: "PROCESSING",
      },
      PARENT_ORIGIN,
    );

    setPaymentStatus("process");
    setTimeout(() => {
      switch (cardNumber) {
        case "4242 4242 4242 4242":
          setPaymentStatus("success");

          window.parent.postMessage(
            {
              type: "SUCCESS",
              sessionId: crypto.randomUUID(),
              message: "Payment made successfully",
            },
            PARENT_ORIGIN,
          );
          break;
        case "4000 0000 0000 0002":
          setPaymentStatus("error");

          window.parent.postMessage(
            {
              type: "ERROR",
              code: "CARD_DECLINED",
              message: "Your card was declined",
            },
            PARENT_ORIGIN,
          );
          break;
        case "4000 0000 0000 0341":
          if (!hasFailedOnce) {
            setPaymentStatus("error");
            window.parent.postMessage(
              {
                type: "ERROR",
                code: "CARD_DECLINED",
                message: "Your card was declined",
              },
              PARENT_ORIGIN,
            );
            setHasFailedOnce(true);
          } else {
            setPaymentStatus("success");
            window.parent.postMessage(
              {
                type: "SUCCESS",
                sessionId: crypto.randomUUID(),
                message: "Payment made successfully",
              },
              PARENT_ORIGIN,
            );
            setHasFailedOnce(false);
          }
          break;
        default:
          setPaymentStatus("error");
          window.parent.postMessage(
            {
              type: "ERROR",
              code: "INVALID_CARD_DETAILS",
              message: "Please enter valid card details",
            },
            PARENT_ORIGIN,
          );
      }
    }, 2000);
  };

  const handleCardChange = (value: string) => {
    setCardError("");
    const numbers = value.replace(/\D/g, "").slice(0, 16);

    const formatted = numbers.replace(/(.{4})/g, "$1 ").trim();

    setCardNumber(formatted);
  };

  return (
    <div className=" bg-white p-2 text-gray-900">
      <div className="mb-4">
        <div className="absolute right-0 cursor-pointer" onClick={handleClose}>
          <XIcon />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Dodo Checkout</h1>

        {product ? (
          <p className="mt-1 text-sm text-gray-500">
            Product Name: {product?.productName}
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-400">Waiting for checkout...</p>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 gap-2 text-sm flex items-center font-medium text-gray-700">
            Card number <CreditCard size={20} />
          </label>

          <input
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChange={(e) => handleCardChange(e.target.value)}
            className={`
          w-full
          rounded-md
          
          bg-white
          px-2 py-1.5
          text-sm
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-gray-900
          focus:ring-1
          focus:ring-gray-900
          ${cardError ? "border border-red-300" : "border border-gray-300"}
        `}
          />
          {cardError && (
            <p className="mt-1 text-xs text-red-600">{cardError}</p>
          )}
        </div>

        <button
          disabled={paymentStatus === "process"}
          onClick={handlePay}
          className="
        w-full
        rounded-md
        bg-black
        px-4 py-2.5
        text-sm
        font-medium
        text-white
        transition
        hover:bg-gray-800
        disabled:cursor-not-allowed
        disabled:opacity-50
        cursor-pointer
        flex items-center
        justify-center
      "
        >
          {paymentStatus === "process" ? (
            <div className="flex items-center justify-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span>{hasFailedOnce ? "Retry" : "Processing..."}</span>
            </div>
          ) : hasFailedOnce ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCcw size={16} />
              <span>Retry</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Pay ₹{product?.productAmount}</span>
            </div>
          )}
        </button>

        <button
          onClick={handleClose}
          className="
        w-full
        text-sm
        font-medium
        text-gray-500
        transition
        hover:text-gray-900
         cursor-pointer
         border border-gray-300 py-2
         rounded-md
      "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Checkout;
