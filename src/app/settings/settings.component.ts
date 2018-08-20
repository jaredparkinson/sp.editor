import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../services/save-state.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    public saveState: SaveStateService,
    public navServices: NavigationService
  ) {}

  ngOnInit() {}
}
