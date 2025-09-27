import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { SavingsEntry } from "./types";

const COLLECTION_NAME = "savings-entries";

export async function saveSavingsEntries(
  entries: SavingsEntry[]
): Promise<void> {
  // This function is no longer needed with Firestore, but kept for compatibility
}

export async function loadSavingsEntries(): Promise<SavingsEntry[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const entries: SavingsEntry[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        assetType: data.assetType,
        usdAmount: data.usdAmount || 0,
        goldGrams: data.goldGrams || 0,
        goldKarat: data.goldKarat,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return entries;
  } catch (error) {
    // Fallback to localStorage if Firestore fails
    return loadSavingsEntriesLocal();
  }
}

export async function addSavingsEntryFirestore(
  entry: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    // Validate entry data before sending to Firebase
    if (entry.assetType === "currency" && entry.usdAmount <= 0) {
      throw new Error("USD amount must be greater than 0");
    }
    if (entry.assetType === "gold" && entry.goldGrams <= 0) {
      throw new Error("Gold amount must be greater than 0");
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    // Try localStorage as fallback for certain errors
    if (error.code === "permission-denied" || error.code === "unavailable") {
      const localId = addSavingsEntryLocal(entry);
      throw new Error(
        "Data saved locally (Firebase unavailable). Your data is safe but not synced to cloud."
      );
    }

    // Provide more specific error messages for other errors
    if (error.code === "unauthenticated") {
      throw new Error("Authentication required: Please sign in");
    } else {
      throw new Error(
        `Firebase error: ${error.message || "Unknown error occurred"}`
      );
    }
  }
}

export async function deleteSavingsEntryFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    // Fallback to localStorage if Firestore fails
    deleteSavingsEntryLocal(id);
  }
}

function loadSavingsEntriesLocal(): SavingsEntry[] {
  try {
    const stored = localStorage.getItem("savings-entries");
    if (!stored) return [];

    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return [];
  }
}

function addSavingsEntryLocal(
  entry: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">
): string {
  const entries = loadSavingsEntriesLocal();
  const newEntry: SavingsEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  entries.unshift(newEntry);
  localStorage.setItem("savings-entries", JSON.stringify(entries));
  return newEntry.id!;
}

function deleteSavingsEntryLocal(id: string): void {
  const entries = loadSavingsEntriesLocal();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem("savings-entries", JSON.stringify(filtered));
}

export const addSavingsEntry = addSavingsEntryFirestore;
export const deleteSavingsEntry = deleteSavingsEntryFirestore;
