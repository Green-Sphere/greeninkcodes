import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-forwarding',
  standalone: true,
  imports: [],
  templateUrl: './forwarding.component.html',
  styleUrl: './forwarding.component.css'
})
export class ForwardingComponent implements OnInit {
  constructor(private route: ActivatedRoute, private supabase: SupabaseService) { }
  ngOnInit() { 
    this.route.params.subscribe( params => {
      //Get URL from supabase
      this.supabase.getReferURL(params['id']).then(url => {
        window.location.href = url;
      });
      //forward
      //window.location.href = 'https://www.google.com';
    });
  }
}
