import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore"
import { db } from "./firebase"
import type { SavingsEntry } from "./types"

const COLLECTION_NAME = "savings"

export async function addSavingsEntry(entry: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding savings entry:", error)
    throw error
  }
}

export async function getSavingsEntries(): Promise<SavingsEntry[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as SavingsEntry[]
  } catch (error) {
    console.error("Error getting savings entries:", error)
    return []
  }
}

export async function updateSavingsEntry(id: string, entry: Partial<SavingsEntry>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...entry,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating savings entry:", error)
    throw error
  }
}

export async function deleteSavingsEntry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error("Error deleting savings entry:", error)
    throw error
  }
}
