import { HttpClient, HttpResponse } from '@angular/common/http';
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

  getCustomerSubscription(email: string) {
    return this.http.get<StripeSubscription>(`${this.apiURL}/customer-subscription?email=${email}`);
  }

  redirectToCheckout(plan: string, email: string) {
    this.http
      .get<StripeSession>(`${this.apiURL}/redirect-to-checkout?plan=${plan}&email=${email}`).pipe()
      .subscribe(session => {
        window.location.href = session.url;
      });
  }

  redirectToPortal(email: string) {
    this.http
      .get<StripeSession>(`${this.apiURL}/redirect-to-portal?email=${email}`)
      .subscribe(session => {
        if(session.url) window.location.href = session.url;
      });
  }
}

interface StripeSession {
  url: string;
}

export interface StripeSubscription {
  data: StripeData[];
}

interface StripeData {
  plan: Plan;
}

interface Plan {
  id: string;
  active: boolean;
}