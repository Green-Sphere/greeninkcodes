import { Component, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxColorsModule } from 'ngx-colors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reroute-create-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatDialogClose, NgxColorsModule, CommonModule],
  templateUrl: './reroute-create-dialog.component.html',
  styleUrl: './reroute-create-dialog.component.css'
})
export class RerouteCreateDialogComponent {
  name: string = '';
  route: string = '';
  urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  color: string = '#50D139';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {subType: string}, 
    public dialogRef: MatDialogRef<RerouteCreateDialogComponent>, 
    private supabase: SupabaseService, private snackbar: SnackbarService
  ) { }
  
  createNewReroute(){
    if(this.name == ''){
      this.snackbar.openSnackBar("Enter a name", 'error');
      return;
    }
    if(this.route == '' || this.urlRegex.test(this.route) == false){
      this.snackbar.openSnackBar("Enter a valid URL", 'error');
      return;
    }

    this.supabase.createReroute(this.name, this.route, this.color).then((id)=>{
      this.dialogRef.close(id);
    }).catch((e) => {
      this.snackbar.openSnackBar(e.message, 'error');
      console.log(e);
    });
  }
}
