import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DynamicFormModule } from 'projects/dynamic-form/src/public-api';
import { DynamicListingModule} from 'projects/dynamic-listing/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DynamicFormModule,
    DynamicListingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
