import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Users } from '_models/users';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';
import { AuthService } from '_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MemberDetailResolver implements Resolve<Users>  {
    constructor(private alertifyjs: AlertifyService, private userService: UserService,
                private authservice: AuthService, private router: Router) {}
    private readonly newProperty = 'id';

    resolve(route: ActivatedRouteSnapshot): Observable<Users> {
        return this.userService.getUser(route.params[this.newProperty]).pipe(
            catchError(error => {
                this.alertifyjs.error('Problem');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}
