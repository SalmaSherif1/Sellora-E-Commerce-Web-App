import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platId: object
  ) {
    if (isPlatformBrowser(this.platId)) {
      translateService.setDefaultLang('en');
      let savedLang = localStorage.getItem('myLang');
      if (savedLang) {
        translateService.use(savedLang);
      }
    }

    this.changeDirection();
  }

  changeDirection(): void {
    if (localStorage.getItem('myLang') === 'en') {
      document.documentElement.dir = 'ltr';
    } else if (localStorage.getItem('myLang') === 'ar') {
      document.documentElement.dir = 'rtl';
    }
  }

  changeLanguage(lang: string) {
    localStorage.setItem('myLang', lang);
    this.translateService.use(lang);
    this.changeDirection();
  }
}
