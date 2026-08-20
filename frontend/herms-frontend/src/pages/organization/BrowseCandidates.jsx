import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import CandidateCard from "../../components/cards/CandidateCard";
import { getProfessionalsByType } from "../../services/staffService";

const PROFESSION_KEYWORDS = ["nurse", "doctor", "teacher", "pharmacist"];

const PROVINCES = [
    { value: "all", label: "All" },
    { value: "EC", label: "Eastern Cape" },
    { value: "FS", label: "Free State" },
    { value: "GP", label: "Gauteng" },
    { value: "KZN", label: "KwaZulu-Natal" },
    { value: "LP", label: "Limpopo" },
    { value: "MP", label: "Mpumalanga" },
    { value: "NC", label: "Northern Cape" },
    { value: "NW", label: "North West" },
    { value: "WC", label: "Western Cape" },
];

export default function BrowseCandidates() {
    const [page, setPage] = useState(1);
    const [profession, setProfession] = useState("nurse");
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("all");
    const [availability, setAvailability] = useState("all");

    const searchMatchedProfession = PROFESSION_KEYWORDS.find(
        (p) => p === searchTerm.trim().toLowerCase()
    );
    const activeProfession = searchMatchedProfession || profession;

    useEffect(() => {
        if (!activeProfession || activeProfession === "all") {
            setCandidates([]);
            return;
        }

        setLoading(true);
        getProfessionalsByType(activeProfession)
            .then((data) => {
                const mapped = data.map((person) => ({
                    id: person.personId,
                    name: `Candidate #${String(person.personId).padStart(3, "0")}`,
                    qualification: person.qualification ?? "—",
                    skills: person.specialization ?? "—",
                    availabilityStatus: person.availabilityStatus ?? "NOT_AVAILABLE",
                    availability:
                        person.availabilityStatus === "AVAILABLE"
                            ? "Available"
                            : "Not Available",
                    dates: "—",
                    location: person.address?.city ?? "—",
                    province: person.address?.province ?? "—",
                    experience: person.yearsOfExperience
                        ? `${person.yearsOfExperience} years`
                        : "—",
                }));
                setCandidates(mapped);
            })
            .catch((err) => {
                console.error("Failed to load professionals:", err);
                setCandidates([]);
            })
            .finally(() => setLoading(false));
    }, [activeProfession]);

    const filteredCandidates = candidates.filter((c) => {
        const term = searchTerm.trim().toLowerCase();

        const matchesSearch =
            !term ||
            searchMatchedProfession ||
            c.qualification.toLowerCase().includes(term) ||
            c.skills.toLowerCase().includes(term) ||
            c.name.toLowerCase().includes(term);

        const matchesLocation =
            location === "all" || c.province === location;

        const matchesAvailability =
            availability === "all" || c.availabilityStatus === availability;

        return matchesSearch && matchesLocation && matchesAvailability;
    });

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold text-gray-900">Browse Professionals</h1>

            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <SearchBar
                    placeholder="Search by skills, qualifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex flex-wrap items-end gap-3">
                    <Select
                        label="Profession"
                        options={[
                            { value: "nurse", label: "Nurse" },
                            { value: "doctor", label: "Doctor" },
                            { value: "teacher", label: "Teacher" },
                            { value: "pharmacist", label: "Pharmacist" },
                        ]}
                        value={profession}
                        onChange={(valueOrEvent) => {
                            const value =
                                typeof valueOrEvent === "string"
                                    ? valueOrEvent
                                    : valueOrEvent?.target?.value;
                            if (value) setProfession(value);
                        }}
                        containerClassName="w-40"
                    />

                    <Select
                        label="Location"
                        options={PROVINCES}
                        value={location}
                        onChange={(valueOrEvent) => {
                            const value =
                                typeof valueOrEvent === "string"
                                    ? valueOrEvent
                                    : valueOrEvent?.target?.value;
                            if (value) setLocation(value);
                        }}
                        containerClassName="w-44"
                    />

                    <Select
                        label="Availability"
                        options={[
                            { value: "all", label: "All" },
                            { value: "AVAILABLE", label: "Available" },
                            { value: "NOT_AVAILABLE", label: "Not Available" },
                        ]}
                        value={availability}
                        onChange={(valueOrEvent) => {
                            const value =
                                typeof valueOrEvent === "string"
                                    ? valueOrEvent
                                    : valueOrEvent?.target?.value;
                            if (value) setAvailability(value);
                        }}
                        containerClassName="w-44"
                    />

                    <Button
                        variant="secondary"
                        icon={SlidersHorizontal}
                        iconPosition="left"
                        size="md"
                    >
                        More Filters
                    </Button>

                    <button
                        type="button"
                        className="pb-2.5 text-sm font-medium text-gray-400 hover:text-gray-600"
                        onClick={() => {
                            setSearchTerm("");
                            setProfession("nurse");
                            setLocation("all");
                            setAvailability("all");
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="mb-2 text-sm text-gray-500">
                    {loading
                        ? "Loading..."
                        : `${filteredCandidates.length} professionals found`}
                </p>

                <div>
                    {!loading && filteredCandidates.length === 0 && (
                        <p className="text-sm text-gray-400">No professionals found.</p>
                    )}

                    {filteredCandidates.map((candidate) => (
                        <CandidateCard key={candidate.id} {...candidate} />
                    ))}
                </div>
            </div>

            <Pagination page={page} totalPages={1} onPageChange={setPage} />
        </div>
    );
}