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

  @ViewChild(DxDataGridComponent, {static: false}) myListing: DxDataGridComponent;
  @ViewChild('popup', {static: false}) myPopup: any;

  @Output() onRowClicked = new EventEmitter<any>();

  @Output() onHrefClicked = new EventEmitter<any>();

  @Input() nameCls: string;

  @Input() handlerInstantition: object;

  titleForm: string;
  urlValidation: URL;
  columnResize: boolean;
  globalSearch: boolean;
  searchRow: boolean;
  editButton: string;

  @Input() datas: any[] = [];

  @Output() displayTitle = new EventEmitter<any>();

  @Input() deleteMode = false;

  @Input() editableMode: string = null;
  @Input() inEditMode = false;

  @Input() addInEditMode = true;

  @Input() formEditClassName: string = null;

  itemsField: any[] = [];

  // ///////////items selected for deletion
  selectedItemKeys: any[] = [];

  private keysClass: string[] = [];
  template = 'cellTemplate';

  ////////////// for the form popup
  datasForm: any[] = [];
  @Input() colNumberForm: Number = 2;
  @Input() nameClsFormPopup: string;
  @Input() colNumberFormPopup: Number = 2;
  @Input() widthFormPopup: Number = null;
  @Output() onSaveClicked = new EventEmitter<any>();
  @Output() onEditClicked = new EventEmitter<any>();
  Types = FormTypes;
  indexLastElementClicked = -1;
  elementsUpdated = false;

  constructor(private listingProvider: DynamicListingService) {
    this.publishTitle = this.publishTitle.bind(this);
    this.parseClass = this.parseClass.bind(this);
    this.parseFormListing = this.parseFormListing.bind(this);
    this.saveFormPopUp = this.saveFormPopUp.bind(this);
    this.cancelFormPopUp = this.cancelFormPopUp.bind(this);
    this.putNewDatas = this.putNewDatas.bind(this);
    this.putNewDatasAdd = this.putNewDatasAdd.bind(this);
    this.freeFormElements = this.freeFormElements.bind(this);
    this.getGeneratedListing = this.getGeneratedListing.bind(this);
    this.saveEditingList = this.saveEditingList.bind(this);
    setTimeout(() => {
      this.parseClass();
      return this.parseFormListing();
    }, 0);
  }

  ngOnInit() {
  }


  parseClass() {
    const classForm = new (this.handlerInstantition as any)[this.nameCls]();
    const  attributeAccess = classForm.__proto__;
    const keys: string[] = this.getAttributeList(attributeAccess);
    const idx = keys.indexOf('headers');
    if (idx > -1) {
      this.titleForm = attributeAccess.headers.title;
      this.urlValidation = attributeAccess.headers.url;
      this.globalSearch = attributeAccess.headers.globalSearch;
      this.searchRow = attributeAccess.headers.searchRow;
      this.editButton = attributeAccess.headers.editButton;
      // if (this.editableMode!==null && typeof (this.editableMode) == "string" && (this.editableMode=="batch" || this.editableMode == "popup" )  ) this.editButton = null;
      this.columnResize = attributeAccess.headers.resizeColomns;
      keys.splice(idx, 1);
      this.publishTitle();
    }
    keys.map(elmt => {
      if (!attributeAccess[elmt].value) { attributeAccess[elmt].value = elmt; } else { attributeAccess[elmt].value = attributeAccess[elmt].value.split('->').join('.'); }
      return this.itemsField.push(attributeAccess[elmt]);
    });
    console.log(this.itemsField);
    this.keysClass = keys;
    if (this.urlValidation) {
      this.listingProvider.getItems(this.urlValidation.toJSON()).subscribe(
        res => {
          this.datas = res as any[];
          console.log(this.datas);
        },
        err => console.log(err));
    }
  }

  getAttributeList<T>(obj: T) {
    return Object.keys(obj);
  }


  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  deleteSelection() {
    this.datas = this.datas.filter(elemt => this.selectedItemKeys.indexOf(elemt) < 0);
    this.myListing.instance.refresh();
    this.elementsUpdated = true;
  }

  publishTitle() {
    const infos: TitleDescr = {
      title : this.titleForm,
      description : ''
    };
    this.displayTitle.emit(infos);
  }

  cellClicked(ev) {
    this.onRowClicked.emit(ev);
    if (this.itemsField[ev.columnIndex].href) {
    this.onHrefClicked.emit(this.generateHrefString(this.itemsField[ev.columnIndex].href, ev.rowIndex));
    }
  }


  generateHrefString(href: string, rowIndex: any) {
    let i = 0;
    while (href.indexOf('{') > -1 && href.indexOf('}') > -1 && i < 20) {
      const newHref =  href.substring(href.indexOf('{') + 1, href.indexOf('}'));
      href = href.split('{' + newHref + '}').join(this.accessNestedObject(newHref, rowIndex));
      i++;
    }
    return href;
  }


  accessNestedObject(treeStructure: string, rowIndex: any) {
    let value = this.datas[rowIndex];
    treeStructure.split('.').map(elmt => value = value[elmt] );
    return value;
  }


  ////// Fo form Editing mode//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  globalEdit() {
    // this.inEditMode = true;
    this.onEditClicked.emit();
  }


  ////// FOr BAtch Edit //////////////////////////////////////////////////////////////////////

  rowBatchBeenUpdated(ev) {
    if (!this.elementsUpdated) { this.elementsUpdated = true; }
  }


  /////// For Popup Edit form ///////////////////////////////////////////////////////////////////////////////
  parseFormListing() {
    let  ii = 0; let j = 0;
    const classForm = new (this.handlerInstantition as any)[this.nameClsFormPopup]();
    const attributeAccess = classForm.__proto__;
    const keys: string[] = this.getAttributeList(attributeAccess);
    const idx = keys.indexOf('headers');
    if (idx > -1) {
        keys.splice(idx, 1);
      }
    console.log(keys);
    let formFile: FormFile = null;
    let tabForm: FormField[] = [];
    let lastSection: Boolean = false;
    for (let i = 0; i < keys.length; i++) {
        const elmt = keys[i];
        console.log(attributeAccess[elmt]);
        if (typeof attributeAccess[elmt] == 'string') {
          console.log('SECTION');
          if (lastSection == true) {
            formFile.sectionElements = [...tabForm];
            this.datasForm.push({...formFile});
            ii++;
            j = 0;
          }
          formFile = new FormFile(attributeAccess[elmt]);
          tabForm.length = 0;
          tabForm = [];
          lastSection = true;
          keys.splice(i, 1);
          i--;
        } else {
          console.log('ELEMENTS');
          if (lastSection == false) {
            formFile = new FormFile('');
            lastSection = true;
          }
          if (attributeAccess[elmt].type == FormTypes.SELECT) {
            if (attributeAccess[elmt].datas.hostname == undefined) {
              if (attributeAccess[elmt].defaultValue) {
                attributeAccess[elmt].selected = attributeAccess[elmt].defaultValue;
              } else { attributeAccess[elmt].selected = -1; }
            } else {
              this.setAsynDatas(attributeAccess[elmt], ii, j);
            }
          }
          if (attributeAccess[elmt].type == FormTypes.CHEKBOX) {
              attributeAccess[elmt].datas.forEach(val => val.selected = false);
              attributeAccess[elmt].defaultValue && attributeAccess[elmt].defaultValue.length && attributeAccess[elmt].defaultValue.map(ind => {
              const taille = attributeAccess[elmt].datas.length;
              if ( ind > -1 && ind < taille ) { attributeAccess[elmt].datas[ind].selected = true; }
              });
          }
          if (attributeAccess[elmt].type == FormTypes.RADIO) {
            if (attributeAccess[elmt].defaultValue) { attributeAccess[elmt].selected = attributeAccess[elmt].datas[attributeAccess[elmt].defaultValue].value; } else { attributeAccess[elmt].selected = 0; }
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

  setAsynDatas(elmt: any, indexI: any, indexJ: any) {
    elmt.customData = [];
    this.listingProvider.getItems(elmt.datas.toJSON()).subscribe(
        res => {
            elmt.customData = res;
            elmt.selected = elmt.defaultValue;
            console.log(indexI + '      ' + indexJ);
            const id = setInterval(() => {
            if (this.datasForm[indexI] !== undefined && this.datasForm[indexI].sectionElements[indexJ] !== undefined) {
              Object.assign(this.datasForm[indexI].sectionElements[indexJ], {...elmt});
              clearInterval(id);
            }
          }, 400);
        },
        err => console.log(err));
  }

  reajusteForm() {
    const datas1 = [];
    this.datasForm.map(elmt => {
      const obj = {
        sectionElements: undefined
      };
      obj.sectionElements = [];
      elmt.sectionElements.map(elment => obj.sectionElements.push({...elment}));
      datas1.push(obj);
    });
    this.datasForm.length = 0;
    this.datasForm = [...datas1];
  }

  freeFormElements() {
    for (let i = 0; i < this.datasForm[0].sectionElements.length; i++) {
      const elemntForm = this.datasForm[0].sectionElements[i];
      switch (elemntForm.type) {
        case this.Types.INPUT :
            elemntForm.defaultValue = null;
            break;
        case this.Types.TEXTAREA :
            elemntForm.defaultValue = null;
            break;
        case this.Types.NUMBER_PICKER :
            elemntForm.defaultValue = null;
            break;
        case this.Types.DATE :
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const date = month + '/' + day + '/' + year;
            elemntForm.defaultValue = date;
            break;
        case this.Types.RADIO :
            elemntForm.selected = 0;
            break;
        case this.Types.SELECT :
            elemntForm.selected = -1;
            break;
      }
    }
  }

  editWithPopup(ev) {
    this.indexLastElementClicked = this.datas.indexOf(ev.data);
    if (this.indexLastElementClicked > -1) {
      const realData = this.extractRealDataRow(ev.data);
      for (let i = 0; i < realData.length; i++) {
        const elemntForm = this.datasForm[0].sectionElements[i];
        switch (elemntForm.type) {
          // c'est fait expré de ne pas avoir regroupé les 3 premier dans le défault, mathesch rohek khchine w tgoule thelebtleh ghlat
          // lol; je rigole. NON serieux je les ai laissé comme ca pour mieux comprendre c'est tous
          case this.Types.INPUT :
              elemntForm.defaultValue = realData[i];
              break;
          case this.Types.TEXTAREA :
              elemntForm.defaultValue = realData[i];
              break;
          case this.Types.NUMBER_PICKER :
              elemntForm.defaultValue = realData[i];
              break;
          case this.Types.DATE :
              const tabs = realData[i].split('/');
              const firstElement = tabs[0];
              tabs[0] = tabs[1]; tabs[1] = firstElement;
              elemntForm.defaultValue = tabs.join('/');
              break;
          case this.Types.RADIO :
              const j = elemntForm.datas.findIndex(elmt => elmt.text == realData[i]);
              j > -1 ? elemntForm.selected = elemntForm.datas[j].value : elemntForm.selected = 0;
              break;
          case this.Types.SELECT :
              const l = elemntForm.datas.findIndex(elmt => elmt.text == realData[i]);
              l > -1 ? elemntForm.selected = elemntForm.datas[l].value : elemntForm.selected = -1;
              break;
        }
    }
    }
  }

  addWithPopup(ev) {
    this.freeFormElements();
  }

  extractRealDataRow(data: any) {
    const realData = [];
    this.itemsField.map(elt => {
      if (elt.value.indexOf('.') > -1) {
        let val = data ;
        elt.value.split('.').map(elmt => val = val[elmt]);
        realData.push(val);
      } else { realData.push(data[elt.value]); }
    });
    return realData;
  }

  putNewDatas() {
    const rowToUpdate = this.datas[this.indexLastElementClicked];
    for (let i = 0; i < this.datasForm[0].sectionElements.length; i++) {
      const elemntForm = this.datasForm[0].sectionElements[i];
      switch (elemntForm.type) {
        case this.Types.INPUT :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToUpdate;
              treeObject.map(elmt =>  val = val[elmt]);
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToUpdate[this.itemsField[i].value] = elemntForm.defaultValue;
            }
            break;
        case this.Types.TEXTAREA :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToUpdate;
              treeObject.map(elmt =>  val = val[elmt]);
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToUpdate[this.itemsField[i].value] = elemntForm.defaultValue;
            }
            break;
        case this.Types.NUMBER_PICKER :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToUpdate;
              treeObject.map(elmt =>  val = val[elmt]);
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToUpdate[this.itemsField[i].value] = elemntForm.defaultValue;
            }
            break;
        case this.Types.DATE :
            let valToPut = elemntForm.defaultValue;
            if (valToPut.indexOf('/') > 2 ) {
              valToPut = valToPut.split('/').reverse().join('/');
            } else {
              const tabs = valToPut.split('/');
              const firstElement = tabs[0];
              tabs[0] = tabs[1]; tabs[1] = firstElement;
              valToPut = tabs.join('/');
            }
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToUpdate;
              treeObject.map(elmt =>  val = val[elmt]);
              val[lastTreeElement] = valToPut;
            } else {
              rowToUpdate[this.itemsField[i].value] = valToPut;
            }
            break;
        case this.Types.RADIO :
            const index = elemntForm.datas.findIndex(elmt => elmt.value == elemntForm.selected);
            if (index > -1) {
              const valToPut1 = elemntForm.datas[index].text;
              if (this.itemsField[i].value.indexOf('.') > -1) {
                const treeObject = this.itemsField[i].value.split('.');
                const lastTreeElement = treeObject.pop();
                let val = rowToUpdate;
                treeObject.map(elmt =>  val = val[elmt]);
                val[lastTreeElement] = valToPut1;
              } else {
                rowToUpdate[this.itemsField[i].value] = valToPut1;
              }
            }
            break;
        case this.Types.SELECT :
            const index1 = elemntForm.datas.findIndex(elmt => elmt.value == elemntForm.selected);
            if (index1 > -1) {
              const valToPut2 = elemntForm.datas[index1].text;
              if (this.itemsField[i].value.indexOf('.') > -1) {
                const treeObject = this.itemsField[i].value.split('.');
                const lastTreeElement = treeObject.pop();
                let val = rowToUpdate;
                treeObject.map(elmt =>  val = val[elmt]);
                val[lastTreeElement] = valToPut2;
              } else {
                rowToUpdate[this.itemsField[i].value] = valToPut2;
              }
            }
            break;
      }
    }
    this.myListing.instance.refresh();
  }


  putNewDatasAdd() {
    const rowToAdd = {};
    for (let i = 0; i < this.datasForm[0].sectionElements.length; i++) {
      const elemntForm = this.datasForm[0].sectionElements[i];
      switch (elemntForm.type) {
        case this.Types.INPUT :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToAdd;
              treeObject.map(elmt =>  {
                val[elmt] = {};
                val = val[elmt];
              });
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToAdd[this.itemsField[i].value] = elemntForm.defaultValue;
            }
            break;
        case this.Types.TEXTAREA :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToAdd;
              treeObject.map(elmt =>  {
                val[elmt] = {};
                val = val[elmt];
              });
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToAdd[this.itemsField[i].value] = elemntForm.defaultValue;
            }
            break;
        case this.Types.NUMBER_PICKER :
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToAdd;
              treeObject.map(elmt =>  {
                val[elmt] = {};
                val = val[elmt];
              });
              val[lastTreeElement] = elemntForm.defaultValue;
            } else {
              rowToAdd[this.itemsField[i].value] = elemntForm.defaultValue;
            }
        case this.Types.DATE :
            let valToPut = elemntForm.defaultValue;
            console.log(valToPut);
            if (valToPut.indexOf('/') > 2 ) {
              valToPut = valToPut.split('/').reverse().join('/');
            } else {
              const tabs = valToPut.split('/');
              const firstElement = tabs[0];
              tabs[0] = tabs[1]; tabs[1] = firstElement;
              valToPut = tabs.join('/');
            }
            if (this.itemsField[i].value.indexOf('.') > -1) {
              const treeObject = this.itemsField[i].value.split('.');
              const lastTreeElement = treeObject.pop();
              let val = rowToAdd;
              treeObject.map(elmt =>  {
                val[elmt] = {};
                val = val[elmt];
              });
              val[lastTreeElement] = valToPut;
            } else {
              rowToAdd[this.itemsField[i].value] = valToPut;
            }
            break;
        case this.Types.RADIO :
            const index = elemntForm.datas.findIndex(elmt => elmt.value == elemntForm.selected);
            if (index > -1) {
              const valToPut1 = elemntForm.datas[index].text;
              if (this.itemsField[i].value.indexOf('.') > -1) {
                const treeObject = this.itemsField[i].value.split('.');
                const lastTreeElement = treeObject.pop();
                let val = rowToAdd;
                treeObject.map(elmt =>  {
                  val[elmt] = {};
                  val = val[elmt];
                });
                val[lastTreeElement] = valToPut1;
              } else {
                rowToAdd[this.itemsField[i].value] = valToPut1;
              }
            }
            break;
        case this.Types.SELECT :
            const index1 = elemntForm.datas.findIndex(elmt => elmt.value == elemntForm.selected);
            if (index1 > -1) {
              const valToPut2 = elemntForm.datas[index1].text;
              if (this.itemsField[i].value.indexOf('.') > -1) {
                const treeObject = this.itemsField[i].value.split('.');
                const lastTreeElement = treeObject.pop();
                let val = rowToAdd;
                treeObject.map(elmt =>  {
                  val[elmt] = {};
                  val = val[elmt];
                });
                val[lastTreeElement] = valToPut2;
              } else {
                rowToAdd[this.itemsField[i].value] = valToPut2;
              }
            }
            break;
      }
    }
    this.datas.unshift(rowToAdd);
    this.myListing.instance.refresh();
  }

  // réccupérer les nouvelles lignes
  getGeneratedListing() {
    return this.datas;
  }

  saveEditingList() {
    console.log('ADADAD');
    this.onSaveClicked.emit(this.getGeneratedListing());
    this.inEditMode = false;
  }

  saveFormPopUp() {
    this.myPopup.instance.cancelEditData();
    if (this.indexLastElementClicked > -1) {
      this.putNewDatas();
      this.indexLastElementClicked = -1;
    } else { this.putNewDatasAdd(); }
    this.reajusteForm();
    if (!this.elementsUpdated) { this.elementsUpdated = true; }
  }

  cancelFormPopUp() {
    this.myPopup.instance.cancelEditData();
    this.indexLastElementClicked = -1;
    this.reajusteForm();
  }


  setInDeleteMode(type: boolean) {
    this.deleteMode = type;
  }

  setInEditMode(type: boolean) {
    this.inEditMode = type;
  }

  setEditType(type: string) {
    this.editableMode = type;
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
