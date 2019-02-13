import { Component, OnInit } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
import { EditService } from "../services/EditService";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor(
    public chapterService: ChapterService,
    public editService: EditService
  ) {}

  ngOnInit() {
    this.editService.chapter2 = new Chapter2();
  }
}
