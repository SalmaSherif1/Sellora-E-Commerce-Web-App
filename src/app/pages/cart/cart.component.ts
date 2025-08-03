import { Icart } from './../../shared/interfaces/icart';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CommonModule, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  cartDetails: Icart = {} as Icart;

  ngOnInit(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
      },
    });
  }
  removeCartItem(id: string): void {
    this.cartService.removeCartItem(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.cartService.cartNumber.set(res.numOfCartItems),
          this.toastrService.success(
            'Product is removed from your cart successfully',
            'Sellora',
            { progressBar: true, timeOut: 2000 }
          );
      },
    });
  }
  UpdateCartProductQuantity(id: string, quantity: any): void {
    this.cartService.UpdateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.toastrService.success(
          'Product Quantity updated successfully',
          'Sellora',
          { progressBar: true, timeOut: 2000 }
        );
      },
    });
  }
  ClearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails = {} as Icart;
        this.cartService.cartNumber.set(0),
          this.toastrService.success(
            'Your cart is cleared successfully',
            'Sellora',
            { progressBar: true, timeOut: 2000 }
          );
      },
    });
  }
}
