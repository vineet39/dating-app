import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '_services/auth.service';
import { AlertifyService } from '_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = { };
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  constructor(private authService: AuthService, private alerify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alerify.success('Successfully created an account');
    }, error => {
      this.alerify.error(error.error);
    });
  }

  cancel() {
    console.log('cancel');
    this.cancelRegister.emit(false);
  }

}
