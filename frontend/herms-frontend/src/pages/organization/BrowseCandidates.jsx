import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import CandidateCard from "../../components/cards/CandidateCard";
import { getProfessionalsByType } from "../../services/staffService";
import { createBooking } from "../../services/bookingService";
import { useNotification } from "../../context/NotificationContext";
import { useShortlist } from "../../context/ShortlistContext";

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
    const [selectedCandidate, setSelectedCandidate] = useState(null); // NEW
    const { notify } = useNotification();
    const { isShortlisted, toggleShortlist } = useShortlist();


    const searchMatchedProfession = PROFESSION_KEYWORDS.find(
        (p) => p === searchTerm.trim().toLowerCase()
    );
    const activeProfession = searchMatchedProfession || profession;

    function mapPeople(data, professionType) {
        return data.map((person) => ({
            id: person.personId,
            name: `Candidate #${String(person.personId).padStart(3, "0")}`,
            profession_number: person.licenseNo ?? "—",
            qualification: person.qualification ?? "—",
            skills: person.specialization ?? "—",
            availabilityStatus: person.availabilityStatus ?? "NOT_AVAILABLE",
            availability:
                person.availabilityStatus === "AVAILABLE" ? "Available" : "Not Available",
            dates: "—",
            location: person.address?.city ?? "—",
            province: person.address?.province ?? "—",
            experience: person.yearsOfExperience
                ? `${person.yearsOfExperience} years`
                : "—",
            profession: professionType,
        }));
    }

    function handleError(err) {
        console.error("Failed to load professionals:", err);
    }
    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        const isProfessionSearch = PROFESSION_KEYWORDS.includes(term);

        if (isProfessionSearch) {
            setLoading(true);
            getProfessionalsByType(term)
                .then(mapAndSet)
                .catch(handleError)
                .finally(() => setLoading(false));
            return;
        }

        const shouldSearchAll =
            term.length > 0 || location !== "all" || availability !== "all";

        setLoading(true);

        if (shouldSearchAll) {
            Promise.all([
                getProfessionalsByType("nurse"),
                getProfessionalsByType("doctor"),
                getProfessionalsByType("teacher"),
                getProfessionalsByType("pharmacist"),
            ])
                .then(([nurses, doctors, teachers, pharmacists]) => {
                    const all = [
                        ...mapPeople(nurses, "nurse"),
                        ...mapPeople(doctors, "doctor"),
                        ...mapPeople(teachers, "teacher"),
                        ...mapPeople(pharmacists, "pharmacist"),
                    ];
                    setCandidates(all);
                })
                .catch(handleError)
                .finally(() => setLoading(false));
        } else {
            getProfessionalsByType(profession)
                .then((data) => {
                    setCandidates(mapPeople(data, profession));
                })
                .catch(handleError)
                .finally(() => setLoading(false));
        }
    }, [profession, searchTerm, location, availability]);


    const filteredCandidates = candidates.filter((c) => {
        const term = searchTerm.trim().toLowerCase();

        const matchesSearch =
            !term ||
            !!searchMatchedProfession ||
            [c.skills, c.qualification, c.name, c.profession_number,c.location]
                .some((field) => field?.toLowerCase().includes(term));

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
                        <CandidateCard
                            key={candidate.id}
                            {...candidate}
                            onViewDetails={() => setSelectedCandidate(candidate)}
                            isShortlisted={isShortlisted(candidate.id)}
                            onToggleShortlist={() => {
                                toggleShortlist(candidate);
                                notify(
                                    isShortlisted(candidate.id)
                                        ? "Removed from shortlist"
                                        : "Added to shortlist",
                                    "success"
                                );
                            }}
                        />
                    ))}
                </div>
            </div>

            <Pagination page={page} totalPages={1} onPageChange={setPage} />

            {/* view candidate details modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedCandidate.name}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelectedCandidate(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <dl className="flex flex-col gap-3 text-sm">
                            <div>
                                <dt className="text-gray-400">Profession</dt>
                                <dd className="font-medium text-gray-900 capitalize">
                                    {selectedCandidate.profession}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Profession number</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.profession_number}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Qualification</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.qualification}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Skills / Specialization</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.skills}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Experience</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.experience}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Availability</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.availability}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-400">Location</dt>
                                <dd className="font-medium text-gray-900">
                                    {selectedCandidate.location}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setSelectedCandidate(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={async () => {
                                    try {
                                        const today = new Date();
                                        const future = new Date();
                                        future.setDate(today.getDate() + 7);
                                        await createBooking(
                                            selectedCandidate.id,
                                            today.toISOString().split("T")[0],
                                            future.toISOString().split("T")[0]
                                        );
                                        notify("Booking request sent!", "success");
                                        setSelectedCandidate(null);
                                    } catch (err) {
                                        console.error("Failed to create booking:", err);
                                        notify("Couldn't send booking request. Please try again.", "error");
                                    }
                                }}
                            >
                                Book
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}