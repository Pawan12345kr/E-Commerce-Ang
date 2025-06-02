import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private getproducts_url = "http://localhost:5156/api/Product/GetAllProducts";
  private getcategory_url = "http://localhost:5156/api/Categories";
  private getproductbyid_url = "http://localhost:5156/api/Product/GetProductByProductId";
  private getcategorybyid_url = "http://localhost:5156/api/Categories";
  constructor(private http : HttpClient) { }

  GetAllProductsForAdmin(){
    return this.http.get(this.getproducts_url);
  };

  GetAllCategoriesforAdmin(){
    return this.http.get(this.getcategory_url);
  };

  GetCategoryByIdForAdmin(id : any){
    return this.http.get(`${this.getcategorybyid_url}/${id}`);
  }
  GetProductDetailsById(id: any){
    return this.http.get(`${this.getproductbyid_url}/${id}`);
  }
}
