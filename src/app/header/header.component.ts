import { Component, Input, OnInit } from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { SupabaseService } from '../services/supabase.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatMenu, MatMenuModule, MatButton, MatIconModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() tagline: string = '';

  isLoggedIn: boolean = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabase.getLoggedInUser();
    this.isLoggedIn = user!= null;
  }

  logout() {
    this.supabase.logout().then(() => {
      window.location.href = '/';
    });
  }

}
