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
  console.log("[v0] saveSavingsEntries called but not needed with Firestore");
}

export async function loadSavingsEntries(): Promise<SavingsEntry[]> {
  try {
    console.log("[v0] Loading savings entries from Firestore");
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

    console.log("[v0] Loaded entries from Firestore:", entries);
    return entries;
  } catch (error) {
    console.error("[v0] Error loading from Firestore:", error);
    // Fallback to localStorage if Firestore fails
    return loadSavingsEntriesLocal();
  }
}

export async function addSavingsEntryFirestore(
  entry: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    console.log("[v0] Adding savings entry to Firestore:", entry);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("[v0] Entry added to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[v0] Error adding to Firestore:", error);
    // Fallback to localStorage if Firestore fails
    return addSavingsEntryLocal(entry);
  }
}

export async function deleteSavingsEntryFirestore(id: string): Promise<void> {
  try {
    console.log("[v0] Deleting entry from Firestore:", id);
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log("[v0] Entry deleted from Firestore");
  } catch (error) {
    console.error("[v0] Error deleting from Firestore:", error);
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
