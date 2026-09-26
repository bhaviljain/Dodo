let currentCheckout = null;
let iframe = null;
export const DodoCheckout = {
    open(options) {
        console.log(options.productId);
        currentCheckout = options;
        iframe = document.createElement("iframe");
        window.addEventListener("message", (event) => {
            console.log(event);
        });
        iframe.src = "http://localhost:3001";
        document.body.append(iframe);
        // iframe.contentWindow?.postMessage(options.productId)
    },
};
//# sourceMappingURL=dodo-payments.js.map