import { Component, OnInit } from '@angular/core';
import { Users } from '_models/users';
import { UserService } from '_services/user.service';
import { AlertifyService } from '_services/alertify.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  users: Users[];
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((value: Users[]) => {
      this.users = value;
    }, (error: any) => {
      this.alertify.error('Some error');
    });
  }

}
