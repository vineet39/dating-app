import { Component, OnInit, ViewChild } from '@angular/core';
import { Users } from '_models/users';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: Users;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.user = data['user'];
    });
  }

  updateUser() {
    console.log(this.user);
    this.alertify.success('Successfully updated data');
    this.editForm.reset(this.user);
  }

  foo() {
     alert('foo');
 }

}
