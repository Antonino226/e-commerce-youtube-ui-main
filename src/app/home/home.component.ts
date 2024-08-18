import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  Compiler,
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('categoryContainer', { read: ViewContainerRef })
  categoryContainer: ViewContainerRef;
  @ViewChild('productsContainer', { read: ViewContainerRef })
  productsContainer: ViewContainerRef;
  @ViewChild('locationContainer', { read: ViewContainerRef })
  locationContainer: ViewContainerRef;

  public categoryRendered = false;
  public productsRendered = false;
  public locationRendered = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler
  ) {}

  public handleScroll(event) {
    const scrollPosition =
      event.target.scrollTop + event.target.clientHeight + 50;

    const categoryContainerPos =
      this.categoryContainer.element.nativeElement.offsetTop;
    if (!this.categoryRendered && scrollPosition >= categoryContainerPos) {
      this.categoryRendered = true;
      this.loadCategoryContainer();
    }

    const productsContainerPos =
      this.productsContainer.element.nativeElement.offsetTop;
    if (!this.productsRendered && scrollPosition >= productsContainerPos) {
      this.productsRendered = true;
      this.loadProductsContainer();
    }

    const locationContainerPos =
      this.locationContainer.element.nativeElement.offsetTop;
    if (!this.locationRendered && scrollPosition >= locationContainerPos) {
      this.locationRendered = true;
      this.loadLocationContainer();
    }
  }

  private loadCategoryContainer() {
    import('../category/category.component').then(
      ({ CategoryComponent }) => {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            CategoryComponent
          );
        const { instance } = this.categoryContainer.createComponent(componentFactory);
      }
    );
  }

  private loadProductsContainer() {
    import('../products/products.component').then(
      ({ ProductsComponent }) => {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            ProductsComponent
          );
        const { instance } = this.productsContainer.createComponent(componentFactory);
      }
    );
  }

  private loadLocationContainer() {
    import('../location/location.component').then(
      ({ LocationComponent }) => {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            LocationComponent
          );
        const { instance } = this.locationContainer.createComponent(componentFactory);
      }
    );
  }
}
