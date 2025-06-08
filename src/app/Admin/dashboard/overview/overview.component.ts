import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  TotalRevenue : any = 0;
  todayrevenue : any = 0;
  // FetchedOrders : any[] = [];
  totalProduct : number = 0;
  totalCategories : number = 0;
  totalUsers : number = 0 ;
  wholeresponse : any = [];

  OrderStatus = {
   pending : 0,
   shipped : 0,
   delivered : 0
  }

  constructor(
    private authservice : AuthService,
    private http : HttpClient,
  private adminservice : AdminService)
  {}

  ngOnInit(){
    this.FetchAllDetails();
    // this.calculateTodayRevenue();
    // this.TotalProducts();
    // this.TotalCategories();
  }
  
  FetchAllDetails(){
    const token = this.authservice.getToken();
    this.http.get(`http://localhost:5156/api/Admin/GetAllEcommerceDetails/`,{
      headers : token ? {Authorization : `Bearer ${token}`} : {},
      withCredentials : true 
    }).subscribe({
      next : (resp : any) =>{
        console.log(resp);
        this.wholeresponse = resp;
        this.totalProduct = resp.totalproduct;
        this.totalCategories = resp.totalcategory;
        this.totalUsers = resp.totalcustomer;
        this.OrderStatus.pending = resp.pending;
        this.OrderStatus.shipped = resp.shipping;
        this.OrderStatus.delivered = resp.delivered;

        this.calculaterevenue(resp.revenue);
      },error : (error) =>{
        console.log("Errorrrr : " ,error);
      }
    })
  }

  calculaterevenue(orders : any){
      // console.log(orders);
      orders.forEach((order : any)=>{
        this.TotalRevenue += order.totalRevenue;
      })
      this.todayrevenue = orders[0].totalRevenue;
  }
}

