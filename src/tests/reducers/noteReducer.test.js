import { notesReducer } from "../../reducers/notesReducer";
import { types } from "../../types/types";

describe("Pruebas en notesReducer", () => {

    test('debe retornar el initialState', () => {
        const state = notesReducer(undefined, {type: ''});
        expect(state).toEqual({
            notes: [],
            active: null
        });
    });

    test('debe retornar una nota actualizada', () => { 
        const stateTest = {notes: [
            {id: '1', name: 'nota1'},
            {id: '2', name: 'nota2'},
            {id: '3', name: 'nota3'},
            {id: '4', name: 'nota4'}
        ]}

        const actionTest = {type: types.notesUpdated, payload: {id: '2', note: {id: '2', name: 'notaActualizada'}}};
        
        const state = notesReducer(stateTest, actionTest);
        expect(state).toEqual(
            {
                notes: [
                  { id: '1', name: 'nota1' },
                  { id: '2', name: 'notaActualizada' },
                  { id: '3', name: 'nota3' },
                  { id: '4', name: 'nota4' }
                ]
              }
        );
    });
});