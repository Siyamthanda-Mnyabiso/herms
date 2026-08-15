import { useState } from "react";
import { Lightbulb } from "lucide-react";
import Button from "../../components/common/Button";

const TABS = [
  { key: "all", label: "All Requests", count: 0 },
  { key: "pending", label: "Pending", count: 0 },
  { key: "accepted", label: "Accepted", count: 0 },
  { key: "declined", label: "Declined", count: 0 },
  { key: "expired", label: "Expired", count: 0 },
];

const REQUESTS = [];

export default function BookingRequest() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Booking Requests</h1>

      <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary-50 text-primary-600"
                : "text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {REQUESTS.map((request) => (
          <div key={request.org} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{request.org}</p>
                <p className="text-xs text-gray-500">{request.role}</p>
              </div>
              <span className="text-xs font-medium text-status-declined">{request.timeLeft}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-400">Dates</p>
                <p className="text-gray-700">{request.dates}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-gray-700">{request.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rate</p>
                <p className="text-gray-700">{request.rate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Requested</p>
                <p className="text-gray-700">{request.requested}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="secondary" size="sm">
                Decline
              </Button>
              <Button variant="amber" size="sm">
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
        <Lightbulb className="mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-medium">Tip:</span> You have 24 hours to respond to booking requests.
          If you don't respond, the request will expire and move to the next candidate.
        </p>
      </div>
    </div>
  );
}
