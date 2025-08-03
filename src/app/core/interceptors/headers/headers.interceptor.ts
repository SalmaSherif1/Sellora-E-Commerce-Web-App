import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (localStorage.getItem('myToken') !== null) {
    if (
      req.url.includes('cart') ||
      req.url.includes('orders') ||
      req.url.includes('wishlist')
    ) {
      req = req.clone({
        setHeaders: {
          token: localStorage.getItem('myToken')!,
        },
      });
    }
  }
  return next(req);
};
