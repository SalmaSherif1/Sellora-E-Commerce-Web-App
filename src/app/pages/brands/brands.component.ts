import { BrandsService } from './../../core/services/brands/brands.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { SortPipe } from '../../shared/pipes/sort/sort.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Ibrand } from '../../shared/interfaces/ibrand';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
@Component({
  selector: 'app-brands',
  imports: [
    RouterLink,
    FormsModule,
    SearchPipe,
    SortPipe,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  wishlistProductIds: Set<string> = new Set();

  brandId: any;
  brandData: Ibrand | null = null;
  myProducts: IProduct[] = [];
  searchInput: string = '';
  sortDropdown: string = '';
  mybrand: Ibrand[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  isLoadingg = true;
  hasErrorr = false;
  errorMessagee = '';
  brandName: string = '';

  ngOnInit(): void {
    this.CallBrands();
    if (localStorage.getItem('myToken')) {
      this.wishlistService.getLoggedUserWishList().subscribe({
        next: (res) => {
          const products = res.data || [];
          this.wishlistProductIds = new Set(products.map((p: any) => p._id));
        },
      });
    }
  }
  CallBrands() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.brandsService.getBrands().subscribe({
      next: (res) => {
        this.mybrand = res.data;
        console.log(this.mybrand);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          err.status === 0
            ? 'Unable to connect. Please check your network.'
            : 'Failed to load products. Please try again later.';
      },
    });
  }
  getBrandDetails(id: string): void {
    this.hasError = false;
    this.brandId = id;

    this.brandsService.getSpecificBrand(id).subscribe({
      next: (res) => {
        this.brandData = res.data;
        this.brandName = this.brandData?.name!;
        this.mybrand = [];
        this.openproducts(this.brandData!._id); // loading starts there
      },
      error: (err) => {
        this.hasErrorr = true;
        this.isLoadingg = false;
        this.errorMessagee =
          err.status === 404
            ? 'Category not found. Please check the ID.'
            : 'Failed to load Category details. Please try again later.';
      },
    });
  }

  openproducts(brandId: string) {
    this.isLoadingg = true;
    this.productsService.getProducts(undefined, brandId).subscribe({
      next: (res) => {
        this.myProducts = res.data;
        this.isLoadingg = false;
      },
      error: () => {
        this.isLoadingg = false;
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
  resetView(): void {
    this.myProducts = [];
    this.brandData = null;
    this.CallBrands();
  }
}
