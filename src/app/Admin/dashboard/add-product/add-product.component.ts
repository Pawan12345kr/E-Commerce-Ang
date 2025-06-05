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
    
// editing the product by getting the id from thr url using active route
    const productid = this.route.snapshot.paramMap.get("id");
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
      }
    )
  }

  AddNewProduct(){
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