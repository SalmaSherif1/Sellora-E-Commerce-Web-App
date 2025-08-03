import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { FormAlertComponent } from '../../form-alert/form-alert.component';
import { ForgotService } from '../../../../core/services/forgotPass/forgot.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-pass',
  imports: [ReactiveFormsModule, FormAlertComponent, TranslatePipe],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.scss',
})
export class ForgotPassComponent {
  isLoading: boolean = false;
  erorrmsg: string = '';

  private readonly forgotService = inject(ForgotService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  step: number = 1;

  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required]),
  });
  resetPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z][a-z0-9]{6,}$/),
    ]),
  });

  forgetPass() {
    if (this.forgotPassForm.valid) {
      this.isLoading = true;
      let emailvalue = this.forgotPassForm.get('email')?.value;
      this.resetPassForm.get('email')?.patchValue(emailvalue);
      this.forgotService.forgotPass(this.forgotPassForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg == 'success') {
            this.step = 2;
            this.isLoading = false;
            this.erorrmsg = '';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.erorrmsg = err.error.message;
        },
      });
    } else {
      this.forgotPassForm.markAllAsTouched();
    }
  }

  verifyCode() {
    if (this.verifyCodeForm.valid) {
      this.isLoading = true;
      this.forgotService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          if (res.status == 'Success') {
            this.step = 3;
            this.isLoading = false;
            this.erorrmsg = '';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.erorrmsg = err.error.message;
        },
      });
    } else {
      this.verifyCodeForm.markAllAsTouched();
    }
  }
  resetPass() {
    if (this.resetPassForm.valid) {
      this.isLoading = true;
      this.forgotService.resetPass(this.resetPassForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.erorrmsg = '';

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
      this.resetPassForm.markAllAsTouched();
    }
  }
}
