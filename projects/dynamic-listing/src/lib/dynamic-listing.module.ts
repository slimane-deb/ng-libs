import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxTemplateModule, DxButtonModule, DxPopupModule, DxFormModule, DxSelectBoxModule, DxTextAreaModule, DxRadioGroupModule, DxTextBoxModule, DxDateBoxModule, DxTagBoxModule, DxNumberBoxModule, DxValidatorModule, DxValidationGroupModule, DxCheckBoxModule } from 'devextreme-angular';
import { DynamicListingComponent } from './dynamic-listing.component';
import { DynamicListingService } from './dynamic-listing.service';

@NgModule({
  declarations: [DynamicListingComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxButtonModule,
    DxPopupModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxRadioGroupModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxTagBoxModule,
    DxNumberBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxCheckBoxModule
  ],
  providers : [DynamicListingService],
  exports : [DynamicListingComponent]
})
export class DynamicListingModule { }
