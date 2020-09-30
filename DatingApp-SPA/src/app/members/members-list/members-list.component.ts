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
  pagination: Pagination;
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers(1, 6);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers(this.pagination.currentPage, 6);
  }

  loadUsers(pageNum: number, numOfItems: number) {
    this.userService.getUsers(pageNum, numOfItems).subscribe((value: PaginatedResult<Users[]>) => {
      this.users = value.result;
      this.pagination = value.pagination;
    }, (error: any) => {
      this.alertify.error('Some error');
    });
  }

}
