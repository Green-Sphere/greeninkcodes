import { Component } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [MatList, MatListItem, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatToolbar, MatButton, RouterModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

}
