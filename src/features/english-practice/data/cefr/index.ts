import type { Flashcard } from "../../types";
import { CEFR_A1 } from "./a1";
import { CEFR_A2 } from "./a2";
import { CEFR_B1 } from "./b1";
import { CEFR_B2 } from "./b2";
import { CEFR_C1 } from "./c1";

/** All CEFR-tagged vocabulary added on top of the original decks (before de-duplication). */
export const CEFR_VOCABULARY: Flashcard[] = [...CEFR_A1, ...CEFR_A2, ...CEFR_B1, ...CEFR_B2, ...CEFR_C1];
