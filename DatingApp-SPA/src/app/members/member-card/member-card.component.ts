import { Component, OnInit, Input } from '@angular/core';
import { AlertifyService } from '_services/alertify.service';
import { AuthService } from '_services/auth.service';
import { UserService } from '_services/user.service';
import { Users } from '../../../../_models/users';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: Users;
  constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
  }
  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(data => {
      this.alertify.success('You have liked ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error.error);
    });
  }
}
