import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule, MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef, MatRow, MatRowDef, MatCell, MatCellDef } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { RerouteDetailsDialogComponent } from '../dialogs/reroute-details-dialog/reroute-details-dialog.component';
import { RerouteCreateDialogComponent } from '../dialogs/reroute-create-dialog/reroute-create-dialog.component';
import { DatePipe } from '@angular/common';
import { User } from '@supabase/supabase-js';
import { MatTooltip } from '@angular/material/tooltip';
import { StripeService } from '../services/stripe.service';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [MatTable, MatRow, MatRowDef, MatTableModule, MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef, MatCell, MatCellDef, MatIcon, MatButtonModule, DatePipe, MatTooltip, LoadingComponent, CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})

export class PanelComponent implements OnInit {
  reroutes = new MatTableDataSource();
  displayedColumns = ['name', 'route', 'count', 'updated'];
  subType: string = '';
  user: User | null | undefined;
  preventCreate: boolean = true;
  preventCreateReason: string = 'Loading...';
  loading = true;

  constructor(private supabase: SupabaseService, private dialog: MatDialog, private stripe: StripeService) {}

  async ngOnInit() {
    this.user = await this.supabase.getLoggedInUser();
    if (this.user) {
      let subscription = await this.stripe.getCustomerSubscription(this.user?.user_metadata['customer_id']);
      console.log(subscription);
      const planId = subscription?.data.length ? subscription.data[0].items.data[0].plan.id : '';
      this.subType = planId === 'price_1OrssyCs0P2ff3AuKCSy4Ud0'? 'basic' : planId === 'price_1OrsuECs0P2ff3AuSUpOEDG9'? 'unlimited' : 'free';
      this.getURLs();
      if(this.subType == 'free') { 
        this.preventCreate = this.reroutes.data.length >= 1;
        this.preventCreateReason = this.preventCreate ? 'You have reached the maximum number of reroutes for this subscription type.' : '';
      }
      if(this.subType == 'basic') { 
        this.preventCreate = this.reroutes.data.length >= 5;
        this.preventCreateReason = this.preventCreate ? 'You have reached the maximum number of reroutes for this subscription type.' : '';
      }
      if(this.subType == 'unlimited') { 
        this.preventCreate = false;
        this.preventCreateReason ='';
      }
    }
    this.loading = false;
  }

  async getURLs(){
    this.loading = true;
    const userURLs = await this.supabase.getUserURLs();
    console.log(userURLs);
    this.reroutes.data = userURLs as unknown[];
    this.loading = false;
  }

  rowClicked(id: number) {
    const dialogRef = this.dialog.open(RerouteDetailsDialogComponent, {
      height: '40%',
      width: '60%',
      data: {
        id: id
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getURLs();
      } 
    });
  }

  addReroute() {
    const dialogRef = this.dialog.open(RerouteCreateDialogComponent, {
      height: '30%',
      width: '25%',
      data: {
        subType: this.subType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getURLs();
        this.rowClicked(result);
      } 
    });
  }
}
