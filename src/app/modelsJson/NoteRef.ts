import { ReferenceLabel } from './ReferenceLabel';
export class NoteRef {
  public id: string;
  public classList: string[] = [];
  public text: string;
  public referenceLabel: ReferenceLabel;
  public visible = true;
}
