import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-profile-edit',
  imports: [HeaderComponent,CommonModule,FormsModule,RouterLink],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
    user_info : any = {
        name: '',
        email:'',
        address:'',
        pincode : '',
        phoneNumber: ''
    }
    constructor(private route :ActivatedRoute,
      private http: HttpClient,
      private authservice:AuthService,
      private notification: NotificationService,
      private router  :Router
    ){}
 
    ngOnInit(){
      this.route.queryParams.subscribe((param : any) =>{
        if(param['userdetails']){
          this.user_info = JSON.parse(param['userdetails']);
          // console.log(this.user_info);
        }
        else{
          this.notification.ShowMessage("User details not found ",'warn',3000);
        }
      })

      document.addEventListener("keydown",(event) => {
        if(event.key === "Enter"){
            this.updateUserInfo();
        }
      });
    }
    
    validateUserInfo(): boolean {
      const { name, email, address, pincode, mobile } = this.user_info;
     
      const pincodePattern = /^[1-9][0-9]{5}$/;  
      const phoneNumberPattern = /^[6-9][0-9]{9}$/;
 
      if (!name.trim() || !email.trim() || !address.trim()) {
        this.notification.ShowMessage("Name, Email, and Address cannot be empty", "warn", 3000);
        return false;
      }
 
      if (!pincodePattern.test(pincode)) {
          this.notification.ShowMessage("Invalid Pincode", "warn", 3000);
          return false;
      }
 
      if (!phoneNumberPattern.test(mobile)) {
          console.log("Invalid phone number");
          this.notification.ShowMessage("Invalid Phone Number", "warn", 3000);
          return false;
      }
      return true;
    }

    updateUserInfo(){
      if(!this.validateUserInfo()) return
      var token = this.authservice.getToken();
      var userpayload = {
          email: this.user_info.email,
          password : '',
          fullName: this.user_info.name,
          pincode: this.user_info.pincode,
          address: this.user_info.address,
          phoneNumber: this.user_info.mobile
      };
      this.http.put(`http://localhost:5156/api/Account/update/customer`,userpayload,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      }).subscribe({
        next : (response :any) => {
          this.router.navigateByUrl('/profile');
          this.notification.ShowMessage("Customer Details Updated Successfully","good",3000);
        }
      });
    }
}






// import { Component } from '@angular/core';
// import { HeaderComponent } from '../header/header.component';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-profile-edit',
//   imports: [HeaderComponent,CommonModule,FormsModule,RouterLink],
//   templateUrl: './profile-edit.component.html',
//   styleUrl: './profile-edit.component.css'
// })
// export class ProfileEditComponent {
//     user_info : any = {
//         name: '',
//         email:'',
//         address:'',
//         pincode : 0,
//         phoneNumber: 0
//     }
//     constructor(private route :ActivatedRoute,
//       private http: HttpClient,
//       private authservice:AuthService
//     ){}

//     ngOnInit(){
//       this.route.queryParams.subscribe((param : any) =>{
//         this.user_info = JSON.parse(param['userdetails']);
//         // console.log(this.user_info);
//       })
//     }

//     updateUserInfo(){
//       var token = this.authservice.getToken();
//       var userpayload = {
//           email: this.user_info.email,
//           password : '',
//           fullName: this.user_info.name,
//           pincode: this.user_info.pincode,
//           address: this.user_info.address,
//           phoneNumber: this.user_info.mobile
//       };
//       console.log(userpayload);
//       console.log("UserInfo : ",userpayload);
//       this.http.put(`http://localhost:5156/api/Account/update/customer`,userpayload,{
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         withCredentials: true
//       }).subscribe({
//         next : (response :any) => {
//           console.log(response.message)
//         }
//       });
//     }
// }
