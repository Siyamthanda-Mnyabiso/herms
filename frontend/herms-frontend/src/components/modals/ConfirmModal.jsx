import { useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";

export default function ConfirmModal({
                                         open,
                                         title = "Are you sure?",
                                         description,
                                         confirmLabel = "Confirm",
                                         cancelLabel = "Go back",
                                         variant = "danger",
                                         requireReason = false,
                                         reasonLabel = "Reason",
                                         onConfirm,
                                         onClose,
                                     }) {
    const [reason, setReason] = useState("");

    if (!open) return null;

    const handleConfirm = () => {
        onConfirm?.(requireReason ? reason : undefined);
        setReason("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}

                {requireReason && (
                    <label className="mt-4 flex flex-col gap-1.5 text-sm">
                        <span className="font-medium text-gray-700">{reasonLabel}</span>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            placeholder="Let them know why (optional)"
                        />
                    </label>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        {cancelLabel}
                    </Button>
                    <Button variant={variant} size="sm" onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
