import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PricingComponent } from './pricing/pricing.component';
import { ForwardingComponent } from './forwarding/forwarding.component';
import { PanelComponent } from './panel/panel.component';
import { AuthorizationGuard } from './authorization.guard';
import { ProfileComponent } from './profile/profile.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TncComponent } from './tnc/tnc.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: LoginComponent},
    {path: 'pricing', component: PricingComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthorizationGuard]},
    {path: 'checkout', component: CheckoutComponent, canActivate: [AuthorizationGuard]},
    {path: 'panel', component: PanelComponent, canActivate: [AuthorizationGuard]},
    {path: 'g/:id', component: ForwardingComponent},
    {path: 'tnc', component: TncComponent},
];
