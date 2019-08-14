import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DynamicListingService {

  constructor(private http : HttpClient) { }

  getItems(url : string,header? : HttpHeaders) {
    return this.http.get(url,{headers : header});
  }

  getRouteAndParams(href: string): any[] {
    const route = href.split('?')[0];
    let paramsString = href.split('?')[1];
    const params: any[] = [];
    if (paramsString !== undefined) {
      paramsString = paramsString.split('#')[0];
      const attribute = paramsString.split('&');
      attribute.map(attrib => {
        params.push(attrib.split('=')[1]);
      });
    }
    params.unshift(route);
    return params;

  }
}
