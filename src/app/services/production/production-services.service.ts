import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionServicesService {

private production = environment.url + 'productions';
  constructor( private http:HttpClient ) { }


  // getAllProducts():Observable<any>{
  //   return this.http.get(this.product + "/getAll");
  // }

  getTotalProductionByID(id:any):Observable<any>{
    return this.http.get(this.production + "/getTotalProductionByDay/" + id);
  }
   getProductionByIDandDate(id:any,date:any,name:any):Observable<any>{
    return this.http.get(this.production + "/getTotalProductionByDayForUser/" + id + "/"+ date + "/" + name);
  }

  // updateKindetails(id:any,data:any){
  //   return this.http.put(this.kin+"/updateKin"+id,data);
  // }

  // deleteUser_Info(id:any){
  //   return this.http.delete(this.user_details+"/deleteUser"+id);
  // }

  createProduction(data:any):Observable<any>{
    return this.http.post(this.production+"/Create_production",data);
  }
  // getKinByInvestorsID(investorsID: number): Observable<any> {
  //   return this.http.get<any>(`${this.kin}/GetKinByinvestorsID/?investorsID=${investorsID}`);
  // }
}   
