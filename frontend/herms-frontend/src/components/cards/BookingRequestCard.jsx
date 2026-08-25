import { User } from "lucide-react";
import Button from "../common/Button";

export default function BookingRequestCard({
                                               org,
                                               role,
                                               timeLeft,
                                               dates,
                                               duration,
                                               rate,
                                               requested,
                                               onAccept,
                                               onDecline,
                                           }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <User className="size-4" />
          </span>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{org}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>
                </div>
                <span className="text-xs font-medium text-status-declined">{timeLeft}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                    <p className="text-xs text-gray-400">Dates</p>
                    <p className="text-gray-700">{dates}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-gray-700">{duration}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Rate</p>
                    <p className="text-gray-700">{rate}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Requested</p>
                    <p className="text-gray-700">{requested}</p>
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <Button variant="secondary" size="sm" onClick={onDecline}>
                    Decline
                </Button>
                <Button variant="amber" size="sm" onClick={onAccept}>
                    Accept
                </Button>
            </div>
        </div>
    );
}