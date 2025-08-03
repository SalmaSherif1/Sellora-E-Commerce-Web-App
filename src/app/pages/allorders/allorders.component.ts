import { Component, inject, OnInit } from '@angular/core';
import { GetOrdersService } from '../../core/services/getOrders/get-orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Orders } from '../../shared/interfaces/orders';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-allorders',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly getOrdersService = inject(GetOrdersService);
  private readonly authService = inject(AuthService);

  UserId: string = '';
  orders: Orders[] = [];

  ngOnInit(): void {
    this.authService.getUserData();
    this.UserId = this.authService.userData.id;

    this.getOrdersService.getUserOrders(this.UserId).subscribe({
      next: (res) => {
        console.log(res);
        this.orders = res;
      },
    });
  }
}
