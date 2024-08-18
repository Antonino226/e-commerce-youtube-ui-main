import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.css']
})
export class DeleteCategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteWithProducts(): void {
    this.dialogRef.close({ deleteProducts: true });
  }

  deleteWithoutProducts(): void {
    this.dialogRef.close({ deleteProducts: false });
  }
}
