import { FormDeco, SectionForm, FormHeader, FormTypes } from 'projects/dynamic-form/src/public-api';

@FormHeader({
    title : "Test form"
})
export class FormListing {

    @FormDeco({
        label : "N° Dossier",
        type : FormTypes.INPUT,
    })
    id;

    @FormDeco({
        label : "LIBELLE",
        type : FormTypes.INPUT
    })
    libelle;

    @FormDeco({
        label : "NATURE",
        type : FormTypes.INPUT,
    })
    nature;

    @FormDeco({
        label : "DATE CREATION",
        type : FormTypes.INPUT
    })
    dateCreation;
    
    @FormDeco({
        label : "Type",
        type : FormTypes.INPUT,
    })
    type;

    @FormDeco({
        label : "Groupe",
        type : FormTypes.INPUT
    })
    groupe;
    
    @FormDeco({
        label : "Etat",
        type : FormTypes.RADIO,
        datas : [{value : 0, text : "Avis Juridique"},{value : 1, text : "Fructueux"},{value : 22, text : "Chekla"}]
    })
    etat;

    @FormDeco({
        label : "Chargé du dossier",
        type : FormTypes.SELECT,
        datas : [{value : 0, text : "adnane"},{value : 1, text : "allaa"},{value : 22, text : "BENSEDDIK"}]
    })
    chargeDossier;

}