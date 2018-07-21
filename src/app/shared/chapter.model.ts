import { NavigationService } from '../navigation.service';
import {
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Injectable
} from '@angular/core';
@Injectable()
export class ChapterModel {
  constructor(private navService: NavigationService) {}

  //   ngOnChanges(changes: SimpleChanges) {
  //     console.log('test');
  //   }
}
