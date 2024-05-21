import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  apiURL : string = "https://grn.ink";
  constructor(private http: HttpClient) {}

  createCustomer(name: string, email: string) {
    return this.http.post(`${this.apiURL}/create-customer`, { name, email });
  }

  getCustomerSubscription(customerId: string) {
    return this.http.get(`${this.apiURL}/customer-subscription?customerId=${customerId}`);
  }

  redirectToCheckout(plan: string, userId: string) {
    this.http
      .get<StripeSession>(`${this.apiURL}/redirect-to-checkout?plan=${plan}&userId=${userId}`).pipe()
      .subscribe(session => {
        window.location.href = session.url;
      });
  }

  async redirectToPortal(userId: string) {
    await this.http
      .get<StripeSession>(`${this.apiURL}/redirect-to-portal?userId=${userId}`)
      .subscribe(session => {
        if(session.url) window.location.href = session.url;
      });
  }
}

interface StripeSession {
  url: string;
}