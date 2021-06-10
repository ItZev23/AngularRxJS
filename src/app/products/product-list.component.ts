import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$: Observable<Product[]> = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$.pipe(startWith(0)),
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  categories$: Observable<ProductCategory[]> =
    this.productService.productCategories$.pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnInit(): void {
    // this.products$ = this.productService.getProducts().pipe(
    //   catchError((err) => {
    //     this.errorMessage = err;
    //     return EMPTY;
    //   })
    // );
  }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
