import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { SortPipe } from '../../shared/pipes/sort/sort.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
@Component({
  selector: 'app-products',
  imports: [
    RouterLink,
    FormsModule,
    SearchPipe,
    SortPipe,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  wishlistProductIds: Set<string> = new Set();

  myProducts: IProduct[] = [];
  myCategories: ICategory[] = [];
  searchInput: string = '';
  sortDropdown: string = '';
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  currentPage = 1;
  productsPerPage = 12;

  ngOnInit(): void {
    this.callProduct();
    this.callCategories();
    if (localStorage.getItem('myToken')) {
      this.wishlistService.getLoggedUserWishList().subscribe({
        next: (res) => {
          const products = res.data || [];
          this.wishlistProductIds = new Set(products.map((p: any) => p._id));
        },
      });
    }
  }

  callProduct() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.myProducts = res.data;
        console.log(this.myProducts);

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

  callCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.myCategories = res.data;
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
  get paginatedProducts(): IProduct[] {
    const filtered = this.myProducts.filter((product) =>
      product.title.toLowerCase().includes(this.searchInput.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.productsPerPage;
    return filtered.slice(start, start + this.productsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(
      this.myProducts.filter((product) =>
        product.title.toLowerCase().includes(this.searchInput.toLowerCase())
      ).length / this.productsPerPage
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.scrolltotop();
  }
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrolltotop();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrolltotop();
    }
  }
  scrolltotop() {
    const element = document.getElementById('SearchInput');
    if (element) {
      const offset = -150;
      const y = element.getBoundingClientRect().top + window.scrollY + offset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
