import { Component, OnInit } from '@angular/core';
import { WTagService } from '../../services/wtag-builder.service';

@Component({
  selector: 'app-wtag-popup',
  templateUrl: './wtag-popup.component.html',
  styleUrls: ['./wtag-popup.component.scss'],
})
export class WTagPopupComponent implements OnInit {
  constructor(public wTagService: WTagService) {}

  ngOnInit() {}
}
