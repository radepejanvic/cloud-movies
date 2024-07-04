import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/AuthService';
import { signOut } from 'aws-amplify/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {


    const userRole :string = this.authService.userRole;
    if (userRole == '') {
      this.authService.signOut();
      return false;
    }
    if (!route.data['role'].includes(userRole)) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}