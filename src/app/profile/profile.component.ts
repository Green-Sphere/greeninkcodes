import { ChangeDetectorRef, Component } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import { User } from '@supabase/supabase-js';
import { StripeService } from '../services/stripe.service';
import { LoadingComponent } from '../loading/loading.component';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatToolbar,
    MatButton,
    CommonModule,
    LoadingComponent,
    FormsModule,
    MatIconModule,
    MatTooltip,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  customerPortal = 'https://billing.stripe.com/p/login/eVaaELeyNbuNcaQeUU';
  basicCheckout = 'https://buy.stripe.com/9AQbKJ3fl3k35VuaEE';
  unlimitedCheckout = 'https://buy.stripe.com/6oE9CB9DJaMv0BabIJ';
  subType: string = 'free';
  user: User | null | undefined;
  loading = true;
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  savingPassword = false;
  passwordError = '';
  passwordSuccess = '';
  codesUsed = 0;
  totalScans = 0;

  constructor(
    private supabase: SupabaseService,
    private stripe: StripeService,
    private dynamicScriptLoader: DynamicScriptLoaderService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.user = await this.supabase.getLoggedInUser();
    await this.setUserSubscription();
    if (this.subType == 'basic' || this.subType == 'unlimited') {
      this.createChatDiv();
    }
    const urls = await this.supabase.getUserURLs() as any[];
    this.codesUsed = urls.length;
    this.totalScans = urls.reduce((sum, r) => sum + (r.triggered || 0), 0);
    this.loading = false;
    this.cdr.detectChanges();
  }

  sendToCheckout(plan: string) {
    this.stripe.redirectToCheckout(plan, this.user?.email || '');
  }

  sendToCustomerPortal() {
    this.stripe.redirectToPortal(this.user?.email || '');
  }

  async setUserSubscription(): Promise<void> {
    return new Promise((resolve) => {
      if (this.user?.email) {
        this.stripe
          .getCustomerSubscription(this.user?.email)
          .subscribe({
            next: (subscription) => {
              const planId = subscription?.level ?? '';
              this.subType =
                planId === 'starter' ? 'basic' :
                planId === 'pro'     ? 'unlimited' :
                'free';
              resolve();
            },
            error: (err) => {
              console.error('subscription error:', err);
              this.subType = 'free';
              resolve(); // always resolve so ngOnInit continues
            }
          });
      } else {
        resolve();
      }
    });
  }

  async changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.newPassword.length < 8) {
      this.passwordError = 'Password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }

    this.savingPassword = true;
    const { error } = await this.supabase.updatePassword(this.newPassword);
    this.savingPassword = false;

    if (error) {
      this.passwordError = error.message;
    } else {
      this.passwordSuccess = 'Password updated successfully.';
      this.newPassword = '';
      this.confirmPassword = '';
    }
    this.cdr.detectChanges();
  }

  copyUserId() {
    navigator.clipboard.writeText(this.user?.id || '');
  }

  confirmDeleteAccount() {
    const confirmed = window.confirm(
      'Are you sure? This will permanently delete your account and all QR codes. This cannot be undone.'
    );
    if (confirmed) {
      this.deleteAccount();
    }
  }

  async deleteAccount() {
    // Requires a Supabase admin call or edge function
    // Placeholder — wire up to your backend
    console.log('delete account');
  }

  maxReroutes(): string {
    switch (this.subType) {
      case 'starter': return '5';
      case 'unlimited': return '∞';
      default: return '1';
    }
  }

  createChatDiv() {
    this.dynamicScriptLoader
      .load('smallchat')
      .then((data) => {
        const loadEvent = new Event('load');
        window.dispatchEvent(loadEvent);
      })
      .catch((error) => console.log(error));
  }
}
