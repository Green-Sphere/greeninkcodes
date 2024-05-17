import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { SupabaseService } from '../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTabsModule, MatButtonModule, MatRippleModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  tabIndex: number = 0;

  constructor(private supabase: SupabaseService,
              private snackbar: SnackbarService,
              private router: Router) { }

  ngOnInit() {
    this.supabase.getLoggedInUser().then((user) => {
      if(user != null){
        window.location.href = '/panel';
      }
    });
      const url = this.router.url;
      const lastSegment = url.split('/').pop();
    
      if (lastSegment === 'signup') {
        this.tabIndex = 1; 
      } else if (lastSegment === 'login') {
        this.tabIndex = 0;
      }
  }

  login(){
    this.supabase.login(this.email, this.password).then(() => {
      window.location.href = '/panel';
    }).catch((e) => {
      this.snackbar.openSnackBar(e.message, 'error');
      console.log(e.message);
    });
  }

  signup(){
    this.supabase.signup(this.name, this.email, this.password).then(() => {
      this.snackbar.openSnackBar("Check your email for a verification link!", 'info');
      this.tabIndex = 0;
    }).catch((e) => {
      this.snackbar.openSnackBar(e.message, 'error');
      console.log(e);
    });
  }
}
