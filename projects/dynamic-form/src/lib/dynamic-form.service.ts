import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(private http : HttpClient) {
  }

  getItems(url : string, header? : HttpHeaders) {
    return this.http.get(url,{headers : header});
  }

}
