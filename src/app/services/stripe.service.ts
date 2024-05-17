import { Injectable } from '@angular/core';
import Stripe from 'stripe';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripe = new Stripe('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');
  constructor() {} 
  
  ngOnInit() {
  }

  async createCustomer(name: string, email: string) {
    const customer = await this.stripe.customers.create({
      name: name,
      email: email,
    }).catch((e) => {
      console.log(e);
    });

    return customer;
  }

  async getCustomerSubscription(customerId: string) {
    const subscription = await this.stripe.subscriptions.list({customer: customerId}).catch((e) => {
      console.log(e);
    });

    return subscription;
  }

  async createCheckoutSession(customerId: string, planPrice: string) {
    const params: Stripe.Checkout.SessionCreateParams={
      customer: customerId,
      success_url: 'https://greeninkcodes.com/profile',
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [{
        price: planPrice,
        quantity: 1,
      }]
    };
    const session = await this.stripe.checkout.sessions.create(params);
    return session;
  }

  async redirectToCheckout(plan: string, userId: string) {
    let planPrice = '';
    if (plan === 'basic') {
      planPrice = 'price_1OrssyCs0P2ff3AuKCSy4Ud0';
    } else if (plan === 'unlimited') {
      planPrice = 'price_1OrsuECs0P2ff3AuSUpOEDG9';
    }

    const session = await this.createCheckoutSession(userId, planPrice);

    if(session.url) window.location.href = session.url;
  }

  async redirectToPortal(userId: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: userId,
      return_url: 'https://greeninkcodes.com/profile',
    });
    if(session.url) window.location.href = session.url;
  }

}

//enwDADa4yZ3rbcK