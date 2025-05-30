import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  location = '';

  // search 
  searchResults : any[] = [];
  searchTerm = '';
  NoProductsFound = false;


  constructor(private authService: AuthService, 
    private router: Router,
  private notification : NotificationService) {}
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    this.updateLocation();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  navigateToHome(){
    this.router.navigate(['/home']);
  }
  navigateToLogin()
  {
    this.router.navigate(['/login']);
  }
  navigateToCart()
  {
    if (!this.authService.isAuthenticated()) {
      // alert("You need to log in before accessing the cart.");
      this.notification.ShowMessage("Log in to access the cart","bad",3000)

      return;
    }

    console.log("Navigating to cart...");
    this.router.navigate(['/cart']);
  }
  navigateToProfile()
  {
    if (!this.authService.isAuthenticated()) {
      this.notification.ShowMessage("Please Log In to Access","bad",3000);
      // alert("Please log in to access your profile.");
      return;
    }

    this.router.navigate(['/profile']);
  }
  updateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.getAddressFromCoordinates(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          this.notification.ShowMessage("Unable to fetch location. Please enable GPS.","bad",3000);

          // alert('Unable to fetch location. Please enable GPS.');
        }
      );
    } else {
      // alert('Geolocation is not supported by your browser.');      
      this.notification.ShowMessage("Geolocation is not supported by your browser.","bad",3000);

    }
  }
  getAddressFromCoordinates(lat: number, lng: number) {
    const apiKey = '2723b29fa2bf4484bc912ae96f849fca'; 
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log("response data",data);
        if (data.features.length > 0) {
          this.location = data.features[0].properties.formatted; 
        } else {
          //console.error('No address found');
          // alert('Unable to fetch address.');      
          this.notification.ShowMessage("Unable to fetch address.","bad",3000);

        }
      })
      .catch(error => {
        //console.error('Error fetching address:', error);
        // alert('Error fetching address.');
        this.notification.ShowMessage("Error fetching address.","bad",3000);

      });
  }


  // serach method 
  async OnSearchInput(event : any){
    // this.searchTerm = query;
    var query = event.target.value.trim();
    // query=this.searchTerm;
    if(!query)
    {
      this.searchResults = [];
      return;
    }

    try{
      const response = await fetch(`http://localhost:5156/api/Product/search?query=${encodeURIComponent(query)}`);
      if(!response.ok)
      {
        throw new Error('Search failed');
      }
      else{
        
        var data = await response.json();
        if(data.productfoundstatus == false)
        {
          // console.log("No products found .....");
          this.NoProductsFound = true;
          this.searchResults = [];
        }
        else{
          this.NoProductsFound = false;
          this.searchResults = data;
          // console.log(this.searchResults);
        }
        
      };
    }
    catch(err){
      console.error(`Error : `, err);
      this.searchResults = [];
    }
  }
}
