import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // ShowMessage(message : string ,status : string, duration : number){
  //   const notificationDiv = document.createElement('div');
  //   notificationDiv.innerText = message;
  //   notificationDiv.className = 'notification-popup';
  //   if(status == "good")
  //   {
  //     notificationDiv.style.color= "white";
  //   }
  //   else if(status == "bad")
  //   {
  //     notificationDiv.style.color= "red";
  //   }

  //   document.body.appendChild(notificationDiv);

  //   setTimeout(() => {
  //     notificationDiv.remove();
  //   }, duration);
  // }

  imageSrc : string = '' ;
  ShowMessage(message : string ,status : string, duration : number){
    const notificationDiv = document.createElement('div');
    
    if(status == "good")
    {
      this.imageSrc = "tick.svg";
    }
    else if(status == "info")
    {
      this.imageSrc = "filen.svg";
    }
    else if(status == "notify")
    {
      this.imageSrc = "redbell.svg";
    }
    else if(status == "delete"){
      this.imageSrc = "deletebin.svg";
    }
    else if(status == "warn")
      {
        this.imageSrc = "warn.svg";
      }

    
    // let imageSrc = status == "good" ? "tick.svg" : "warning.svg";
    notificationDiv.innerHTML = `
          <div class="ContentContainer">
                <span class="statusimage">
                    <img src=${this.imageSrc} alt="">
                </span>
                <span class="MessageContainer">
                    <p class="Messages">${message}</p>
                </span>
                <span class="CloseContainer">
                  <img src="closewhite.png" alt="" onclick="this.parentElement.parentElement.parentElement.remove()">
                </span>
          </div>
    `;
    notificationDiv.className = 'NotificationContainer';
    // if(status == "good")
    // {
    //   notificationDiv.style.color= "white";
    // }
    // else if(status == "bad")
    // {
    //   notificationDiv.style.color= "red";
    // }

    document.body.appendChild(notificationDiv);

    setTimeout(() => {
      notificationDiv.remove();
    }, duration);
  }
}
