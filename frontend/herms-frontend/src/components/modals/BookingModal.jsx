import { useMemo, useState } from "react";
import { X, User, ShieldCheck } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

function daysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    const ms = new Date(endDate) - new Date(startDate);
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

// `candidate` is the anonymized card data from Browse Professionals
// (id/label, role, qualifications, rate) - never the professional's real
// name. The organization only learns who they booked once the professional
// accepts the request.
export default function BookingModal({ open, candidate, onClose, onSubmit }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [notes, setNotes] = useState("");

    const duration = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);
    const canSubmit = candidate && startDate && endDate && duration > 0;

    if (!open || !candidate) return null;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSubmit?.({
            candidateLabel: candidate.id ?? candidate.candidateLabel,
            role: candidate.role,
            qualifications: candidate.qualifications,
            startDate,
            endDate,
            duration: `${duration} day${duration === 1 ? "" : "s"}`,
            rate: candidate.rate,
            notes,
        });
        setStartDate("");
        setEndDate("");
        setNotes("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold text-gray-900">Send Booking Request</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <User className="size-5" />
          </span>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {candidate.id ?? candidate.candidateLabel}
                        </p>
                        <p className="text-xs text-gray-500">{candidate.role}</p>
                    </div>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-xs text-primary-700">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                    <p>Their identity stays private until they accept your request.</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <Input
                        type="date"
                        label="Start date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        label="End date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {duration > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                        Duration: <span className="font-medium text-gray-700">{duration} day{duration === 1 ? "" : "s"}</span>
                        {candidate.rate ? ` · ${candidate.rate}` : ""}
                    </p>
                )}

                <label className="mt-4 flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-gray-700">Notes (optional)</span>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        placeholder="Shift details, ward, anything they should know upfront"
                    />
                </label>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="amber" size="sm" disabled={!canSubmit} onClick={handleSubmit}>
                        Send Request
                    </Button>
                </div>
            </div>
        </div>
    );
}
