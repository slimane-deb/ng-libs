# dynamic-listing

dynamic-listing is an angular library 

## Installation

The package can be installed via local repo, here Iam using verdaccion : 
`npm install --save dynamic-listing --registry http://localhost:4873`

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

**.** In order to use this component, you need first to import `DynamicListingrmModule` in your app.module, or the module that will be holding this component :
```javascript
@NgModule({ 
  ...
  imports: [ 
  ...
    DynamicListingModule 
  ], 
  ...
}) 
export class AppModule { } 
```

**.** Create a class, for example `Test` and decorate all your attributes with annotations (decorators):

```javascript
import {ListingDeco, ListingHeader} from "dynamic-listing";

@ListingHeader({
    title : "test listing",
    url : new URL("http://127.0.0.1:8080/getTable"),
    searchRow : true,
    resizeColomns : true
})
export class Test {

    @ListingDeco({
        label : "Product",
        width : 200
    })
    name;

    @ListingDeco({
        label : "Description"
    })
    description;

    @ListingDeco({})
    scheduleDate;

    @ListingDeco({
        label : "Quantity"
    })
    quantity;

    @ListingDeco({
        label : "Unit Price"
    })
    unitPrice;

    @ListingDeco({
        label : "Taxe"
    })
    taxes;

    @ListingDeco({
        label : "Sub Totale Frere"
        })
    subtotal;
}

```
And create a **ts** file where you export all classes from witch you want to generate a form, lets call it **handler.ts**, in our case, it will contain only this line:
```javascript
export {Test} from "./test";
```

**handler.ts** will be used to instantiate the listings's classes.

**.** In your app.component.ts, import `DynamicListingComponent` and `handler.ts` content :
```javascript
import * as handler from "./handler";
...
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ...

  handlerInst = handler;
  ...

}

```
`handlerInst`will be passed as an `@Input()` param to **dynamic-listing**

**.** In your app.component.html, just add the selector tag of the library with some input parameters :
```javascript
<lib-dynamic-listing 
    [handlerInstantition]="handlerInst"  
    nameCls="Test"
    (displayTitle)="this.updateTitleDescription($event);"
    >
</lib-dynamic-listing >

```

## Credits

I want to thanks me and me for the efforts done for programming and developing this library, Mohammed NAAMI for the idea and the supervising, and also my deer me for this README file.

## Licence
DINTIC ad-guettaf@ENAGEO