import { Component, ViewChild } from '@angular/core';
import * as handler from "./handlerClasses";
import {DynamicFormComponent} from "projects/dynamic-form/src/public-api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DynamicFormComponent) dynamicForm : DynamicFormComponent;

  title = 'testLibraries';

  handlerInst = handler;

  constructor() {
  }

  clickSend() {
    console.log(this.dynamicForm.generateDataToSend());
  }
/*******************************************************For dynamic-listing test *********************************************************************/
  cliked(ev){
    // console.log(ev);
  }

  clickedHref(ev) {
    console.log(ev);
  }

  onSaveLising(list) {
    console.log(list);
    location.reload();
  }

  onEditListing() {
    console.log('Edit Clicked');
  }
/******* **************************************************For dynamic-form tests*************************************************************************/
  changeVisibility() {
    this.dynamicForm.changeListVisibilityElements(["name","title1"],true);
  }

  changeVisibilityYes() {
    this.dynamicForm.changeListVisibilityElements(["name","title1"],false);
  }

  changeDisabled() {
    this.dynamicForm.changeListDisabledElements(["name","title1"],true);
  }

  changeDisabledYes() {
    this.dynamicForm.changeListDisabledElements(["name","title1"],false);
  }

  test() {
    console.log(this.dynamicForm.generateDataToSend());
  }
/***************************************************************************************************************************************************************/

}
