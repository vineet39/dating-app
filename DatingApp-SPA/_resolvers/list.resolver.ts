import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Users } from '_models/users';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';
import { AuthService } from '_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ListsResolver implements Resolve<Users[]>  {
    pageNumber = 1;
    pageSize = 5;
    likesParam = 'Likers';
    userParams: any = {minAge: 18, maxAge: 99};
    constructor(private alertifyjs: AlertifyService, private userService: UserService,
                private authservice: AuthService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Users[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, this.userParams, this.likesParam).pipe(
            catchError(error => {
                console.log(error);
                this.alertifyjs.error(error);
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
