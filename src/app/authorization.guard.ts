import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SupabaseService } from "./services/supabase.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class AuthorizationGuard implements CanActivate {
  
    constructor(private router: Router, private supabase: SupabaseService) {}
  
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Promise<boolean> {
        const user = await this.supabase.getLoggedInUser();
        if (!user) {
          this.router.navigate(['login']);
        }
        return true;
      }
  
  }