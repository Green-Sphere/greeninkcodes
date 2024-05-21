import { Component } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { SupabaseService } from '../services/supabase.service';
import { User } from '@supabase/supabase-js';
import { StripeService } from '../services/stripe.service';
import { LoadingComponent } from '../loading/loading.component';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatList, MatListItem, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatToolbar, MatButton, CommonModule, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  customerPortal = 'https://billing.stripe.com/p/login/eVaaELeyNbuNcaQeUU';
  basicCheckout = 'https://buy.stripe.com/9AQbKJ3fl3k35VuaEE';
  unlimitedCheckout = 'https://buy.stripe.com/6oE9CB9DJaMv0BabIJ';
  subType: string = 'free';
  user: User | null | undefined;
  loading = true;

  constructor(private supabase: SupabaseService, private stripe: StripeService, private dynamicScriptLoader: DynamicScriptLoaderService) { }

  async ngOnInit() {
    this.user = await this.supabase.getLoggedInUser();
    if (this.user?.email) {
      this.stripe.getCustomerSubscription(this.user?.email)
      .subscribe(subscription => {
        const planId = subscription?.data ? subscription.data[0].plan.id : '';
        this.subType = planId === 'price_1OrssyCs0P2ff3AuKCSy4Ud0'? 'basic' : planId === 'price_1OrsuECs0P2ff3AuSUpOEDG9'? 'unlimited' : 'free';
      });
    }
    this.loading = false;
  }

  sendToCheckout(plan: string){
    this.stripe.redirectToCheckout(plan, this.user?.user_metadata['customer_id']);
  }

  sendToCustomerPortal(){
    this.stripe.redirectToPortal(this.user?.user_metadata['customer_id']);
  }

  createChatDiv(){
    this.dynamicScriptLoader.load('smallchat').then(data => {
      const loadEvent = new Event('load');
      window.dispatchEvent(loadEvent);
    }).catch(error => console.log(error));
  }
}
