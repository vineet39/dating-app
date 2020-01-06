import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Users } from '../_models/users';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';
import { AuthService } from '_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberEditResolver implements Resolve<Users>  {
constructor(private alertifyjs: AlertifyService, private userService: UserService,
            private authservice: AuthService, private router: Router) {}
resolve(route: ActivatedRouteSnapshot): Observable<Users> {
    return this.userService.getUser(this.authservice.decodedToken.nameid).pipe(
        catchError(error => {
            this.alertifyjs.error('Some error in member-edt-resolver.ts');
            this.router.navigate(['/members']);
            return of(null);
        })
    );
}
}

