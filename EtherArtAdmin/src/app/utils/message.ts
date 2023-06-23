export class Message {
  public data : any ;
  public sender : string;

  public constructor(data: any, sender: string) {
    this.data = data ;
    this.sender = sender ;
  }
}
