import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  AllProducts : any = [];
  confirmationstatus : boolean = false;
  token = sessionStorage.getItem('token');


  constructor( private adminservice : AdminService,
    private notification : NotificationService,
    private http: HttpClient,
    private router : Router)
  {
      this.GetAllProducts();
  }

  GetAllProducts(){
    this.adminservice.GetAllProductsForAdmin().subscribe(
      data =>{
        console.log(data);
        this.AllProducts = data;
      } 
    )
  }


  deleteProduct(productId: number) {
    const PopupBox = document.createElement('div');
    PopupBox.className = 'PopupOverlay';
    PopupBox.innerHTML = `
        <div class="PopupContainer">
            <p>Are you sure you want to delete ?</p>
            <div class="PopupInsidebuttonContainer">
                <button id="Cancel">Cancel</button>
                <button id="Confirm">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(PopupBox); // Append it immediately

    const cancelButton = PopupBox.querySelector("#Cancel") as HTMLElement; // Use `PopupBox.querySelector` instead of `document.getElementById`
    const confirmButton = PopupBox.querySelector("#Confirm") as HTMLElement;

    cancelButton.onclick = () => {
        document.body.removeChild(PopupBox);
        this.confirmationstatus = false;
    };

    confirmButton.onclick = () => {
        this.confirmationstatus = true;
        document.body.removeChild(PopupBox);
        // console.log("Confirmed:", this.confirmationstatus);
        // Only execute delete request after confirmation
        this.http.delete(`http://localhost:5156/api/Product/${productId}`,{
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
          withCredentials: true
        }).subscribe(
            () => {
                this.notification.ShowMessage("Product deleted successfully!", "notify", 3000);
                this.GetAllProducts(); // Refresh product list
            },
            (error) => {
                console.error("Error deleting product:", error);
                this.notification.ShowMessage("Failed to delete product. Please try again.", "warn", 3000);
            }
        );
    };
  }
}




  // deleteProduct(productId: number) {
  //   setTimeout(() => {
  //     document.body.appendChild(PopupBox);
  //   }, 100);
  
  //   // var AllProductsListContainer = document.querySelector(".AllProductsListContainer") as HTMLElement;
  //   // console.log(AllProductsListContainer);
  //     const PopupBox = document.createElement('div');
  //     PopupBox.className = 'PopupOverlay';
  //     PopupBox.innerHTML = `
  //         <div class="PopupContainer">
  //             <p>Are you sure you want to delete ?</p>
  //             <div class="PopupInsidebuttonContainer">
  //                 <button id="Cancel">Cancel</button>
  //                 <button id="Confirm">Confirm</button>
  //             </div>
  //         </div>
  //     `;
  //     document.body.append(PopupBox);

  //     const cancelbutton = document.getElementById("Cancel") as HTMLElement;
  //     var confirmButton = document.getElementById("Confirm") as HTMLElement;

  //     cancelbutton.onclick = function() {
  //       document.body.removeChild(PopupBox); 
  //       this.confirmationstatus = false;
  //     };
      
  //     confirmButton.onclick = function() {
  //         this.confirmationstatus = true;
  //         document.body.removeChild(PopupBox); // Close popup after confirmation
  //         console.log("Confirmed:", this.confirmationstatus);
  //     };
  //     console.log(this.confirmationstatus);

  //   if (this.confirmationstatus) {
  //     this.http.delete(`http://localhost:5156/api/Product/${productId}`).subscribe(
  //         () => {
  //             this.notification.ShowMessage("Product deleted successfully!","notify",3000);
  //             this.GetAllProducts(); // Refresh product list
  //         },
  //         (error) => {
  //             console.error("Error deleting product:", error);
  //             this.notification.ShowMessage("Failed to delete product. Please try again.","warn",3000);
  //         }
  //     );
  //   }
  // }








    // editProduct(product : any){
    //   this.router.navigate(['/admin/addproduct'], { state: { product } });
    // }

    // UpdateStockOnly(id :any)
    // {
        
    // }

