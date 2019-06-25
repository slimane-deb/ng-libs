import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TitleDescr } from './authorTypes/titleDescription';
import { DynamicListingService } from './dynamic-listing.service';
import { DxDataGridComponent, DxPopupComponent, DxButtonComponent } from 'devextreme-angular';
import { FormFile } from './listingModel/formFile';
import { FormField } from './listingModel/formField';
import { FormTypes } from './listingModel/formType';

@Component({
  selector: 'lib-dynamic-listing',
  templateUrl: './dynamic-listing.component.html',
  styleUrls: ['./dynamic-listing.component.scss']
})
export class DynamicListingComponent implements OnInit {

  @ViewChild(DxDataGridComponent) myListing : DxDataGridComponent;
  @ViewChild('popup') myPopup : any;

  @Output() onRowClicked = new EventEmitter<any>();

  @Output() onHrefClicked = new EventEmitter<any>();
  
  @Input() nameCls : string;

  @Input() handlerInstantition : object;
  
  titleForm : string;
  urlValidation : URL;
  columnResize: boolean;
  globalSearch : boolean;
  searchRow : boolean;
  editButton : string;

  @Input() datas : any[] = [];

  @Output() displayTitle = new EventEmitter<any>();

  @Input() deleteMode : boolean = false;

  @Input() editableMode : string = null;

  @Input() formEditClassName : string = null;

  itemsField : any[] = [];

  // items selected for deletion
  selectedItemKeys: any[] = [];

  private keysClass : string[]=[];
  template : string = "cellTemplate";

  // for the form popup
  datasForm : any[] = [];
  @Input() colNumberForm : Number = 2;
  @Input() nameClsFormPopup : string;
  Types = FormTypes;

  constructor(private listingProvider : DynamicListingService) { 
    this.publishTitle = this.publishTitle.bind(this);
    this.parseClass = this.parseClass.bind(this);
    this.parseFormListing = this.parseFormListing.bind(this);
    this.saveFormPopUp = this.saveFormPopUp.bind(this);
    setTimeout(()=> {
      this.parseClass();
      return this.parseFormListing();
    },0);
  }

  ngOnInit() {
  }


  parseClass() {
    var classForm = new (<any>this.handlerInstantition)[this.nameCls]();
    let  attributeAccess = classForm.__proto__;
    let keys : string[] = this.getAttributeList(attributeAccess);
    let idx = keys.indexOf("headers");
    if (idx > -1) {
      this.titleForm = attributeAccess.headers.title;
      this.urlValidation = attributeAccess.headers.url;
      this.globalSearch = attributeAccess.headers.globalSearch;
      this.searchRow = attributeAccess.headers.searchRow;
      this.editButton = attributeAccess.headers.editButton;
      if (this.editableMode!==null && typeof (this.editableMode) == "string" && (this.editableMode=="batch" || this.editableMode == "popup" )  ) this.editButton = null;
      this.columnResize = attributeAccess.headers.resizeColomns;
      keys.splice(idx,1);
      this.publishTitle();
    }
    keys.map(elmt=> {
      if (!attributeAccess[elmt].value) attributeAccess[elmt].value=elmt;
      else attributeAccess[elmt].value = attributeAccess[elmt].value.split('->').join('.');
      return this.itemsField.push(attributeAccess[elmt])
    });
    console.log(this.itemsField);
    this.keysClass = keys;
    if (this.urlValidation)
      this.listingProvider.getItems(this.urlValidation.toJSON()).subscribe(
        res => {
          this.datas = res as any[];
          console.log(this.datas);
        },
        err => console.log(err));
  }

  getAttributeList<T>(obj: T) {
    return Object.keys(obj);
  }


  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  deleteSelection() {
    this.datas = this.datas.filter(elemt => this.selectedItemKeys.indexOf(elemt)<0);
    this.myListing.instance.refresh();
  }

  publishTitle() {
    let infos : TitleDescr = {
      title : this.titleForm,
      description : ""
    }
    this.displayTitle.emit(infos);
  }

  cellClicked(ev) {
    this.onRowClicked.emit(ev);
    if (this.itemsField[ev.columnIndex].href)
    this.onHrefClicked.emit(this.generateHrefString(this.itemsField[ev.columnIndex].href,ev.rowIndex));
    // console.log(this.generateHrefString(this.itemsField[ev.columnIndex].href,ev.rowIndex));
    // console.log(this.accessNestedObject(this.itemsField[ev.columnIndex].value,ev.rowIndex));
  }


  generateHrefString(href : string, rowIndex : any) {
    let i = 0;
    while (href.indexOf('{')>-1 && href.indexOf('}')>-1 && i<20) {
      let newHref =  href.substring(href.indexOf('{')+1,href.indexOf('}'));
      href = href.split("{"+newHref+"}").join(this.accessNestedObject(newHref,rowIndex));
      i++;
    }
    return href;
  }


  accessNestedObject(treeStructure : string, rowIndex : any) {
    let value = this.datas[rowIndex];
    treeStructure.split('.').map(elmt => value= value[elmt] );
    return value; 
  }


  ////// Fo form listing inside popup/////////////////////////////////////////////////////////////////////////////

