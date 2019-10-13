import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormFile } from './formModel/formFile';
import { FormTypes } from './formModel/formType';
import { DxFormComponent } from 'devextreme-angular';
import { FormField } from './formModel/formField';
import { ActionButtons } from './authorTypes/ProgresAdnActions';
import { TitleDescr } from './authorTypes/titleDescription';
import { DynamicFormService } from './dynamic-form.service';

@Component({
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @ViewChild(DxFormComponent, {static: false}) myform: DxFormComponent;

  @Input()
  nameCls: string;

  @Input()
  colNumber: Number = 2;

  @Input()
  width: Number = null;

  @Input()
  handlerInstantition: object;

  titleForm: string;

  validationButton: string ;

  cancelButton: string;
  resetButton: string;

  datas: any[] = [];

  private keysClass: string[] = [];

  Types = FormTypes;

  @Output()
  displayButton = new EventEmitter<any>();

  @Output()
  displayTitle = new EventEmitter<any>();


  constructor(private formProvider: DynamicFormService) {
    this.setDataToTable = this.setDataToTable.bind(this);
    this.publishButton = this.publishButton.bind(this);
    this.publishTitle = this.publishTitle.bind(this);
    this.generateDataToSend = this.generateDataToSend.bind(this);
    this.setAsynDatas = this.setAsynDatas.bind(this);
    setTimeout(() => {
      this.setDataToTable();
    }, 0);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
}



setDataToTable() {
  let  ii = 0; let j = 0;
  const classForm = new (this.handlerInstantition as any)[this.nameCls]();
  const attributeAccess = classForm.__proto__;
  const keys: string[] = this.getAttributeList(attributeAccess);
  const idx = keys.indexOf('headers');
  if (idx > -1) {
        this.titleForm = attributeAccess.headers.title;
        this.validationButton = attributeAccess.headers.saveButton;
        this.cancelButton = attributeAccess.headers.cancelButton;
        this.resetButton = attributeAccess.headers.resetButton;
        keys.splice(idx, 1);
        this.publishButton();
        this.publishTitle();
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
            this.datas.push({...formFile});
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
          if (attributeAccess[elmt].type == FormTypes.DATE) {
            if (typeof(attributeAccess[elmt].defaultValue) !== 'string') {
              const currentDate = new Date();
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1;
              const year = currentDate.getFullYear();
              const date = month + '/' + day + '/' + year;
              attributeAccess[elmt].defaultValue = date;
            }
          }
          tabForm.push({...attributeAccess[elmt]});
          j++;
        }
        this.keysClass = keys;
      }
  formFile.sectionElements = [...tabForm];
  this.datas.push({...formFile});
  ii++;
  console.log(this.datas);
  if (this.datas.length < this.colNumber) {
        this.colNumber = this.datas.length;
      }

}

setAsynDatas(elmt: any, indexI: any, indexJ: any) {
  elmt.customData = [];
  this.formProvider.getItems(elmt.datas.toJSON()).subscribe(
      res => {
          elmt.customData = res;
          elmt.selected = elmt.defaultValue;
          console.log(indexI + '      ' + indexJ);
          const id = setInterval(() => {
          if (this.datas[indexI] !== undefined && this.datas[indexI].sectionElements[indexJ] !== undefined) {
            Object.assign(this.datas[indexI].sectionElements[indexJ], {...elmt});
            clearInterval(id);
          }
        }, 400);
      },
      err => console.log(err));
}

changeVisibilityElement(formFieldName: string, visibility: boolean) {
  const datas1 = [];
  let update = false;
  this.datas.map(elmt => {
    const obj = {
      section: undefined,
      sectionElements: undefined
    };
    obj.section = elmt.section;
    obj.sectionElements = [];
    elmt.sectionElements.map(elment => obj.sectionElements.push({...elment}));
    datas1.push(obj);
  });
  let index = 0;
  const idx = this.keysClass.indexOf(formFieldName);
  if (idx > -1) {
    for (let i = 0; i < datas1.length; i++) {
      const elmts = datas1[i].sectionElements;
      for (let j = 0; j < elmts.length; j++) {
        const formField = elmts[j];
        if (index == idx) {
          if (formField.isInvisible != visibility) {
            formField.isInvisible = visibility;
            update = true;
          }
          index++;
          break;
        }
        index++;
      }
    }
  }
  if (update) {
    this.datas.length = 0;
    this.datas = [...datas1];
  }
}

changeListVisibilityElements(formFieldNames: string[], visibility: boolean) {
  const datas1 = [];
  let update = false;
  this.datas.map(elmt => {
    const obj = {
      section: undefined,
      sectionElements: undefined
    };
    obj.section = elmt.section;
    obj.sectionElements = [];
    elmt.sectionElements.map(elment => obj.sectionElements.push({...elment}));
    datas1.push(obj);
  });

  formFieldNames.map(elmt => {
    let index = 0;
    const idx = this.keysClass.indexOf(elmt);
    if (idx > -1) {
    for (let i = 0; i < datas1.length; i++) {
      const elmts = datas1[i].sectionElements;
      for (let j = 0; j < elmts.length; j++) {
        const formField = elmts[j];
        if (index == idx) {
          if (formField.isInvisible != visibility) {
            formField.isInvisible = visibility;
            update = true;
          }
          index++;
          break;
        }
        index++;
      }
    }
  }
  });
  if (update) {
    this.datas.length = 0;
    this.datas = [...datas1];
  }
}

changeDisabledElement(formFieldName: string, visibility: boolean) {
  let index = 0;
  const idx = this.keysClass.indexOf(formFieldName);
  if (idx > -1) {
    for (let i = 0; i < this.datas.length; i++) {
      const elmts = this.datas[i].sectionElements;
      for (let j = 0; j < elmts.length; j++) {
        const formField = elmts[j];
        if (index == idx) {
          formField.disabled = visibility;
          index++;
          break;
        }
        index++;
      }
    }
  }
}

changeListDisabledElements(formFieldNames: string[], visibility: boolean) {
  formFieldNames.map(elmt => this.changeDisabledElement(elmt, visibility));
}

getAttributeList<T>(obj: T) {
  return Object.keys(obj);
}

publishButton() {
  const btns: ActionButtons[] = [];
  btns.push({
    title : this.validationButton,
    items : [],
    type : 0,
    function : 'sendForm'
  });
  this.cancelButton && this.cancelButton !== '' && btns.push({
    title : this.cancelButton,
    items : [],
    type : 1,
    function : 'cancelSendForm'
  });
  this.resetButton && this.resetButton !== '' && btns.push({
    title : this.resetButton,
    items : [],
    type : 1,
    function : 'resetSendForm'
  });
  this.displayButton.emit(btns);
}

publishTitle() {
  const infos: TitleDescr = {
    title : this.titleForm,
    description : ''
  };
  this.displayTitle.emit(infos);
}

generateDataToSend() {
  if (!this.myform.instance.validate().isValid) {
    return [];
  }
  const dataToSend: any [] = [];
  let index = 0;
  for (let i = 0; i < this.datas.length; i++) {
    const elmts = this.datas[i].sectionElements;
    for (let j = 0; j < elmts.length; j++) {
      const formField = elmts[j];
      switch (formField.type) {
        case FormTypes.INPUT :
          const data = {};
          data[this.keysClass[index]] = formField.defaultValue;
          dataToSend.push(data);
          index ++;
          break;
        case FormTypes.TEXTAREA :
          const data1 = {};
          data1[this.keysClass[index]] = formField.defaultValue;
          dataToSend.push(data1);
          index ++;
          break;
        case FormTypes.DATE :
          const data2 = {};
          data2[this.keysClass[index]] = formField.defaultValue;
          dataToSend.push(data2);
          index ++;
          break;
        case FormTypes.NUMBER_PICKER:
          const data6 = {};
          data6[this.keysClass[index]] = formField.defaultValue;
          dataToSend.push(data6);
          index++;
          break;
        case FormTypes.RADIO :
          const data3 = {};
          data3[this.keysClass[index]] = formField.selected;
          dataToSend.push(data3);
          index ++;
          break;
        case FormTypes.CHEKBOX :
          const data4 = {};
          data4[this.keysClass[index]] = formField.datas.filter(elt => elt.selected == true).map(elmt => elmt.value);
          dataToSend.push(data4);
          index ++;
          break;
        case FormTypes.SELECT :
          const data5 = {};
          if (formField.multiple) { data5[this.keysClass[index]] = formField.defaultValue; } else { data5[this.keysClass[index]] = formField.selected; }
          dataToSend.push(data5);
          index ++;
          break;
      }
    }
  }
  return dataToSend;
}



}
