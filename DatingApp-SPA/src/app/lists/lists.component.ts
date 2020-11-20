import { Component, OnInit } from '@angular/core';
import { Users } from '_models/users';
import { UserService } from '_services/user.service';
import { AlertifyService } from '_services/alertify.service';
import { PaginatedResult, Pagination } from '_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: Users[];
  likesParam: string;
  pagination: Pagination;

  constructor(private userService: UserService, private alertify: AlertifyService,
              private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log('Vineet');
      console.log(data);
      this.users = data.user.result;
      this.pagination = data.user.pagination;
    });
    this.likesParam = 'Likers';
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers(this.pagination.currentPage, 6);
  }
  loadUsers(pageNum: number, numOfItems: number) {
    this.userService.getUsers(pageNum, numOfItems, null, this.likesParam).subscribe((value: PaginatedResult<Users[]>) => {
      this.users = value.result;
      this.pagination = value.pagination;
    }, (error: any) => {
      this.alertify.error('Some error');
    });
  }
}
