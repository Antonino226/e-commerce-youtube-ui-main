import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './_model/file-handle.model';
import { Product } from './_model/product.model';
import { Category } from './_model/category.model';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }

  public createImagesProduct(product: Product) {
    const productImages: any[] = product.productImages;

    const productImagesToFileHandle: FileHandle[] = [];

    for (let i = 0; i < productImages.length; i++) {
      const imageFileData = productImages[i];

      const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);

      const imageFile = new File([imageBlob], imageFileData.name, { type: imageFileData.type });

      const finalFileHandle :FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      productImagesToFileHandle.push(finalFileHandle);
    }

    product.productImages = productImagesToFileHandle;
    return product;
  }

  public createImagesCategory(category: Category) {
    const categoryImages: any[] = category.categoryImages;

    const categoryImagesToFileHandle: FileHandle[] = [];

    if (categoryImages.length === 0) {
      const defaultImageFileHandle: FileHandle = {
        file: null,
        url: this.sanitizer.bypassSecurityTrustUrl('src/assets/images/image_2.jpg')
      };
      categoryImagesToFileHandle.push(defaultImageFileHandle);
    } else {
      for (let i = 0; i < categoryImages.length; i++) {
        const imageFileData = categoryImages[i];

        const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);

        const imageFile = new File([imageBlob], imageFileData.name, { type: imageFileData.type });

        const finalFileHandle: FileHandle = {
          file: imageFile,
          url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
        };

        categoryImagesToFileHandle.push(finalFileHandle);
      }
    }

    category.categoryImages = categoryImagesToFileHandle;
    return category;
  }

  public dataURItoBlob(picBytes, imageType) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for(let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}
