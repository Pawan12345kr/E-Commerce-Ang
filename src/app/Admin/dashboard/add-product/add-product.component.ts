// import { Component,OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../../admin.service';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { NotificationService } from '../../../services/notification.service';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
 
// @Component({
//   selector: 'app-add-product',
//   imports: [FormsModule,CommonModule,RouterLink],
//   templateUrl: './add-product.component.html',
//   styleUrl: './add-product.component.css'
// })
// export class AddProductComponent  implements OnInit{
 
//   buttontitle = 'Add';
//   AllCategories : any[] = [];
//   NewProduct = {
//       id: 0,
//       name: '',
//       description:'' ,
//       price: 0,
//       stock: 0,
//       brand: '',
//       imageUrl: '',
//       categoryId: 0
//   };
 
//   constructor(private adminservice : AdminService,
//               private http :HttpClient,
//               private router : Router,
//               private notification: NotificationService,
//               private authservice : AuthService,
//               private route : ActivatedRoute){};
 
// ngOnInit() {
//     const productId = this.route.snapshot.paramMap.get("id");
//     if (productId) {
//         this.adminservice.GetProductDetailsById(productId).subscribe(
//           (prod: any) => {
//               this.buttontitle = 'Update';
//               this.NewProduct = {
//               id: prod.id ?? this.NewProduct.id,
//               name: prod.name ?? this.NewProduct.name,
//               description: prod.description ?? this.NewProduct.description,
//               price: prod.price ?? this.NewProduct.price,
//               stock: prod.stock ?? this.NewProduct.stock,
//               brand: prod.brand ?? this.NewProduct.brand,
//               imageUrl: prod.imageUrl ?? this.NewProduct.imageUrl,
//               categoryId: prod.categoryId ?? this.NewProduct.categoryId
//               };
//               },
//           (error) => console.error("Error fetching product details:", error));
//         }
//     }
//     validateProduct(): boolean {
//       if (!this.NewProduct.name.trim() || !this.NewProduct.description.trim() ||
//         this.NewProduct.price <= 0 || this.NewProduct.stock < 0 ||
//         !this.NewProduct.brand.trim() || this.NewProduct.categoryId <= 0) {
//         this.notification.ShowMessage("All fields except image must be filled correctly!", "warn", 3000);
//         return false;
//       }
//       return true;
//     }
//     AddOrUpdateProduct() {
//       if (!this.validateProduct()) return;
 
//       const token = this.authservice.getToken();
//       const formData = new FormData();
//       formData.append('name', this.NewProduct.name);
//       formData.append('description', this.NewProduct.description);
//       formData.append('price', this.NewProduct.price.toString());
//       formData.append('stock', this.NewProduct.stock.toString());
//       formData.append('brand', this.NewProduct.brand);
//       formData.append('categoryId', this.NewProduct.categoryId.toString());
 
//       if (this.NewProduct.imageUrl) {
//         formData.append('ImageFile', this.NewProduct.imageUrl);
//       }
 
//       const apiUrl = this.NewProduct.id
//         ? `http://localhost:5156/api/Product/${this.NewProduct.id}`
//         : 'http://localhost:5156/api/Product';
 
//       const requestMethod = this.NewProduct.id ? this.http.put : this.http.post;
 
//       requestMethod.call(this.http, apiUrl, formData, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         withCredentials: true
//       }).subscribe(
//         () => {
//           this.notification.ShowMessage(
//             this.NewProduct.id ? "Product updated successfully!" : "Product added successfully!",
//             "good", 3000
//           );
//           this.router.navigateByUrl('/admin/Products');
//         },
//         (error) => {
//           console.error("Error saving product:", error);
//           this.notification.ShowMessage(
//             this.NewProduct.id ? "Failed to update product." : "Failed to add product.",
//             "warn", 3000
//           );
//         }
//       );
//     }
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     console.log(file);
//     if(file)  this.NewProduct.imageUrl = file;
//   }
// }


