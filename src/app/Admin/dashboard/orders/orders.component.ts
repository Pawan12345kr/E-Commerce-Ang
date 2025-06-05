import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  AllOrders : any = [];
  // Current_Order ={
  //   address: '',
  //   orderDate: '',
  //   orderItems: [],
  //   paymentMethod: '',
  //   pincode: 0,
  //   status: '',
  //   totalPrice:0
  // }
  constructor(
    private authservice : AuthService,
    private http : HttpClient
  ){}

  ngOnInit(){
    this.FetchAllOrders();
  }

  FetchAllOrders(){
    const token = this.authservice.getToken();
    const fetchallordersUrl = 'http://localhost:5156/api/Order/GetAllOrders'
    this.http.get(fetchallordersUrl,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true 
    }).subscribe((data:any) => {
        console.log("------all Orders---- : " ,data);
        this.AllOrders = data ;
        // console.log("All : ",this.AllOrders);
    })
  }

  OpenStatusChangePopup(orderid : number){
    var order_status = '';

    const popupoverlaybg : HTMLElement = document.createElement('div');

    popupoverlaybg.className = 'PopupOverLayBG';
    popupoverlaybg.innerHTML = `
      <div class="StatusChangePopupContainer">
            <h4>Update Order status</h4>
            <div class="inputContainerforradio">
                <span>
                    <input type="radio" name="status" id="Pending">
                    <label for="Pending">Pending</label>
                </span>
                <span>
                    <input type="radio" name="status" id="Shipped">
                    <label for="Pending">Shipped</label>
                </span>
                <span>
                    <input type="radio" name="status" id="Delivered">
                    <label for="Pending">Delivered</label>
                </span>
            </div>
            <div class="ButtonCont">
              <button id="CancelButton" (click)="">cancel</button>
              <button id="updatebutton">update</button>
            </div>
        </div>
        `;
        document.body.appendChild(popupoverlaybg);

        // var cancelbut = document.getElementById("CancelButton") as HTMLElement;
        // cancelbut.onclick = function(){
        //   document.body.removeChild(popupoverlaybg);
        // }

        const closebtn = document.getElementById("CancelButton") as HTMLElement;
        closebtn.addEventListener('click',() => {
            document.body.removeChild(popupoverlaybg);
        })

        const UpdateBut = document.getElementById("updatebutton") as HTMLElement;
        UpdateBut.addEventListener('click',() => {
          console.log("hi from update button pressed through add event listener .. ");

            const PendingCB = document.getElementById("Pending") as HTMLInputElement;
            const ShippedCB = document.getElementById("Shipped") as HTMLInputElement;
            const deliveredCB = document.getElementById("Delivered") as HTMLInputElement;
      
            if(PendingCB.checked){
              order_status = 'Pending';
            }
            else if(ShippedCB.checked){
              order_status = 'Shipped';
            }
            else if(deliveredCB.checked){
              order_status = 'Delivered';
            }
            else{
              order_status = 'Pending';
            }
            console.log(order_status);
            this.updatestatus(orderid,order_status);
        })
        // UpdateBut.onclick = function(){
        //   this.updatestatus(orderid,order_status);
        //     console.log("---you reached the update fun ----")

        //     const PendingCB = document.getElementById("Pending") as HTMLInputElement;
        //     const ShippedCB = document.getElementById("Shipped") as HTMLInputElement;
        //     const deliveredCB = document.getElementById("Delivered") as HTMLInputElement;
      
        //     if(PendingCB.checked){
        //       order_status = 'Pending';
        //     }
        //     else if(ShippedCB.checked){
        //       order_status = 'Shipped';
        //     }
        //     else if(deliveredCB.checked){
        //       order_status = 'Delivered';
        //     }
        //     console.log(order_status);
        //     // this.updatestatus(orderid,order_status);
        // }
      }


      updatestatus(orderid : number , status : string){

        console.log("i also received the call ")
        var token = this.authservice.getToken();

        this.http.patch(`http://localhost:5156/api/Order/UpdateOrderStatus/${orderid}?orderStatus=${status}`,{},{
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }).subscribe((data : any) => {
          console.log("response for order status : ",data);

          const PopupOverLayBG = document.querySelector(".PopupOverLayBG") as HTMLElement;
          document.body.removeChild(PopupOverLayBG);
          this.FetchAllOrders();
        })
      }
  }
