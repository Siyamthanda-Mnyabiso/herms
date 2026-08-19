import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorMessage({
                                         title = "Something went wrong",
                                         message = "We couldn't load this. Please try again.",
                                         onRetry,
                                         className = "",
                                     }) {
    return (
        <div
            role="alert"
            className={[
                "flex flex-col items-center gap-3 rounded-2xl border border-status-declined/20 bg-status-declined/5 px-6 py-10 text-center",
                className,
            ].join(" ")}
        >
      <span className="flex size-12 items-center justify-center rounded-full bg-status-declined/10 text-status-declined">
        <AlertCircle className="size-6" />
      </span>
            <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <RotateCcw className="size-3.5" />
                    Try again
                </button>
            )}
        </div>
    );
}