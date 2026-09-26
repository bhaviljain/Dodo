type CheckOutOptions = {
    productId: string;
    productName: string;
    productAmount: number;
    onProcessing?: (processing: boolean) => void;
    onSuccess: (data: {
        sessionId: string;
        message: string;
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