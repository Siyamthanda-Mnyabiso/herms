import { useShortlist } from "../../context/ShortlistContext";
import CandidateCard from "../../components/cards/CandidateCard";

export default function Shortlisted() {
    const { shortlisted, isShortlisted, toggleShortlist } = useShortlist();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold text-gray-900">Shortlisted</h1>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                {shortlisted.length === 0 ? (
                    <p className="text-sm text-gray-400">No professionals shortlisted yet.</p>
                ) : (
                    shortlisted.map((candidate) => (
                        <CandidateCard
                            key={candidate.id}
                            {...candidate}
                            isShortlisted={isShortlisted(candidate.id)}
                            onToggleShortlist={() => toggleShortlist(candidate)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}