import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormAlertComponent } from '../../shared/components/form-alert/form-alert.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormAlertComponent, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading: boolean = false;
  erorrmsg: string = '';
  successmsg: string = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z][a-z0-9]{6,}$/),
    ]),
  });

  submitForm() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.erorrmsg = '';
          this.successmsg = res.message;
          console.log(res);

          // 1- save token to local storage
          localStorage.setItem('myToken', res.token);

          // 2- decode token
          this.authService.getUserData();

          // 3- navigate to home
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.erorrmsg = err.error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
