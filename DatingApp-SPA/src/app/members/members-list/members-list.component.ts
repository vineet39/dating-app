import { Component, OnInit } from '@angular/core';
import { Users } from '_models/users';
import { UserService } from '_services/user.service';
import { AlertifyService } from '_services/alertify.service';
import { PaginatedResult, Pagination } from '_models/pagination';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  users: Users[];
  user: Users = JSON.parse(JSON.stringify(localStorage.getItem('user')));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};
  pagination: Pagination;
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.userParams.gender = this.userParams.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers(1, 6);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers(this.pagination.currentPage, 6);
  }
  resetFilters() {
    this.userParams.gender = this.userParams.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers(this.pagination.currentPage, 6);
  }
  loadUsers(pageNum: number, numOfItems: number) {
    if (this.userParams.minAge >= this.userParams.maxAge) {
      this.alertify.error('Min age cannot be greater than max age');
      return;
    }
    this.userService.getUsers(pageNum, numOfItems, this.userParams).subscribe((value: PaginatedResult<Users[]>) => {
      this.users = value.result;
      this.pagination = value.pagination;
    }, (error: any) => {
      this.alertify.error('Some error');
    });
  }

}
