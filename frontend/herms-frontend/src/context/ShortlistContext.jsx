import { useState, useCallback } from "react";
import { ShortlistContext } from "./objects/shortlist.js";

export function ShortlistProvider({ children }) {
    const [shortlisted, setShortlisted] = useState([]);

    const isShortlisted = useCallback(
        (id) => shortlisted.some((c) => c.id === id),
        [shortlisted]
    );

    const toggleShortlist = useCallback((candidate) => {
        setShortlisted((prev) =>
            prev.some((c) => c.id === candidate.id)
                ? prev.filter((c) => c.id !== candidate.id)
                : [...prev, candidate]
        );
    }, []);

    return (
        <ShortlistContext.Provider value={{ shortlisted, isShortlisted, toggleShortlist }}>
            {children}
        </ShortlistContext.Provider>
    );
}
