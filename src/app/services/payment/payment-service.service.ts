import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

private payment = environment.url + 'payments';
  constructor( private http:HttpClient ) { }


  // getAllCustomer():Observable<any>{
  //   return this.http.get(this.customer + "/getAllCustomers");
  // }

  getAllPaymentBYCustomerID(id:any):Observable<any>{
    return this.http.get(this.payment + "/paymentsByAppUser/" + id);
  }

// updateCustomer(id: any, data: any) {
//   return this.http.put(
//     `${this.customer}/customer/update/${id}`,
//     data
//   );
// }

  // deleteCustomer(id:any){
  //   return this.http.delete(
  //   `${this.customer}/customer/delete/${id}`,
  // );
  // }

  createPayment(data:any):Observable<any>{
    return this.http.post(this.payment+"/Create_payment",data);
  }
  // getKinByInvestorsID(investorsID: number): Observable<any> {
  //   return this.http.get<any>(`${this.kin}/GetKinByinvestorsID/?investorsID=${investorsID}`);
  // }
}
