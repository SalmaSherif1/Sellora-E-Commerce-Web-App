import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment/payment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  paymentForm!: FormGroup;
  cartID: string = '';

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.cartID = res.get('id')!;
      },
    });
  }

  submitForm(): void {
    const formData = this.paymentForm.value;
    console.log('hekkkkoooo');
    console.log(this.cartID);
    console.log('hekkkkoooo');

    if (formData.paymentMethod === 'card') {
      this.paymentService.checkoutsession(this.cartID, formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            open(res.session.url, '_self');
            setTimeout(() => {
              this.cartService.cartNumber.set(0);
            }, 2000);
          }
        },
      });
    } else if (formData.paymentMethod === 'cash') {
      this.paymentService.cashOrder(this.cartID, formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.cartService.cartNumber.set(0);

            this.toastrService.success(
              '✅ Order received! You will pay on delivery.',
              'Sellora',
              { progressBar: true, timeOut: 3000 }
            );
            setTimeout(() => {
              this.router.navigate(['/allorders']);
            }, 2000);
          }
        },
      });
    }
  }
}
