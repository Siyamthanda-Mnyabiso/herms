import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import CandidateCard from "../../components/cards/CandidateCard";

const CANDIDATES = [];

export default function BrowseCandidates() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Browse Professionals</h1>

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <SearchBar placeholder="Search by skills, qualifications..." />
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Profession"
            options={[{ value: "all", label: "All" }]}
            containerClassName="w-40"
          />
          <Select
            label="Location"
            options={[{ value: "all", label: "All" }]}
            containerClassName="w-40"
          />
          <Select
            label="Availability"
            options={[{ value: "all", label: "All" }]}
            containerClassName="w-44"
          />
          <Button variant="secondary" icon={SlidersHorizontal} iconPosition="left" size="md">
            More Filters
          </Button>
          <button type="button" className="pb-2.5 text-sm font-medium text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-2 text-sm text-gray-500">{CANDIDATES.length} professionals found</p>
        <div>
          {CANDIDATES.map((candidate) => (
            <CandidateCard key={candidate.id} {...candidate} />
          ))}
        </div>
      </div>

      <Pagination page={page} totalPages={1} onPageChange={setPage} />
    </div>
  );
}
