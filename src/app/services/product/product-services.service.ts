import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

private product = environment.url + 'products';
  constructor( private http:HttpClient ) { }


  getAllProducts():Observable<any>{
    return this.http.get(this.product + "/getAll");
  }

  // getgetUser_InfoById(id:any):Observable<any>{
  //   return this.http.get(this.user_details + "/getUserById/" + id);
  // }

  // updateKindetails(id:any,data:any){
  //   return this.http.put(this.kin+"/updateKin"+id,data);
  // }

  // deleteUser_Info(id:any){
  //   return this.http.delete(this.user_details+"/deleteUser"+id);
  // }

  // creatkin(data:any):Observable<any>{
  //   return this.http.post(this.kin+"/addKin",data);
  // }
  // getKinByInvestorsID(investorsID: number): Observable<any> {
  //   return this.http.get<any>(`${this.kin}/GetKinByinvestorsID/?investorsID=${investorsID}`);
  // }
}   

