# dynamic-form

dynamic-form is an angular library 

## Installation

The package can be installed via local repo, here Iam using verdaccion : 
`npm install --save dynamic-form --registry http://localhost:4873`

#### Devextrem project
If you are already using **devextreme** in your angular project, you don't need to add anything, just install it and enjoy it

#### Devextreme don't configured yet
if you are not using devextreme in your angular project, you have to add those two dependencies : 
`npm install --save devextreme devextreme-angular`

then, in your `angular.json (angular-cli.json)`, add the `dx.common.css`and the `theme` you want to use, for example : 
```javascript
{ 
  ... 
  "apps": [ 
    { 
      ... 
      "styles": [ 
        ...
        "../node_modules/devextreme/dist/css/dx.common.css", 
        "../node_modules/devextreme/dist/css/dx.light.css", 
        "styles.css" 
      ], 
      ... 
      } 
    } 
  ], 
... 
} 
```
You will need to also to add this in your **tsconfig.json**
```javascript
"compilerOptions": {
    ...
    "paths": {
        "jszip": [
            "node_modules/jszip/dist/jszip.min.js"
        ]
    }
}
```

## Configuration

**.** In order to use this component, you need first to import `DynamicFormrmModule` in your app.module, or the module that will be holding this component :
```javascript
@NgModule({ 
  ...
  imports: [ 
  ...
    DynamicFormModule 
  ], 
  ...
}) 
export class AppModule { } 
```

**.** Create a class, for example `Test` and decorate all your attributes with annotations (decorators):

```javascript
import {FormDeco,FormTypes,SectionForm, FormHeader} from "dynamic-form";

@FormHeader({
    title : "Test form",
    url : new URL("http://127.0.0.1/apimain/kech_heja")
})
export class Test {

    @SectionForm("Secion1")
    section;

    @FormDeco({
        label : "text Area",
        type : FormTypes.TEXTAREA,
        defaultValue : ""
    })
    firstField;

    @FormDeco({
        label : "select multiple choice",
        type : FormTypes.SELECT,
        datas : [{value : 0, text : "devextreme"},{value : 1, text : "devextreme-angular"},{value : 2, text : "dynamic-form"}],
        required : true,
        multiple : true,
        defaultValue : [0,1]
    })
    secondField;

    @SectionForm("Seciont2")
    section1;

    @FormDeco({
        label : "Radio groupe",
        type : FormTypes.RADIO,
        datas : [{value : 0, text : "devextreme"},{value : 1, text : "devextreme-angular"},{value : 2, text : "dynamic-form"}],
        defaultValue : 2
    })
    theirdField;

    @FormDeco({
        label : "Date selector",
        type : FormTypes.DATE,
        defaultValue: new Date(),
        required : true
    })
    fourthField;

    @FormDeco({
        label : "Checkbox",
        type : FormTypes.CHEKBOX,
        datas : [{value : 0, text : "devextreme"},{value : 1, text : "devextreme-angular"},{value : 2, text : "dynamic-form"}],
        defaultValue : [0,2]
    })
    fifthField;
}

```
And create a **ts** file where you export all classes from witch you want to generate a form, lets call it **handler.ts**, in our case, it will contain only this line:
```javascript
export {Test} from "./test";
```

**handler.ts** will be used to instantiate the forms'classes.

**.** In your app.component.ts, import `DynamicFormComponent` and `handler.ts` content :
```javascript
import * as handler from "./handler";
import { DynamicFormComponent } from 'dynamic-form';
...
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DynamicFormComponent) dynamicForm : DynamicFormComponent;

  handlerInst = handler;
  ...

}

```
`handlerInst`will be passed as an `@Input()` param to **dynamic-form**

**.** In your app.component.html, just add the selector tag of the library with some input parameters :
```javascript
<lib-dynamic-form 
    [handlerInstantition]="handlerInst" 
    colNumber="2" 
    width="1200" 
    nameCls="Test"
    (displayButton)="this.updatedButtonsAction($event);" 
    (displayTitle)="this.updateTitleDescription($event);"
    >
</lib-dynamic-form >

```
**.** Finally, if you wana retreive selected or introduced datas of the form, you have to call **generateDataToSend** method line this : 
```javascript
this.dynamicForm..generateDataToSend();
```
## Credits

I want to thanks me and me for the efforts done for programming and developing this library, Mohamed NAAMI for the idea and thesupervising, and also my deer me for this README file.

## Licence
DINTIC ad-guettaf@ENAGEO