import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Users } from '_models/users';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: Users;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
 constructor(private http: HttpClient) { }

 changeMemberPhoto(photoUrl: string) {
   this.photoUrl.next(photoUrl);
 }

 login(model: any) {
   return this.http.post(this.baseUrl + 'login', model).pipe(
     map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', response.user);
          console.log(response);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
          this.currentUser = response.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
     })
   );
 }

 register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
 }

 loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

}
