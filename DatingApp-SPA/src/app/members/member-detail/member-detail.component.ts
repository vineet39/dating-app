import { Component, OnInit, Input } from '@angular/core';
import { Users } from '_models/users';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @Input() users: Users;
  constructor() { }

  ngOnInit() {
  }

}
