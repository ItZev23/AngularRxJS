import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListAltComponent implements OnInit {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  selectedProductId: number;

  products$: Observable<Product[]> =
    this.productService.productsWithCategory$.pipe(
      catchError((err) => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  sub: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // this.sub = this.productService.getProducts().subscribe(
    //   products => this.products = products,
    //   error => this.errorMessage = error
    // );
  }
  selectedProduct$ = this.productService.selectedProduct$;

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
