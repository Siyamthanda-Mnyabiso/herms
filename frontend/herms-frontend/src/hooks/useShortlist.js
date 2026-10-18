import { useContext } from "react";
import { ShortlistContext } from "../context/objects/shortlist.js";

export function useShortlist() {
    return useContext(ShortlistContext);
}
