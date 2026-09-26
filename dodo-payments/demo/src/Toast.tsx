import { XIcon } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  type: "success" | "error";
  message: string;
  onDismiss: () => void;
};

const Toast = (props: ToastProps) => {
  const { type, message, onDismiss } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 20px",
        borderRadius: "8px",
        backgroundColor: "black",
        color: "white",
        minWidth: "280px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              type === "success" ? "bg-green-700" : "bg-red-700"
            }`}
          />

          <span>{message}</span>
        </div>

        <button
          onClick={onDismiss}
          className="cursor-pointer text-white/70 transition hover:text-white"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
