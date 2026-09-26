type CheckOutOptions = {
    productId: string;
    onSuccess: (data: {
        sessionId: string;
    }) => void;
    onClose: (data: {
        reason: "user_closed";
    }) => void;
    onError: (data: {
        code: string;
        message: string;
    }) => void;
};
export declare const DodoCheckout: {
    open(options: CheckOutOptions): void;
};
export {};
//# sourceMappingURL=dodo-payments.d.ts.map