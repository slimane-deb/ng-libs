import { FormDeco, SectionForm, FormHeader, FormTypes } from 'projects/dynamic-form/src/public-api';

@FormHeader({
    title : "Test form"
})
export class Test {

    @SectionForm("Secion1")
    section;

    @FormDeco({
        label : "adad",
        type : FormTypes.TEXTAREA,
        defaultValue : "",
        required : true,
        patternErroString : "bele3eh",
        lengthString : true,
        max : 20,
        lengthErrorString : "kharay",
        isEmail : true,
        isEmailErrorString : "awediii",
    })
    title;

    @FormDeco({
        label : "ad",
        type : FormTypes.SELECT,
        datas : [{value : 0, text : "wehed"},{value : 1, text : "zouj"},{value : 2, text : "tleta"}],
        // datas : new URL("http://dummy.restapiexample.com/api/v1/employees"),
        // valueTextUrl : {valueKey : "id", textKey : "employee_name"},
        required : true,
        multiple : false,
        defaultValue : 2
    })
    name;

    @SectionForm("Seciont2")
    section1;

    @FormDeco({
        label : "ada",
        type : FormTypes.RADIO,
        datas : [{value : 1, text : "wehed"},{value : 2, text : "zouj"},{value : 3, text : "tleta"}],
        defaultValue : 2,
    })
    title1;

    @FormDeco({
        label : "adadada",
        type : FormTypes.DATE,
        defaultValue: new Date(),
        required : true,
    })
    name1;

    @FormDeco({
        label : "aaaaa",
        type : FormTypes.CHEKBOX,
        datas : [{value : 5, text : "wehed"},{value : 6, text : "zouj"},{value : 7, text : "tleta"}],
        defaultValue : [0,2],
    })
    emmm;

    @FormDeco({
        label : "dddddd",
        type : FormTypes.NUMBER_PICKER,
        defaultValue : 3,
        min : 0,
        max : 25,
        step : 3,
        required : true
    })
    ennnnn;
    
    // @SectionForm("Seciont2")
    // section2;

    // @FormDeco({
    //     label : "ada",
    //     type : FormTypes.RADIO,
    //     datas : [{value : 1, text : "wehed"},{value : 2, text : "zouj"},{value : 3, text : "tleta"}],
    //     defaultValue : 2,
    // })
    // title2;

    // @FormDeco({
    //     label : "adadada",
    //     type : FormTypes.DATE,
    //     defaultValue: new Date(2000,1,1),
    //     required : true,
    // })
    // name2;

    // @FormDeco({
    //     label : "aaaaa",
    //     type : FormTypes.CHEKBOX,
    //     datas : [{value : 5, text : "wehed"},{value : 6, text : "zouj"},{value : 7, text : "tleta"}],
    //     defaultValue : [0,2],
    // })
    // emmm1;

    // @SectionForm("Seciont2")
    // section3;

    // @FormDeco({
    //     label : "ada",
    //     type : FormTypes.RADIO,
    //     datas : [{value : 1, text : "wehed"},{value : 2, text : "zouj"},{value : 3, text : "tleta"}],
    //     defaultValue : 2,
    // })
    // title3;

    // @FormDeco({
    //     label : "adadada",
    //     type : FormTypes.DATE,
    //     defaultValue: new Date(2000,1,1),
    //     required : true,
    // })
    // name3;

    // @FormDeco({
    //     label : "aaaaa",
    //     type : FormTypes.CHEKBOX,
    //     datas : [{value : 5, text : "wehed"},{value : 6, text : "zouj"},{value : 7, text : "tleta"}],
    //     defaultValue : [0,2],
    // })
    // emmm2;


}