import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { Options, NgxQrcodeStylingModule, NgxQrcodeStylingService } from 'ngx-qrcode-styling';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-reroute-details-dialog',
  standalone: true,
  imports: [NgxQrcodeStylingModule, MatDialogClose, MatButton, MatInput, FormsModule, MatFormField, MatLabel, MatIcon, MatTooltip, CommonModule],
  templateUrl: './reroute-details-dialog.component.html',
  styleUrl: './reroute-details-dialog.component.css'
})
export class RerouteDetailsDialogComponent {
  @ViewChild("canvas", { static: false })
  canvas!: ElementRef;
  loading: boolean = true;
  saving: boolean = false;
  edit: boolean = false;
  reroute: any = {};
  config: Options = {};
  shortURL: string = '';
  confirmDelete: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string, subType: string}, 
    private supabase: SupabaseService, 
    private qrcode: NgxQrcodeStylingService, 
    private dialogRef: MatDialogRef<RerouteDetailsDialogComponent>,
    private clipboard: Clipboard
  ) { }
  
  ngOnInit() {
    const rerouteId = this.data.id;
    
    this.supabase.getReroute(rerouteId).then((reroute: any) => {
      this.reroute = reroute[0];
      this.shortURL = "https://grn.ink/g/" + this.reroute.id;

      this.config = {
        width: 500,
        height: 500,
        image: this.data.subType == 'basic' ? '../../assets/greenink.png' : this.reroute.image ?? '' ,
        data: this.shortURL,
        margin: 5,
        dotsOptions: {
          color: this.reroute.color ?? '#50D139',
          type: 'rounded'
        }
      }
      this.qrcode.create(this.config, this.canvas.nativeElement)
      this.loading = false;
    });
  }

  updateReroute() {
    this.saving = true;
    this.supabase.updateReroute(this.reroute.id, this.reroute.name, this.reroute.route).then(() => {
      this.dialogRef.close(true);
      this.saving = false;
    }).catch((e) =>{
      console.log(e);
      this.saving = false;
    });
  }

  deleteReroute() {
    this.saving = true;
    this.supabase.deleteReroute(this.reroute.id).then(() => {
      this.dialogRef.close(true);
      this.saving = false;
    }).catch((e) =>{
      console.log(e);
      this.saving = false;
    });
  }

  saveImage() {
    this.qrcode.download(this.canvas.nativeElement, this.reroute.name + "-greenink.png");
  }

  copyURL() {
    this.clipboard.copy(this.shortURL);
  }
}
