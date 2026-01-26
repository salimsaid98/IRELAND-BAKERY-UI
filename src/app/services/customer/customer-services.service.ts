import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerServicesService {
private customer = environment.url + 'customers';
  constructor( private http:HttpClient ) { }


  getAllCustomer():Observable<any>{
    return this.http.get(this.customer + "/getAllCustomers");
  }
  getAllCustomerBalance():Observable<any>{
    return this.http.get(this.customer + "/balances");
  }

  get_CustomerByID(id:any):Observable<any>{
    return this.http.get(this.customer + "/customer/" + id);
  }

updateCustomer(id: any, data: any) {
  return this.http.put(
    `${this.customer}/customer/update/${id}`,
    data
  );
}

  deleteCustomer(id:any){
    return this.http.delete(
    `${this.customer}/customer/delete/${id}`,
  );
  }

  createCustomer(data:any):Observable<any>{
    return this.http.post(this.customer+"/customer",data);
  }
getCustomerIDbalance(customer_id: any): Observable<any> {
  return this.http.get<any>(`${this.customer}/balance/${customer_id}`);
}

}   


