import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { DynamicListingComponent } from './dynamic-listing.component';
import { DynamicListingService } from './dynamic-listing.service';

@NgModule({
  declarations: [DynamicListingComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule
  ],
  providers : [DynamicListingService],
  exports : [DynamicListingComponent]
})
export class DynamicListingModule { }
