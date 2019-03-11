import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';

@Component({
  selector: 'app-body-block-parent',
  templateUrl: './body-block-parent.component.html',
  styleUrls: ['./body-block-parent.component.scss'],
})
export class BodyBlockParentComponent implements OnInit {
  constructor(public saveState: SaveStateService) {}

  ngOnInit() {}
}
