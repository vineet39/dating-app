import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Users } from '_models/users';
import { Observable } from 'rxjs';
import { PaginatedResult } from '_models/pagination';
import { map } from 'rxjs/operators';

const options = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?, likeParam?): Observable<PaginatedResult<Users[]>> {
    const paginatedResult: PaginatedResult<Users[]> = new PaginatedResult<Users[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    } else {
      params = params.append('minAge', '0');
      params = params.append('maxAge', '0');
    }

    if (likeParam === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likeParam === 'Likees') {
      params = params.append('likees', 'true');
    }
    console.log(params);
    return this.http.get<Users[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id): Observable<Users> {
    return this.http.get<Users>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: Users) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  sendLike(id: number, recepientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recepientId, {});
  }

  setPhotoAsMain(id: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/setMain', {});
  }

  deletePhoto(id: number, userid: number) {
    return this.http.delete(this.baseUrl + 'users/' + userid + '/photos/' + id, {});
  }

}