import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent  implements OnInit{

  buttontitle = 'Add';
  AllCategories : any = [];
  NewProduct = {
      id: 0,
      name: '',
      description:'' ,
      price: 0,
      stock: 0,
      brand: '',
      imageUrl: '',
      categoryId: 0
  };

  constructor(private adminservice : AdminService,
              private http :HttpClient,
              private router : Router,
              private notification: NotificationService,
              private authservice : AuthService,
              private route : ActivatedRoute){};
  
  ngOnInit(){
    this.adminservice.GetAllCategoriesforAdmin().subscribe(
      data => {
        // console.log("Categories for admin : ", data);
        this.AllCategories = data;
        // console.log(this.AllCategories);
      });  

      const AddNewProductBtn = document.getElementById("AddNewProductBtn") as HTMLElement;
      const ProductimageUrl = document.getElementById("ProductimageUrl") as HTMLElement;
      document.addEventListener("keydown",(event) => {
        if(event.key === "Enter" && !(document.activeElement === ProductimageUrl) ){
            event.preventDefault();
            this.AddOrUpdateProduct();
        }
      });

// editing the product by getting the id from thr url using active route
    const productid = this.route.snapshot.paramMap.get("id");
    if(productid)
    {
      // console.log(productid);
      this.adminservice.GetProductDetailsById(productid).subscribe(
        (prod : any) =>{
          // console.log(prod);
          this.buttontitle = 'Update';
          this.NewProduct = {
              id:  prod.id,
              name:  prod.name ?? this.NewProduct.name ,
              description:  prod.description ?? this.NewProduct.description,
              price: prod.price ?? (this.NewProduct.price),
              stock: prod.stock ?? this.NewProduct.stock ,
              brand: prod.brand ?? this.NewProduct.brand,
              imageUrl: prod.imageUrl ?? this.NewProduct.imageUrl,
              categoryId: prod.categoryId ?? this.NewProduct.categoryId
          }
        })
    }
  }

  validateProduct(): boolean {
    if (!this.NewProduct.name.trim() || !this.NewProduct.description.trim() ||
      this.NewProduct.price <= 0 || this.NewProduct.stock < 0 ||
      !this.NewProduct.brand.trim() || this.NewProduct.categoryId <= 0) {
      this.notification.ShowMessage("All fields must be filled correctly!", "warn", 3000);
      return false;
    }
    return true;
  }

  AddOrUpdateProduct(){
    if (!this.validateProduct()) return;
    console.log(this.NewProduct);
    const token = this.authservice.getToken();

    const formdata = new FormData();
    formdata.append('id',this.NewProduct.id.toString());
    formdata.append('name',this.NewProduct.name);
    formdata.append('description',this.NewProduct.description);
    formdata.append('price',this.NewProduct.price.toString());
    formdata.append('stock',this.NewProduct.stock.toString());
    formdata.append('brand',this.NewProduct.brand);
    formdata.append('categoryid',this.NewProduct.categoryId.toString());

    if(this.NewProduct.imageUrl){
      formdata.append('ImageFile',this.NewProduct.imageUrl)
      // console.log("Final newproduct data :",this.NewProduct);
    }

    if (this.NewProduct.id) { 
      // Updating existing product
      this.http.put(`http://localhost:5156/api/Product/${this.NewProduct.id}`, formdata ,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true}).subscribe(
          () => {
              this.notification.ShowMessage("Product updated successfully!", "good",3000);
              this.router.navigateByUrl('/admin/Products');
          },
          (error) => {
              console.error("Error updating product:", error);
              this.notification.ShowMessage("Failed to update product.", "warn",3000);
          }
      );
  } else {
      // Adding new product
      this.http.post('http://localhost:5156/api/Product', formdata,{
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).subscribe(
          () => {
              this.notification.ShowMessage("Product added successfully ", "good",3000);
              this.router.navigateByUrl('/admin/Products');
          },
          (error) => {
              console.error("Error adding product:", error);
              this.notification.ShowMessage("Failed to add product.", "warn",3000);
          }
      );
  }


    


    // this.http.post('http://localhost:5156/api/Product',formdata).subscribe(
    //   (data :any ) => {
    //     console.log("response form product post :",data);
    //     if(data.success)
    //     {
    //       this.notification.ShowMessage("Product added successfully ", "good",3000);
    //     }
    //   }
    // )
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    console.log(file);
    this.NewProduct.imageUrl = file;
  }
}


  // const product = history.state.product;
  //   if (product) {
  //       // Ensure values are set correctly
  //       this.NewProduct.id = product.id ?? this.NewProduct.id;
  //       this.NewProduct.name = product.name ?? this.NewProduct.name;
  //       this.NewProduct.description = product.description ?? this.NewProduct.description;
  //       this.NewProduct.price = product.price ?? this.NewProduct.price;
  //       this.NewProduct.stock = product.stock ?? this.NewProduct.stock;
  //       this.NewProduct.brand = product.brand ?? this.NewProduct.brand;
  //       this.NewProduct.imageUrl = product.imageUrl ?? this.NewProduct.imageUrl;
  //       this.NewProduct.categoryId = product.categoryId ?? this.NewProduct.categoryId;
  //   }