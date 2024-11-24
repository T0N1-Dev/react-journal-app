import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"


export const loadNotes = async ( uid ) => {
    
    const notesCollectionRef = collection(db, `${uid}/journal/notes`);
    const q = query(notesCollectionRef, orderBy("date", "desc"));

    const notesSnap = await getDocs(q);

    const notes = [];

    notesSnap.forEach((doc) => {
        notes.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    return notes;
}