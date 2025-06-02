import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:5156/api/Account/login';
  private registerUrl = 'http://localhost:5156/api/Account/register/customer';

  constructor(private http: HttpClient, private notification: NotificationService) {}

  login(email: string, password: string): Observable<{ success: boolean; token: string ; role : string}> {
    return this.http.post<{ success: boolean; token: string ; role : string}>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        if (response.success) {
          sessionStorage.setItem('token', response.token); 
          console.log("Role : ", response.role);
          // Store JWT securely
        } else {
          this.notification.ShowMessage("Login Failed", "warn", 3000);
        }
      }),
      catchError(error => {
        console.error('Login Error:', error);
        this.notification.ShowMessage("Login Error", "warn", 3000);
        return throwError(() => error);
      })
    );
  }

  register(FullName: string, Address: string, Email: string, Password: string, Pincode: string, PhoneNumber: string): Observable<any> {
    const payload = { FullName, Address, Email, Password, Pincode, PhoneNumber };

    return this.http.post(this.registerUrl, payload, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap(response => console.log('Registration Response:', response)),
      catchError(error => {
        console.error('Registration Failed:', error);
        this.notification.ShowMessage("Registration Failed", "warn", 3000);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  addToCart(cartItem: { productId: number; quantity: number }): Observable<{ success: boolean; message: string }> {
    const apiUrl = 'http://localhost:5156/api/Cart/add';
    const token = this.getToken();

    return this.http.post<{ success: boolean; message: string }>(apiUrl, cartItem, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).pipe(
      tap(response => console.log("Cart API Response:", response)),
      catchError(error => {
        console.error("Cart API Error:", error);
        this.notification.ShowMessage("You need to Login", "notify", 3000);
        return throwError(() => error);
      })
    );
  }
}





// import { Injectable } from '@angular/core';
// import {BehaviorSubject, Observable} from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import {tap} from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs'; 
// import { NotificationService } from './notification.service';
// @Injectable({
//   providedIn: 'root'
// })


// export class AuthService {
//   private loginurl ='http://localhost:5156/api/Account/login';
//   private registerapiurl = 'http://localhost:5156/api/Account/register/customer';
  

//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);
//   isLoggedIn$ = this.isLoggedInSubject.asObservable();

//   constructor(private http: HttpClient , private notification : NotificationService) { }

//   login(email: string, password: string) {
//     return this.http.post<{ success: boolean; token: string }>(this.loginurl, { email, password }).pipe(
//       tap(response => {
//         console.log('Login Response:', response);
//         if (response.success) {
//           sessionStorage.setItem('token', response.token); // Store JWT securely
//           this.isLoggedInSubject.next(true);
//         } else {
//           this.isLoggedInSubject.next(false);
//         }
//       })
//     );
//   }
  
//   register(FullName: string, Address: string, Email: string, Password: string, Pincode: string, PhoneNumber: string): Observable<any> {
//     const payload = { FullName, Address, Email, Password, Pincode, PhoneNumber };
//     console.log('Register Request Payload:', payload);
  
//     return this.http.post(this.registerapiurl, payload, { headers: { 'Content-Type': 'application/json' } }).pipe(
//       tap({
//         next: (response) => {
//           console.log('Registration Response:', response); 
//         },
//         error: (error) => {
//           console.error('Registration Failed:', error); 
//           this.notification.ShowMessage("Registration Failed","bad",3000)

//         }
//       })
//     );
//   }
//   getToken(): string | null {
//     return sessionStorage.getItem('token'); 
//   }
//   logout() {
//     sessionStorage.removeItem('token'); //  Clear JWT token on logout
//     this.isLoggedInSubject.next(false);
//   }
//   isAuthenticated(): boolean {
//     return !!this.getToken(); // Check authentication status
//   }
//   addToCart(cartItem: { productId: number; quantity: number }) {
//     const apiUrl = 'http://localhost:5156/api/Cart/add';
//     const token = this.getToken(); 
  
//     return this.http.post<{ success: boolean; message: string }>(
//       apiUrl,
//       cartItem,
//       {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}, 
//         withCredentials: true
//       }
//     ).pipe(
//       tap(response => console.log("Cart API Response:", response)),
//       catchError(error => {
//         console.error("Cart API Error:", error);
//         this.notification.ShowMessage("You need to Login","bad",3000)
//         return throwError(() => error);
//       })
//     );
//   }
// }







