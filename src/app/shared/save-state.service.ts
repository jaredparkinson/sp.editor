import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {
  public foldersVisible = true;
  public paragraphsVisible = false;
  constructor() {}
}
