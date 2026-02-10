import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeServicesService {
 private unit_types = environment.url + 'unit_types';
   constructor( private http:HttpClient ) { }
 
 
   getAll():Observable<any>{
     return this.http.get(this.unit_types + "/getUnitTypeWithProductName");
   }
 
  //  getOrderByCustomerId(id:any):Observable<any>{
  //    return this.http.get(this.order + "/orderbycustomer_id/" + id);
  //  }
 
  //   getRoleNameByUserID(id:any):Observable<any>{
  //    return this.http.get(this.roles + "/getRoleNameByAppUserId/" + id);
  //  }
 
   // updateKindetails(id:any,data:any){
   //   return this.http.put(this.kin+"/updateKin"+id,data);
   // }
 
   // deleteUser_Info(id:any){
   //   return this.http.delete(this.user_details+"/deleteUser"+id);
   // }
 
  //  create_Order(data:any):Observable<any>{
  //    return this.http.post(this.order+"/Create_order",data);
  //  }
   // getAllCashOrderByUserID(id:any): Observable<any> {
   //   return this.http.get<any>(`${this.order}/GetKinByinvestorsID/?investorsID=${id}`);
   // }
  }
// unit_types/getUnitTypeWithProductName