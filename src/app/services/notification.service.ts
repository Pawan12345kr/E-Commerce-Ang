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


  ShowMessage(message : string ,status : string, duration : number){
    const notificationDiv = document.createElement('div');
    let imageSrc = status == "good" ? "tick.svg" : "warning.svg";
    notificationDiv.innerHTML = `
    <div class="headerfornotification">
      <span class="Title">
          Ubuy-WeSell
      </span>
      <span class="CloseContainer">
        <img src="close.png" alt="" onclick="this.parentElement.parentElement.parentElement.remove()">
      </span>
    </div>
    <div class="ContentContainer">
        <div class="statusimage">
            <img src="${imageSrc}" alt="">
        </div>
        <div class="MessageContainer">
            <p class="Messages">${message}</p>
        </div>
    </div>`;
    notificationDiv.className = 'NotificationContainer';
    if(status == "good")
    {
      notificationDiv.style.color= "white";
    }
    else if(status == "bad")
    {
      notificationDiv.style.color= "red";
    }

    document.body.appendChild(notificationDiv);

    setTimeout(() => {
      notificationDiv.remove();
    }, duration);
  }
}
