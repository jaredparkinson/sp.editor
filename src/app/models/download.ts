export class Download {
  public fileName: string;
  public title: string;
  public downloaded = false;
  public downloading = false;
  public deleting = false;

  constructor(fileName: string, title: string, downloaded: boolean) {
    this.fileName = fileName;
    this.title = title;
    this.downloaded = downloaded;
  }
}
