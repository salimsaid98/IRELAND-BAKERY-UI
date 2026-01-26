import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderItemsServicesService {
private order = environment.url + 'orderItems';
  constructor( private http:HttpClient ) { }


  getAllOrders():Observable<any>{
    return this.http.get(this.order + "/getAllOrderItems");
  }

  getOrderItemsByID(id:any):Observable<any>{
    return this.http.get(this.order + "/orderItemsByOrderId/" + id);
  }

   getOrderItemsByApp_user_and_date(id:any,date:any):Observable<any>{
    return this.http.get(this.order + "/cashOrdersByUserIdAndOrderDate/" + id + "/"+ date);
  }

  // updateKindetails(id:any,data:any){
  //   return this.http.put(this.kin+"/updateKin"+id,data);
  // }

  // deleteUser_Info(id:any){
  //   return this.http.delete(this.user_details+"/deleteUser"+id);
  // }

  create_Order(data:any):Observable<any>{
    return this.http.post(this.order+"/Create_orderItems",data);
  }
  // getKinByInvestorsID(investorsID: number): Observable<any> {
  //   return this.http.get<any>(`${this.kin}/GetKinByinvestorsID/?investorsID=${investorsID}`);
  // }
}   