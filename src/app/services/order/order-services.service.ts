import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderServicesService {
private order = environment.url + 'orders';
  constructor( private http:HttpClient ) { }


  getAllOrders():Observable<any>{
    return this.http.get(this.order + "/getAllOrders");
  }

  getOrderByCustomerId(id:any):Observable<any>{
    return this.http.get(this.order + "/orderbycustomer_id/" + id);
  }

   getAllCashOrderByUserID(id:any):Observable<any>{
    return this.http.get(this.order + "/AllcashOrderByUserId/" + id);
  }

  // updateKindetails(id:any,data:any){
  //   return this.http.put(this.kin+"/updateKin"+id,data);
  // }

  // deleteUser_Info(id:any){
  //   return this.http.delete(this.user_details+"/deleteUser"+id);
  // }

  create_Order(data:any):Observable<any>{
    return this.http.post(this.order+"/Create_order",data);
  }
  // getAllCashOrderByUserID(id:any): Observable<any> {
  //   return this.http.get<any>(`${this.order}/GetKinByinvestorsID/?investorsID=${id}`);
  // }
}   
