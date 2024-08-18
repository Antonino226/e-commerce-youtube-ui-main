import { Product } from "../_model/product.model";

export const PRODUCTS: Product[] = [
  {
    productId: 1,
    productName: 'Maglietta',
    productDescription: 'Una maglietta comoda di cotone.',
    productDiscountedPrice: 15,
    productActualPrice: 20,
    productImages: [
      {
        file: new File([], 'maglietta1.jpg'),
        url: '../assets/images/image_2.jpg'
      },
      {
        file: new File([], 'maglietta2.jpg'),
        url: '../assets/images/image_2.jpg'
      }
    ],
    category: {
        categoryId: 1,
        categoryName: 'Abbigliamento',
        categoryDescription: "",
        categoryImages: [
          {
            file: new File([], 'pantaloni2.jpg'),
            url: '../assets/images/image_2.jpg'
          }
        ],
    }
  },
  {
    productId: 2,
    productName: 'Pantaloni',
    productDescription: 'Pantaloni eleganti per tutte le occasioni.',
    productDiscountedPrice: 30,
    productActualPrice: 40,
    productImages: [
      {
        file: new File([], 'pantaloni1.jpg'),
        url: '../assets/images/image_2.jpg'
      },
      {
        file: new File([], 'pantaloni2.jpg'),
        url: '../assets/images/image_2.jpg'
      }
    ],
    category: {
        categoryId: 1,
        categoryName: 'Abbigliamento',
        categoryDescription: "",
        categoryImages: [
          {
            file: new File([], 'pantaloni2.jpg'),
            url: '../assets/images/image_2.jpg'
          }
        ],
    }
  },
  {
    productId: 3,
    productName: 'Scarpe da ginnastica',
    productDescription: 'Scarpe da ginnastica comode e alla moda.',
    productDiscountedPrice: 45,
    productActualPrice: 60,
    productImages: [
      {
        file: new File([], 'scarpe1.jpg'),
        url: '../assets/images/image_2.jpg'
      },
      {
        file: new File([], 'scarpe2.jpg'),
        url: '../assets/images/image_2.jpg'
      }
    ],
    category: {
        categoryId: 2,
        categoryName: 'Calzature',
        categoryDescription: "",
        categoryImages: [
          {
            file: new File([], 'pantaloni2.jpg'),
            url: '../assets/images/image_2.jpg'
          }
        ],
    }
  },
  {
    productId: 4,
    productName: 'Cappotto',
    productDescription: 'Un cappotto caldo per l\'inverno.',
    productDiscountedPrice: 80,
    productActualPrice: 100,
    productImages: [
      {
        file: new File([], 'cappotto1.jpg'),
        url: '../assets/images/image_2.jpg'
      },
      {
        file: new File([], 'cappotto2.jpg'),
        url: '../assets/images/image_2.jpg'
      }
    ],
    category: {
        categoryId: 1,
        categoryName: 'Abbigliamento',
        categoryDescription: "",
        categoryImages: [
          {
            file: new File([], 'pantaloni2.jpg'),
            url: '../assets/images/image_2.jpg'
          }
        ],
    }
  },
  {
    productId: 5,
    productName: 'Orologio',
    productDescription: 'Un orologio elegante da polso.',
    productDiscountedPrice: 150,
    productActualPrice: 200,
    productImages: [
      {
        file: new File([], 'orologio1.jpg'),
        url: '../assets/images/image_2.jpg'
      },
      {
        file: new File([], 'orologio2.jpg'),
        url: '../assets/images/image_2.jpg'
      }
    ],
    category: {
        categoryId: 3,
        categoryName: 'Accessori',
        categoryDescription: "",
        categoryImages: [
          {
            file: new File([], 'pantaloni2.jpg'),
            url: '../assets/images/image_2.jpg'
          }
        ],
    }
  }
];