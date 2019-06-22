import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TitleDescr } from './authorTypes/titleDescription';
import { DynamicListingService } from './dynamic-listing.service';

@Component({
  selector: 'lib-dynamic-listing',
  templateUrl: './dynamic-listing.component.html',
  styleUrls: ['./dynamic-listing.component.scss']
})
export class DynamicListingComponent implements OnInit {

  @Output() onRowClicked = new EventEmitter<any>();

  @Output() onHrefClicked = new EventEmitter<any>();
  
  @Input()
  nameCls : string;

  @Input()
  handlerInstantition : object;
  
  titleForm : string;
  urlValidation : URL;
  columnResize: boolean;
  globalSearch : boolean;
  searchRow : boolean;

  @Input()
  datas : any[] = [];

  @Output()
  displayTitle = new EventEmitter<any>();

  itemsField : any[] = [];

  private keysClass : string[]=[];
  template : string = "cellTemplate";

  constructor(private listingProvider : DynamicListingService) { 
    this.publishTitle = this.publishTitle.bind(this);
    this.parseClass = this.parseClass.bind(this);
    setTimeout(()=> this.parseClass(),0);
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
      this.columnResize = attributeAccess.headers.resizeColomns;
      keys.splice(idx,1);
      this.publishTitle();
    }
    keys.map(elmt=> {
      if (!attributeAccess[elmt].value) attributeAccess[elmt].value=elmt;
      else attributeAccess[elmt].value = attributeAccess[elmt].value.split('->').join('.');
      return this.itemsField.push(attributeAccess[elmt])
    });
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


}

