import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [TranslatePipe],
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastrService = inject(ToastrService);
  wishlistProductIds: Set<string> = new Set();

  wishlistItems: IProduct[] = [];
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    if (localStorage.getItem('myToken')) {
      this.wishlistService.getLoggedUserWishList().subscribe({
        next: (res) => {
          const products = res.data || [];
          this.wishlistProductIds = new Set(products.map((p: any) => p._id));
        },
      });
    }
    this.wishlistService.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishlistItems = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }
  addProductToCart(id: string): void {
    this.cartService.AddProductToCart(id).subscribe({
      next: (res) => {
        this.removeFromWishlist(id);
        this.cartService.cartNumber.set(res.numOfCartItems),
          this.toastrService.success(res.message, 'Sellora', {
            progressBar: true,
            timeOut: 2000,
          });
      },
    });
  }
  removeFromWishlist(id: string): void {
    this.wishlistService.removeWishListItem(id).subscribe({
      next: (res) => {
        this.wishlistService.wishlistNumber.set(res.data.length),
          (this.wishlistItems = this.wishlistItems.filter(
            (item) => item._id !== id
          ));
      },
    });
  }
  addProductToWishlist(id: string): void {
    this.wishlistService.AddProductToWishList(id).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistService.wishlistNumber.set(res.data.length),
          this.wishlistProductIds.add(id);
        this.toastrService.success(res.message, 'Sellora', {
          progressBar: true,
          timeOut: 2000,
        });
      },
    });
  }
  toggleWishlist(productId: string): void {
    if (this.wishlistProductIds.has(productId)) {
      // Remove from wishlist
      this.wishlistService.removeWishListItem(productId).subscribe({
        next: (res) => {
          this.wishlistItems = this.wishlistItems.filter(
            (item) => item._id !== productId
          );
          this.wishlistProductIds.delete(productId);
          this.wishlistService.wishlistNumber.set(res.data.length),
            this.toastrService.success(res.message, 'Sellora', {
              progressBar: true,
              timeOut: 2000,
            });
        },
      });
    } else {
      // Add to wishlist
      this.addProductToWishlist(productId);
    }
  }
}
