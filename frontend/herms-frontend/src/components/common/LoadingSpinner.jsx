export default function LoadingSpinner({ className = "" }) {
    return (
        <div className={["flex items-center justify-center py-10", className].join(" ")}>
            <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
        </div>
    );
}