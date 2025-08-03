import { MyTranslateService } from './../../core/services/myTranslate/my-translate.service';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(
    private flowbiteService: FlowbiteService,
    private authService: AuthService,
    private myTranslateService: MyTranslateService,
    private translateService: TranslateService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  IsLoggedIn: InputSignal<boolean> = input<boolean>(true);
  numOfCartItems: Signal<number> = computed(() =>
    this.cartService.cartNumber()
  );
  numOfWishlistItems: Signal<number> = computed(() =>
    this.wishlistService.wishlistNumber()
  );

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    if (localStorage.getItem('myToken')) {
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.cartService.cartNumber.set(res.numOfCartItems);
        },
      });
      this.wishlistService.getLoggedUserWishList().subscribe({
        next: (res) => {
          const count = res.count || 0;
          this.wishlistService.wishlistNumber.set(count);
        },
      });
    }
  }
  signOut() {
    this.authService.signOut();
  }
  changeLang(lang: string): void {
    this.myTranslateService.changeLanguage(lang);
  }
  currentLang(lang: string) {
    return this.translateService.getCurrentLang() == lang;
  }
}
