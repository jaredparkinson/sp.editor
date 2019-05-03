import { Component, OnInit } from '@angular/core';

import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  constructor(
    public chapterService: ChapterService,
    public editService: EditService,
    private dataService: DataService,
  ) {}

  public ngOnInit() {
    this.dataService.chapter2 = new Chapter2();
  }
}
