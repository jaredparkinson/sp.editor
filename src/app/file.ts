export class File {
  private fileName: string;
  private depth: number;

  constructor(fileName: string) {
    this.fileName = fileName;
    console.log(fileName);
    this.setDepth();
  }

  private setDepth(): void {
    this.depth = 0;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getDepth(): number {
    return this.depth;
  }
}
