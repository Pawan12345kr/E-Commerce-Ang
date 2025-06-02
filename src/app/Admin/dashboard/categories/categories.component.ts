import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { NotificationService } from '../../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  AllCategories : any = [];
  confirmationstatus : boolean = false;
  token = sessionStorage.getItem('token');


  constructor( private adminservice : AdminService,
    private notification : NotificationService,
    private http: HttpClient,
    private router : Router)
  {
      this.GetAllCategories();
  }

  GetAllCategories(){
    this.adminservice.GetAllCategoriesforAdmin().subscribe(
      data =>{
        console.log(data);
        this.AllCategories = data;
      } 
    )
  }


  deleteProduct(Categoryid: number) {
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
        this.http.delete(`http://localhost:5156/api/Categories/${Categoryid}`,{
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
          withCredentials: true
        }).subscribe(
            () => {
                this.notification.ShowMessage("Product deleted successfully!", "notify", 3000);
                this.GetAllCategories(); // Refresh product list
            },
            (error) => {
                console.error("Error deleting product:", error);
                this.notification.ShowMessage("Failed to delete product. Please try again.", "warn", 3000);
            }
        );
    };
  }
}
