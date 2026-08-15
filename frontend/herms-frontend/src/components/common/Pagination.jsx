import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, 2, current - 1, current, current + 1, total]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withGaps = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) withGaps.push("...");
    withGaps.push(page);
  });
  return withGaps;
}

export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  const pages = getPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        className="flex size-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="flex size-8 items-center justify-center text-gray-400">
            ...
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange?.(p)}
            className={[
              "flex size-8 items-center justify-center rounded-md font-medium",
              p === page
                ? "bg-accent-amber-400 text-sidebar"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        className="flex size-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