  parseFormListing() {
    let  ii = 0; let j=0;
  var classForm = new (<any>this.handlerInstantition)[this.nameClsFormPopup]();
      let attributeAccess = classForm.__proto__;
      let keys : string[] = this.getAttributeList(attributeAccess);
      let idx = keys.indexOf("headers");
      if (idx > -1) {
        keys.splice(idx,1);
      }
      console.log(keys);
      let formFile : FormFile = null;
      let tabForm : FormField[] = [];
      let lastSection : Boolean = false;
      for (let i=0; i<keys.length;i++) {
        let elmt = keys[i];
        console.log(attributeAccess[elmt]);
        if (typeof attributeAccess[elmt] == "string") {
          console.log('SECTION');
          if (lastSection == true) {
            formFile.sectionElements = [...tabForm];
            this.datasForm.push({...formFile});
            ii++;
            j=0;
          }
          formFile = new FormFile(attributeAccess[elmt]);
          tabForm.length = 0;
          tabForm = [];
          lastSection = true;
          keys.splice(i,1);
          i--;
        } else {
          console.log('ELEMENTS');
          if (lastSection == false) {
            formFile = new FormFile("");
            lastSection = true;
          }
          if (attributeAccess[elmt].type == FormTypes.SELECT) {
            if (attributeAccess[elmt].datas.hostname == undefined)
              if (attributeAccess[elmt].defaultValue) 
                attributeAccess[elmt].selected = attributeAccess[elmt].defaultValue;
              else attributeAccess[elmt].selected =-1;
            else {
              this.setAsynDatas(attributeAccess[elmt],ii,j);
            }
          }
          if (attributeAccess[elmt].type == FormTypes.CHEKBOX) {
              attributeAccess[elmt].datas.forEach(val => val.selected = false);
              attributeAccess[elmt].defaultValue && attributeAccess[elmt].defaultValue.length && attributeAccess[elmt].defaultValue.map(ind => {
              let taille = attributeAccess[elmt].datas.length;
              if ( ind > -1 && ind < taille ) attributeAccess[elmt].datas[ind].selected=true
              });
          }
          if (attributeAccess[elmt].type == FormTypes.RADIO) {
            if (attributeAccess[elmt].defaultValue) attributeAccess[elmt].selected = attributeAccess[elmt].datas[attributeAccess[elmt].defaultValue].value;
            else attributeAccess[elmt].selected =0;
          }
          attributeAccess[elmt].value = elmt;
          tabForm.push({...attributeAccess[elmt]});
          j++;
        }
        this.keysClass = keys;
      }
      formFile.sectionElements = [...tabForm];
      this.datasForm.push({...formFile});
      ii++;
      console.log(this.datasForm);
      if (this.datasForm.length < this.colNumberForm) {
        this.colNumberForm = this.datasForm.length;
      }

      console.log(this.datasForm);
  }

  setAsynDatas(elmt : any, indexI : any, indexJ : any) {
    elmt.customData = [];
      this.listingProvider.getItems(elmt.datas.toJSON()).subscribe(
        res => {
            elmt.customData = res;
            elmt.selected = elmt.defaultValue;
            console.log(indexI+"      "+indexJ);
          let id = setInterval(()=> {
            if (this.datasForm[indexI]!== undefined && this.datasForm[indexI].sectionElements[indexJ]!==undefined) {
              Object.assign(this.datasForm[indexI].sectionElements[indexJ],{...elmt});
              clearInterval(id);
            }
          },400)
        },
        err => console.log(err));
  }

  editWithPopup(ev) {
    console.log(ev);
    let idx = this.datas.indexOf(ev.data);
    let realData = this.extractRealDataRow(ev.data);
    for (let i =0; i<realData.length; i++) {
      let elemntForm = this.datasForm[0].sectionElements[i];
      switch(elemntForm.type) {
        case this.Types.INPUT :
            elemntForm.defaultValue = realData[i];
            break;
        case this.Types.TEXTAREA :
            elemntForm.defaultValue = realData[i];
            break;
        case this.Types.NUMBER_PICKER :
            elemntForm.defaultValue = realData[i];
            break;
        case this.Types.RADIO :
            let j = elemntForm.datas.findIndex(elmt => elmt.text == realData[i]);
            j > -1 ? elemntForm.selected = elemntForm.datas[j].value : elemntForm.selected = 0;
            break;
        case this.Types.SELECT :
            let l = elemntForm.datas.findIndex(elmt => elmt.text == realData[i]);
            l > -1 ? elemntForm.selected = elemntForm.datas[l].value : elemntForm.selected=-1;
      }
    }
    console.log(this.datasForm[0].sectionElements);
    console.log(realData);
    console.log(idx);
  }

  extractRealDataRow(data : any) {
    let realData = [];
    this.itemsField.map(elt => {
      if (elt.value.indexOf('.') > -1) {
        let val = data ;
        elt.value.split('.').map(elmt => val = val[elmt]);
        realData.push(val);
      }
      else realData.push(data[elt.value]);
    });
    return realData;
  }

  saveFormPopUp() {
    console.log(this.myPopup.instance);
    this.myPopup.instance.cancelEditData();
  }

  cancelFormPopUp() {
    this.myPopup.instance.cancelEditData();
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}