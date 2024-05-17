import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  ngOnInit(){
    this.loadScript();
    
  }

  public loadScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.defer = true;
    body.appendChild(script);

    let script2 = document.createElement('script');
    script2.innerHTML = `
      var stripe = Stripe('pk_live_51L8TZzCs0P2ff3AuzBQ8bpUcENy9LXkWPjJFFnickkjqI2FOQFgnPnKxoBHxR9pPfhniLb6aeyElnAWTVpiKMPne00Pj41DXT4');
      checkout.mount('#checkout');
    `;
  }

}
