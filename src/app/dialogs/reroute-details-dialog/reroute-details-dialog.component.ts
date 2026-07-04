import { Component, ElementRef, Inject, ViewChild, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { Options, NgxQrcodeStylingService } from 'ngx-qrcode-styling';
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
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-reroute-details-dialog',
  standalone: true,
  imports: [
    MatDialogClose,
    MatButton,
    MatInput,
    FormsModule,
    MatFormField,
    MatLabel,
    MatIcon,
    MatTooltip,
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    LoadingComponent,
  ],
  templateUrl: './reroute-details-dialog.component.html',
  styleUrl: './reroute-details-dialog.component.css',
})
export class RerouteDetailsDialogComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;

  loading: boolean = true;
  saving: boolean = false;
  reroute: any = {};
  config: Options = {};
  shortURL: string = '';
  qrURL: string = '';
  confirmDelete: boolean = false;

  // Analytics
  scans: any[] = [];
  qrScans: number = 0;
  linkScans: number = 0;
  chartBars: { date: string; count: number; height: number }[] = [];
  peakDay: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; subType: string; userId: number },
    private supabase: SupabaseService,
    private qrcode: NgxQrcodeStylingService,
    private dialogRef: MatDialogRef<RerouteDetailsDialogComponent>,
    private clipboard: Clipboard,
  ) {}

  async ngOnInit() {
    this.loading = true;
    const rerouteId = this.data.id;

    const [reroute, scans] = await Promise.all([
      this.supabase.getReroute(rerouteId),
      this.supabase.getScansForReroute(rerouteId)
    ]);

    this.reroute = (reroute as any[])[0];
    this.scans = scans as any[];
    this.shortURL = 'https://grn.ink/g/' + this.reroute.id;
    this.qrURL = this.shortURL + '?ref=qr';

    this.processAnalytics();

    this.config = {
      image: this.data.subType == 'free'
        ? '../../assets/greenink.png'
        : (this.reroute.icon ?? ''),
      data: this.qrURL,
      margin: 5,
      dotsOptions: {
        color: this.reroute.color ?? '#50D139',
        type: 'rounded',
      },
    };

    await this.qrcode.create(this.config, this.canvas.nativeElement);
    this.loading = false;
  }

  processAnalytics() {
    // QR vs link counts
    this.qrScans = this.scans.filter(s => s.method === 'qr').length;
    this.linkScans = this.scans.filter(s => s.method === 'link').length;

    // Build last 30 days buckets
    const days = 30;
    const buckets: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      buckets[key] = 0;
    }

    this.scans.forEach(scan => {
      const key = new Date(scan.scanned_at).toISOString().split('T')[0];
      if (key in buckets) buckets[key]++;
    });

    const counts = Object.values(buckets);
    const max = Math.max(...counts, 1);

    this.chartBars = Object.entries(buckets).map(([date, count]) => ({
      date,
      count,
      height: Math.round((count / max) * 100)
    }));

    // Peak day
    const peak = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
    if (peak && peak[1] > 0) {
      this.peakDay = new Date(peak[0]).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
      });
    }
  }

  updateReroute() {
    this.saving = true;
    this.supabase
      .updateReroute(this.reroute.id, this.reroute.name, this.reroute.route)
      .then(() => {
        this.dialogRef.close(true);
        this.saving = false;
      })
      .catch((e) => {
        console.log(e);
        this.saving = false;
      });
  }

  deleteReroute() {
    this.saving = true;
    this.supabase
      .deleteReroute(this.reroute.id)
      .then(() => {
        this.dialogRef.close(true);
        this.saving = false;
      })
      .catch((e) => {
        console.log(e);
        this.saving = false;
      });
  }

  saveImage() {
    this.qrcode.download(this.canvas.nativeElement, this.reroute.name + '-greenink.png');
  }

  copyURL() {
    this.clipboard.copy(this.shortURL);
  }
}