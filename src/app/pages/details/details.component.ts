import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CartService } from '../../core/services/cart/cart.service';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-details',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  wishlistProductIds: Set<string> = new Set();

  prodID: any;
  prodData: IProduct | null = null;

  isLoading = true;
  hasError = false;
  errorMessage = '';

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.prodID = params.get('id');

        if (this.prodID) {
          this.productsService.getSpecificProduct(this.prodID).subscribe({
            next: (res) => {
              this.prodData = res.data;
              this.isLoading = false;
              this.flowbiteService.loadFlowbite((flowbite) => {
                initFlowbite(); // required to activate modal after dynamic render
              });
            },
            error: (err) => {
              this.hasError = true;
              this.isLoading = false;
              this.errorMessage =
                err.status === 404
                  ? 'Product not found. Please check the ID.'
                  : 'Failed to load product details. Please try again later.';
            },
          });
        } else {
          this.hasError = true;
          this.isLoading = false;
          this.errorMessage = 'No product ID provided.';
        }
      },
    });
  }
  addProductToCart(id: string): void {
    this.cartService.AddProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems),
          this.toastrService.success(res.message, 'Sellora', {
            progressBar: true,
            timeOut: 2000,
          });
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
