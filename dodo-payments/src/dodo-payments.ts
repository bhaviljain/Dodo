import { CHECKOUT_ORIGIN } from "./config.js";

type CheckOutOptions = {
  productId: string;
  productName: string;
  productAmount: number;
  onProcessing?: (processing: boolean) => void;
  onSuccess: (data: { sessionId: string; message: string }) => void;
  onClose: (data: { reason: "user_closed" }) => void;
  onError: (data: { code: string; message: string }) => void;
};

let currentCheckout: CheckOutOptions | null = null;

let iframe: HTMLIFrameElement | null = null;

let overlay: HTMLDivElement | null = null;

const handleMessage = (event: MessageEvent) => {
  if (event.origin !== CHECKOUT_ORIGIN) return;
  if (typeof event.data !== "object" || event.data === null) return;

  if (event.data.type === "READY") {
    if (!currentCheckout) return;
    iframe?.contentWindow?.postMessage(
      {
        type: "INIT",
        productId: currentCheckout.productId,
        productName: currentCheckout.productName,
        productAmount: currentCheckout.productAmount,
      },
      CHECKOUT_ORIGIN,
    );
  }

  if (event.data.type === "CLOSE" && event.data.reason === "user_closed") {
    currentCheckout?.onClose({ reason: "user_closed" });
    cleanUp();
  }

  if (event.data.type === "PROCESSING") {
    currentCheckout?.onProcessing?.(true);
  }

  if (
    event.data.type === "SUCCESS" &&
    typeof event.data.sessionId === "string"
  ) {
    currentCheckout?.onSuccess({
      sessionId: event.data.sessionId,
      message: event.data.message,
    });
    cleanUp();
  }
  if (
    event.data.type === "ERROR" &&
    typeof event.data.code === "string" &&
    typeof event.data.message === "string"
  ) {
    currentCheckout?.onError({
      code: event.data.code,
      message: event.data.message,
    });
  }
};

const cleanUp = () => {
  window.removeEventListener("message", handleMessage);
  iframe?.remove();
  currentCheckout = null;
  iframe = null;
  overlay?.remove();
  overlay = null;
};

export const DodoCheckout = {
  open(options: CheckOutOptions) {
    if (
      typeof options.onSuccess !== "function" ||
      typeof options.onClose !== "function" ||
      typeof options.onError !== "function"
    )
      return;
    if (iframe) {
      return;
    }
    if (!options.productId) return;
    currentCheckout = options;
    iframe = document.createElement("iframe");
    const loading = document.createElement("div");

    loading.innerText = "Loading checkout...";
    loading.style.position = "fixed";
    loading.style.top = "50%";
    loading.style.left = "50%";
    loading.style.transform = "translate(-50%, -50%)";
    loading.style.zIndex = "10000";

    overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "#000000";
    overlay.style.opacity = "0.5";
    overlay.style.zIndex = "9998";

    iframe.addEventListener("load", () => {
      loading.remove();
    });

    iframe.title = "Dodo Checkout";

    iframe.style.position = "fixed";
    iframe.style.top = "50%";
    iframe.style.left = "50%";
    iframe.style.transform = "translate(-50%, -50%)";

    iframe.style.width = "420px";
    iframe.style.height = "56vh";
    iframe.style.padding = "20px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "12px";
    iframe.style.zIndex = "9999";
    iframe.style.background = "#ffffff";
    iframe.src = CHECKOUT_ORIGIN;

    window.addEventListener("message", handleMessage);

    document.body.append(overlay);
    document.body.append(iframe);
    document.body.append(loading)
    // iframe.contentWindow?.postMessage(options.productId)
  },
};
