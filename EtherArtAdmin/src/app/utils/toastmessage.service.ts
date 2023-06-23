export class ToastmessageService {

  public static TYPE_ERROR = 'ERROR';
  public static TYPE_INFO = 'INFO';
  public static TYPE_WARN = 'WARNING';

  public static showToast(keyword: string, message: string, timeout: number, type) {
    switch (type) {
      case this.TYPE_ERROR:
        console.log('error');
        break;
      case this.TYPE_WARN:
        console.log('warning');
        break;
      case this.TYPE_INFO:
        break;
    }
  }
}
