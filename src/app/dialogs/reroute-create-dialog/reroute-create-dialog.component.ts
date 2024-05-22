import { Component, ElementRef, Inject, ViewChild, Renderer2, AfterViewInit, HostBinding, EventEmitter, HostListener } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxColorsModule } from 'ngx-colors';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reroute-create-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogClose,
    NgxColorsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './reroute-create-dialog.component.html',
  styleUrls: ['./reroute-create-dialog.component.css']
})
export class RerouteCreateDialogComponent {
  name: string = '';
  route: string = '';
  urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  color: string = '#50D139';
  imageFile: File | undefined;
  dragAreaClass: string | undefined;

  @ViewChild('fileUpload', { static: false }) fileDropEl: ElementRef | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { subType: string, userId: number },
    public dialogRef: MatDialogRef<RerouteCreateDialogComponent>,
    private supabase: SupabaseService,
    private snackbar: SnackbarService
  ) {}

  createNewReroute() {
    if (this.name == '') {
      this.snackbar.openSnackBar("Enter a name", 'error');
      return;
    }
    if (this.route == '' || !this.urlRegex.test(this.route)) {
      this.snackbar.openSnackBar("Enter a valid URL", 'error');
      return;
    }

    this.supabase.createReroute(this.name, this.route, this.color, this.imageFile).then((id) => {
      this.dialogRef.close(id);
    }).catch((e) => {
      this.snackbar.openSnackBar(e.message, 'error');
      console.log(e);
    });
  }

  /* File Upload Handlers */

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    console.log("dragover");
    event && event.preventDefault();
    event && event.stopPropagation();
    this.dragAreaClass = "fileover";
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragAreaClass = "";
  }

  @HostListener("drop", ["$event"]) onDrop(event: any) {
    event && event.preventDefault();
    event && event.stopPropagation();
    this.dragAreaClass = "";
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.imageFile = files[0];
      console.log(this.imageFile);
    }
  }

  fileBrowseHandler(event: any) {
    console.log(event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      console.log(this.imageFile);
    }
  }

  deleteFile() {
    this.imageFile = undefined;
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
