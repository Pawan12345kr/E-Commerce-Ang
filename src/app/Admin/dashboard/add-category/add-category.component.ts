// import { Component } from '@angular/core';
// import { AdminService } from '../../admin.service';
// import { HttpClient } from '@angular/common/http';
// import { NotificationService } from '../../../services/notification.service';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
 
// @Component({
//   selector: 'app-add-category',
//   imports: [FormsModule,RouterLink],
//   templateUrl: './add-category.component.html',
//   styleUrl: './add-category.component.css'
// })
// export class AddCategoryComponent {
//   buttontitle = 'Add';
//   AllCategories : any = [];
//   NewCategory = {
//       id: 0,
//       name: '',
//       description:'' ,
//       imageUrl: '',
//   };
 
//   constructor(private adminservice : AdminService,
//     private http :HttpClient,
//     private router : Router,
//     private notification: NotificationService,
//     private route : ActivatedRoute,
//     private authservice : AuthService
//   ){}
//   ngOnInit(){
//     const catid = this.route.snapshot.paramMap.get("id");
//     if(catid)
//     {
//       this.adminservice.GetCategoryByIdForAdmin(catid).subscribe(
//         (prod : any) =>{
//           this.buttontitle = 'Update';
//           this.NewCategory = {
//             id:  prod.id ?? this.NewCategory.id,
//             name:  prod.name ?? this.NewCategory.name ,
//             description:  prod.description ?? this.NewCategory.description,
//             imageUrl: prod.imageUrl ?? this.NewCategory.imageUrl
//           };
//         },
//         (error) => console.error("Error fetching category details", error));
//     }
//   }
//   validateCategory(): boolean {
//     if(!this.NewCategory.name.trim() || !this.NewCategory.description.trim())
//     {
//       this.notification.ShowMessage("All fields except image must be filled correctly!", "warn", 3000);
//       return false;
//     }
//     return true;
//   }
 
//   AddOrUpdateCategory(){
//     if(!this.validateCategory()) return;
//     const token = this.authservice.getToken();
   
//     const formdata = new FormData();
//     formdata.append('name',this.NewCategory.name);
//     formdata.append('description',this.NewCategory.description);
 
//     if(this.NewCategory.imageUrl){
//       formdata.append('ImageFile',this.NewCategory.imageUrl)
//     }
 
//     const apiUrl = this.NewCategory.id ? `http://localhost:5156/api/categories/${this.NewCategory.id}` : 'http://localhost:5156/api/Categories';
   
//     const requestMethod = this.NewCategory.id ? this.http.put : this.http.post;
//     requestMethod.call(this.http, apiUrl, formdata, {
//       headers: token ? {Authorization : `Bearer ${token}`} : {},
//       withCredentials: true
//     }).subscribe(()=>
//     {
//       this.notification.ShowMessage(
//         this.NewCategory.id ? "Product updated successfully!" : "Product added successfully!","good",3000);
//     });
//   }
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     console.log(file);
//     this.NewCategory.imageUrl = file;
//   }
// }




import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule,RouterLink],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  buttontitle = 'Add';
  AllCategories : any = [];
  NewCategory = {
      id: 0,
      name: '',
      description:'' ,
      imageUrl: '',
  };

  constructor(private adminservice : AdminService,
    private http :HttpClient,
    private router : Router,
    private notification: NotificationService,
    private route : ActivatedRoute,
    private authservice : AuthService
  ){}
  ngOnInit(){
    this.adminservice.GetAllCategoriesforAdmin().subscribe(
      data => {
        // console.log("Categories for admin : ", data);
        this.AllCategories = data;
        // console.log(this.AllCategories);
      });  
    
// editing the product by getting the id from thr url using active route
    const catid = this.route.snapshot.paramMap.get("id");
    if(catid)
    {
      this.adminservice.GetCategoryByIdForAdmin(catid).subscribe(
        (prod : any) =>{
          // console.log(prod);
          this.buttontitle = 'Update';
          this.NewCategory = {
            id:  prod.id ?? this.NewCategory.id,
            name:  prod.name ?? this.NewCategory.name ,
            description:  prod.description ?? this.NewCategory.description,
            imageUrl: prod.imageUrl ?? this.NewCategory.imageUrl,
          }
        }
      )
    }    
  }

  validateCategory(): boolean {
    if(!this.NewCategory.name.trim() || !this.NewCategory.description.trim())
    {
      this.notification.ShowMessage("All fields must be filled correctly!", "warn", 3000);
      return false;
    }
    return true;
  }

  AddOrUpdateCategory(){
    const token = this.authservice.getToken();
    console.log(this.NewCategory);

    const formdata = new FormData();
    formdata.append('id',this.NewCategory.id.toString());
    formdata.append('name',this.NewCategory.name);
    formdata.append('description',this.NewCategory.description);

    if(this.NewCategory.imageUrl){
      formdata.append('ImageFile',this.NewCategory.imageUrl)
      console.log("Final newCategory data :",this.NewCategory);
    }

    if (this.NewCategory.id) {
      // Updating existing product
      this.http.put(`http://localhost:5156/api/categories/${this.NewCategory.id}`, formdata ,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true}).subscribe(
          () => {
              this.notification.ShowMessage("Category updated successfully!", "good",3000);
              this.router.navigateByUrl('/admin/Categories');
          },
          (error) => {
              console.error("Error updating product:", error);
              this.notification.ShowMessage("Failed to update Category.", "warn",3000);
          }
      );
  } else {
      // Adding new product
      this.http.post('http://localhost:5156/api/Categories', formdata,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).subscribe(
          () => {
              this.notification.ShowMessage("Category added successfully ", "good",3000);
              this.router.navigateByUrl('/admin/Categories');
          },
          (error) => {
              console.error("Error adding product:", error);
              this.notification.ShowMessage("Failed to add Category.", "warn",3000);
          }
      );
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    console.log(file);
    this.NewCategory.imageUrl = file;
  }
}
