import { Component, OnInit } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
import { EditService } from '../services/EditService';
import { DataService } from '../services/data.service';

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

  ngOnInit() {
    this.dataService.chapter2 = new Chapter2();
  }
}
