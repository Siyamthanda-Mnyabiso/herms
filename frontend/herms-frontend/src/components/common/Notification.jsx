export default function Notification({ message, type = "error", onClose }) {
    if (!message) return null;

    const styles = {
        error: "bg-status-declined-bg text-status-declined border-status-declined/20",
        success: "bg-status-accepted-bg text-status-accepted border-status-accepted/20",
    };

    return (
        <div
            role="alert"
            className={[
                "fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2",                styles[type],
            ].join(" ")}
        >
            <span>{message}</span>
            <button
                type="button"
                onClick={onClose}
                className="ml-2 text-current opacity-60 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
}