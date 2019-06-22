import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';
import { DxCheckBoxModule, DxSelectBoxModule, DxFormModule, DxTextAreaModule, DxRadioGroupModule, DxTextBoxModule, DxDateBoxModule, DxTagBoxModule, DxNumberBoxModule, DxValidatorModule, DxValidationGroupModule } from 'devextreme-angular';
import { DynamicFormService } from './dynamic-form.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    CommonModule, HttpClientModule,DxCheckBoxModule,DxFormModule,DxSelectBoxModule,
      DxTextAreaModule,DxRadioGroupModule,DxTextBoxModule,DxDateBoxModule,DxTagBoxModule, DxNumberBoxModule, DxValidatorModule,
      DxValidationGroupModule
  ],
  providers : [DynamicFormService],
  exports: [DynamicFormComponent]
})
export class DynamicFormModule { }
