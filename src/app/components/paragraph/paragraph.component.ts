import { Component, Input, OnInit } from '@angular/core';
import { Paragraph } from '../../modelsJson/Paragraph';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent implements OnInit {
  @Input() public paragraph: Paragraph;

  constructor() {}

  ngOnInit() {}
}
