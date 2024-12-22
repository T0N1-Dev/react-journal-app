import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { types } from "../types/types"
import { loadNotes } from "../helpers/loadNotes";
import Swal from "sweetalert2";
import { fileUpload } from "../helpers/fileUpload";

export const startNewNote = () => {
    return async ( dispatch, getState ) => {

        const uid = getState().auth.uid;
        
        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }

        Swal.fire({
            title: 'Adding...',
            text: 'Please wait...', 
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            const docRef = await addDoc(collection(db, `${uid}/journal/notes`), newNote);
            const noteWithId = { id: docRef.id, ...newNote };
            dispatch( activeNote( docRef.id, newNote ));
            dispatch(addNoteToState(noteWithId));
        } catch (error) {
            Swal.fire('Error al añadir la nueva nota:', error, 'error');
        } finally {
            Swal.close();
        }
    }
};

export const activeNote = ( id, note) => ({
    type: types.notesActive,
    payload: {
        id,
        ...note
    }
});

export const addNoteToState = (note) => ({
    type: types.noteAdded,
    payload: note
});

export const startLoadingNotes = (uid) => {
    return async (dispatch) => {
        const notes = await loadNotes( uid );
        dispatch(setNotes(notes));
    }
}

export const setNotes = ( notes ) => ({
    type: types.notesLoad,
    payload: notes
});

export const startSaveNote = ( note ) => {
    return async ( dispatch, getState ) => {
        const { uid } = getState().auth;

        const noteToFirestore = { ...note };
        delete noteToFirestore.id;

        try {
            const notRef = doc(db, `${uid}/journal/notes/${note.id}`);
            await updateDoc(notRef, noteToFirestore);
            dispatch( refreshNote(note.id, noteToFirestore ));
            dispatch( activeNote(note.id, noteToFirestore));
            Swal.fire('Nota actualizada correctamente', note.title, 'success');
        } catch (error) {
            Swal.fire('Error al actualizar la nota:', error, 'error');
        }
    }
}

export const refreshNote = ( id, note ) => ({
    type: types.notesUpdated,
    payload: {
        id, 
        note: {
            id,
            ...note
        }
    }
});

export const startUploading = (file) => {
    return async (dispatch, getState) => {
        const { active: activeNote } = getState().notes;

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait...', 
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
            
        });

        try {
            const fileUrl = await fileUpload( file );

            const updatedNote = {
                ...activeNote,
                url: fileUrl
            };
            dispatch( startSaveNote( updatedNote ));
        } catch (error) {
            Swal.fire('Error', 'Failed to upload the file', 'error');
        } finally {
            Swal.close();
        }
    }
}

export const startDeleting = ( id ) => {
    return (dispatch, getState) => {
         const { uid } = getState().auth;
         const notRef = doc(db, `${uid}/journal/notes/${id}`);
         
         try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        timer: 1000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    await deleteDoc(notRef);
                    dispatch( deleteNote(id) );
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your note has been deleted.",
                        icon: "success"
                    });
                }
              });
        } catch (e) {
            Swal.fire('Ha ocurrido un error durante la eliminación de la nota', e, 'error');
        }
         
    };
};

export const deleteNote = (id) => ({
    type: types.notesDelete,
    payload: id
});

export const noteLogout = () => ({
    type: types.notesLogoutCleaning
})
