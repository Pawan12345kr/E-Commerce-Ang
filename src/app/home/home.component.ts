import { Component } from '@angular/core';
import { ProductService, Category } from '../services/product.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  category: any[] = [];

  AllProducts :any[]= [];
  isLoggedIn: boolean = false;
  private imageUrls = ["1.jpg", "2.jpg", "3.jpg","4.jpg","5.png"];
  private currentIndex = 0;
  

  constructor(private notification : NotificationService,
     private productService: ProductService,
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit(): void {
    // this.authService.isLoggedIn$.subscribe(status => {
    //   this.isLoggedIn = status;
    // });

    if(this.authService.isAuthenticated())
    {
        this.isLoggedIn = true;
    }

    
    this.productService.getCategory().subscribe({
      next: (data) => {
        console.log('Received Category Data:', data);
        this.category = data;
      console.log("Category image url" ,this.category);

      },
      error: (error) => console.error('Error fetching categories:', error),
    });
    // Set the first image immediately
  const adImage = document.getElementById("adImage") as HTMLImageElement;
  if (adImage) {
    adImage.src = this.imageUrls[this.currentIndex];
  }

  this.startImageLoop();
  this.GetAllProducts();
  }

  startImageLoop() {
    setInterval(() => {
      this.updateImage();
    }, 3000); 
  }

  updateImage() {
    const adImage = document.getElementById("adImage") as HTMLImageElement;
    if (adImage) {
      adImage.src = this.imageUrls[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    }
  }

  viewProducts(productId: number): void {
    this.router.navigate([`/category/${productId}`]);
  }

  
  GetAllProducts() {
     fetch('http://localhost:5156/api/Product/GetAllProductsforCustomer')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(products => {
          console.log(products);
          this.AllProducts=products;
          console.log("All Products:",this.AllProducts);
          this.AllProducts.forEach(product => console.log(product));
        })
        .catch(error => console.error('Error fetching products:', error));
  }

  addToCart(productId:number) {
    const cartItem = { 
      productId: productId, 
      quantity: 1 
    };

    this.authService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log("Product added successfully!", response)
        this.notification.ShowMessage("Item Added to cart","good",3000);
      },
      error: (error) => {
        console.error("Error adding product to cart:", error);
        // this.notification.ShowMessage("Error adding product to cart","warn",3000);
      }
    });
  }

  // getImageUrl(product: any): string {
  //   return '/images/' + product.imageUrl.replace('/images', '');
  // }
  

}
