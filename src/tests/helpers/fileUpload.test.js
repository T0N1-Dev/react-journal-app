import { fileUpload } from "../../helpers/fileUpload";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
    cloud_name: 'dmfs1od9n', 
    api_key: '194973856458198', 
    api_secret: '5NOxJ_DG1b0x98fyYwCc8dkmVBA'
});

jest.setTimeout(30000);

describe('Pruebas en fileUpload', () => {

    test('debe de cargar un archivo y retornar el URL ', async () => { 

        const resp = await fetch('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8yxHXwueBnvflyX9jpuZVfElh93iUowpf2Q&s');
        const blob = await resp.blob();
        
        const file = new File([blob], 'foto.png');
        const url = await fileUpload( file );
        const segments = url.split('/');
        const imageId = segments[ segments.length - 1 ].replace('.png','');
        
        expect( typeof url ).toBe('string');

        cloudinary.api
            .delete_resources([imageId], 
                { type: 'upload', resource_type: 'image' })
            .then(console.log);
    });

    test('debe de retornar un error ', async () => { 
        
        const file = new File([], 'foto.png');
        const url = await fileUpload( file );
        
        expect( url ).toBe(null);
    });
})


