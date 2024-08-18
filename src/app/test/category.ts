import { Category } from "../_model/category.model";

export const CATEGORY: Category[] = [
    {
      categoryId: 1,
      categoryName: 'Maglie',
      categoryDescription: 'Descrizione delle maglie',
      categoryImages:[
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 2,
      categoryName: 'Felpa',
      categoryDescription: 'Descrizione delle felpe',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 3,
      categoryName: 'Puzzle',
      categoryDescription: 'Descrizione dei puzzle',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 4,
      categoryName: 'Cuscino Cuore',
      categoryDescription: 'Descrizione dei cuscini cuore',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 5,
      categoryName: 'Plaid',
      categoryDescription: 'Descrizione dei plaid',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 6,
      categoryName: 'Tazza Magica',
      categoryDescription: 'Descrizione delle tazze magiche',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    },
    {
      categoryId: 7,
      categoryName: 'Bevande',
      categoryDescription: 'Bevande',
      categoryImages: [
        {
          file: new File([], 'pantaloni2.jpg'),
          url: '../assets/images/image_2.jpg'
        }
      ],
    }
  ];