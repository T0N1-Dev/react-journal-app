import { collection, deleteDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { configureStore } from '@reduxjs/toolkit';
import { activeNote, startLoadingNotes, startNewNote, startSaveNote, startUploading } from '../../actions/notes';
import { notesReducer } from '../../reducers/notesReducer';
import Swal from 'sweetalert2';
import { db } from '../../firebase/firebaseConfig';
import { fileUpload } from '../../helpers/fileUpload';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
    showLoading: jest.fn(),
    close: jest.fn()
}));

jest.mock('../../helpers/fileUpload', () => ({
    fileUpload: jest.fn(),
}))

jest.setTimeout(10000);

describe('startNewNote', () => {
    let store;

    beforeEach(() => {
        // Estado inicial del store
        store = configureStore({
            reducer: {
                auth: (state = {}) => state,
                notes: notesReducer,
            },
            preloadedState: {
                auth: { uid: 'TESTING' },
                notes: { notes: [], active: null },
            },
        }); 

        jest.clearAllMocks();
    });

    it('debería agregar una nueva nota al store y a Firestore', async () => {
        await store.dispatch(startNewNote());

        const colRef = collection(db, `${store.getState().auth.uid}/journal/notes`);
        const q = query(colRef, orderBy('date', 'desc'), limit(1));
        const querySnap = await getDocs(q);
        const noteSnap = querySnap.docs[0];
        const newNoteTest = {id: noteSnap.id, ...noteSnap.data()};

        expect(store.getState().notes.notes).toContainEqual(newNoteTest);

        expect(store.getState().notes.active).toEqual(newNoteTest);

        expect(Swal.fire).toHaveBeenCalledWith({
            title: 'Adding...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: expect.any(Function),
        });
        const { didOpen } = Swal.fire.mock.calls[0][0];
        didOpen();
        expect(Swal.showLoading).toHaveBeenCalled();
        expect(Swal.close).toHaveBeenCalled();
        
        // Delete NewNote in FireBase
        await deleteDoc(noteSnap.ref);
    });

    test('startLoadingNotes debe cargar las notas', async () => {
        await store.dispatch( startLoadingNotes(store.getState().auth.uid));
        
        const colRef = collection(db, `${store.getState().auth.uid}/journal/notes`);
        const notesSnap = await getDocs(colRef);
        expect(notesSnap.size).toBe(store.getState().notes.notes.length);
    })

    test('startSaveNote debe actualizar la nota', async () => {

        const colRef = collection(db, `${store.getState().auth.uid}/journal/notes`);
        const q = query(colRef, orderBy('date', 'desc'), limit(1));
        const querySnap = await getDocs(q);
        const noteSnap = querySnap.docs[0];
        
        const activeNote = {
            id: noteSnap.id,
            title: 'Actualizando Nota',
            body: 'Testing de prueba',
            date: new Date().getTime(),
        } 
        await store.dispatch( startSaveNote(activeNote));

        const querySanpUpdated = await getDocs(q);
        const noteSnapUpdated = querySanpUpdated.docs[0];

        expect(noteSnapUpdated.id).toBe(activeNote.id);
        expect(noteSnapUpdated.data().title).toBe(activeNote.title);
        expect(noteSnapUpdated.data().body).toBe(activeNote.body);
        expect(noteSnapUpdated.data().date).toBe(activeNote.date);

     })

     test('startUploading debe de actualizar el url del entry', async () => { 
        const colRef = collection(db, `${store.getState().auth.uid}/journal/notes`);
        const q = query(colRef, orderBy('date', 'desc'), limit(1));
        const querySnap = await getDocs(q);
        const noteSnap = querySnap.docs[0];
        store.dispatch(activeNote(noteSnap.id, noteSnap.data()));
        const file = new File([], 'foto.jpg');
        fileUpload.mockResolvedValue('http://testingJest.com/foto.jpg');
        await store.dispatch( startUploading (file) );

        expect(Swal.fire).toHaveBeenCalledWith({
            title: 'Uploading...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: expect.any(Function),
        });

        const querySanpUpdated = await getDocs(q);
        const noteSnapUpdated = querySanpUpdated.docs[0];
        store.dispatch(activeNote(noteSnapUpdated.id, noteSnapUpdated.data()));

        expect(store.getState().notes.active.url).toBe('http://testingJest.com/foto.jpg');
      })
});
