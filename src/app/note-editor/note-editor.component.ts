import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
// import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
