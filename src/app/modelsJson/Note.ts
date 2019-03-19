import { SecondaryNote } from './SecondaryNote';
export class Note {
  public id: string;
  public noteTitle: string;
  public noteShortTitle: string;
  public secondary: SecondaryNote[] = [];
}
