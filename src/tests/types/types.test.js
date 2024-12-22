import { types } from "../../types/types"

describe("Pruebas en types.js", () => {

    const typesTest = {
        login: '[Auth] Login',
        logout: '[Auth] Logout',
    
        uiSetError: '[UI] Set Error',
        uiRemoveError: '[UI] Remove Error',
    
        uiStartLoading: '[UI] Start Loading',
        uiFinishLoading: '[UI] Finish Loading',
    
        notesAddNew: '[Notes] New note',
        notesActive: '[Notes] Set active note',
        notesLoad: '[Notes] Load notes',
        notesUpdated: '[Notes] Updated note',
        notesFileUrl: '[Notes] Updated image url',
        notesDelete: '[Notes] Delete note',
        notesLogoutCleaning: '[Notes] Logout Cleaning',
        noteAdded: '[Note] Added note',
    
    }

    test('Deben coincidir los types', () => { 
        expect(types).toEqual(typesTest);
     })
})