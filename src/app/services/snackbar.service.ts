import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, type: string = 'info') {
    this._snackBar.open(message, '', {duration: 2000, panelClass: [`${type}-snackbar`]});
  }
}
