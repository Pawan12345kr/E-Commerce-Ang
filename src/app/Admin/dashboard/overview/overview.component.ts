import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  TotalRevenue : any = 0;
  FetchedOrders : any[] = [];
  totalProduct : number = 0;
  totalcategories : number = 0;

  constructor(
    private authservice : AuthService,
    private http : HttpClient,
  private adminservice : AdminService)
  {}

  ngOnInit(){
    this.FetchAllOrders();
    this.TotalProducts();
    this.TotalCategories();
  }
  
  FetchAllOrders(){
    const token = this.authservice.getToken();
    const fetchallordersUrl = 'http://localhost:5156/api/Order/GetAllOrders'
    this.http.get(fetchallordersUrl,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true 
    }).subscribe((data:any) => {
        console.log("Fetched all Orders : " ,data);
        this.FetchedOrders = data;
        this.CalculateRevenue();
    })
  }

  CalculateRevenue(){
    console.log("calculaterevenue : ",this.FetchedOrders);
    this.FetchedOrders.forEach((order =>{
      this.TotalRevenue += order.totalPrice;
    }))
    console.log("Total reveneue : ",this.TotalRevenue);
  }

  TotalProducts(){
    this.adminservice.GetAllProductsForAdmin().subscribe((data:any) => {
      console.log("total products : ",data.length);
      this.totalProduct = data.length;
    })
  }

  TotalCategories(){
    this.adminservice.GetAllCategoriesforAdmin().subscribe((data : any )=>{
      this.totalcategories = data.length;
    })
  }
}
