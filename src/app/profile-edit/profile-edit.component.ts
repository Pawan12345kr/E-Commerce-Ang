import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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
        pincode : 0,
        phoneNumber: 0
    }
    constructor(private route :ActivatedRoute,
      private http: HttpClient,
      private authservice:AuthService
    ){}

    ngOnInit(){
      this.route.queryParams.subscribe((param : any) =>{
        this.user_info = JSON.parse(param['userdetails']);
        // console.log(this.user_info);
      })
    }

    updateUserInfo(){
      var token = this.authservice.getToken();
      var userpayload = {
          email: this.user_info.email,
          password : '',
          fullName: this.user_info.name,
          pincode: this.user_info.pincode,
          address: this.user_info.address,
          phoneNumber: this.user_info.mobile
      };
      console.log(userpayload);
      console.log("UserInfo : ",userpayload);
      this.http.put(`http://localhost:5156/api/Account/update/customer`,userpayload,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      }).subscribe({
        next : (response :any) => {
          console.log(response.message)
        }
      });
    }
}
