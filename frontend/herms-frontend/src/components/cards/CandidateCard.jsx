import { CalendarCheck, Star, User, Bookmark } from "lucide-react";
import Button from "../common/Button";

export function CandidatePreviewCard({ id, role, matchPercent, rating, availability }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <User className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">{id}</p>
          <p className="text-sm font-semibold text-primary-500">{matchPercent}%</p>
        </div>
        <p className="text-xs text-gray-500">{role}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="size-3.5 fill-accent-amber-400 text-accent-amber-400" />
            {rating}
          </span>
          <span className="text-xs font-medium text-primary-500">Available</span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <CalendarCheck className="size-3.5" />
          {availability}
        </p>
      </div>
    </div>
  );
}

export default function CandidateCard({
  id,
  name,
  profession_number,
  skills,
  availability,
  location,
  onViewDetails,
    isShortlisted,
    onToggleShortlist,
    ...rest
}) {
  return (
      <div className="...">
    <div className="flex flex-col gap-4 border-b border-gray-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <User className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <div className="mt-1 grid grid-cols-1 gap-x-8 gap-y-1 text-xs text-gray-500 sm:grid-cols-3">
            <span>
              <span className="text-gray-400">Profession number </span>
              <br />
              {profession_number}
            </span>
            <span>
              <span className="text-gray-400">Skills</span>
              <br />
              {skills}
            </span>
            <span>
              <span className="text-gray-400">Availability</span>
              <br />
              {availability}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button variant="secondary" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
        <button
            type="button"
            onClick={onToggleShortlist}
            className={[
              "flex size-9 items-center justify-center rounded-lg border hover:bg-gray-50",
              isShortlisted
                  ? "border-primary-500 bg-primary-50 text-primary-600"
                  : "border-gray-200 text-gray-400",
            ].join(" ")}
        >
          <Bookmark className={isShortlisted ? "size-4 fill-current" : "size-4"} />
        </button>
      </div>
    </div>
      </div>
  );
}

