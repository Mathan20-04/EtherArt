import {AppConstants} from '../utils/Constants';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  // login
  private authenticateUrl = 'main/user/authenticate';

  // signup
  private otpUrl = 'main/user/add';
  private activateUrl = 'main/user/verify';

  // forgot password
  private forgotOTP = 'main/user/otp/send';
  private verifyOTP = 'main/user/otp/verify';
  private reset = 'main/user/pwd/reset';

  private pwd : string = "" ;
  private mobile : string = "" ;

  constructor(apiService: ApiService, dataService: DataService) {
    super(apiService, dataService);
  }

  isCacheable(): boolean {
    return true;
  }

  objectKey(): string {
    return 'USER';
  }

  objectParentKey(): string {
    return 'parent_id';
  }

  objectPrimaryKey(): string {
    return 'user_id';
  }

  getListByIdsKey(): string {
    return 'ids';
  }

  /*
    Login Process
    1. authenticate
    2. logout
  */

  authenticate(params): Observable<any> {
    return this.postCommon(this.authenticateUrl, params, false)
      .pipe(
        map(data => {
          let json = JSON.parse(params['auth_json']);
          this.postAuthOrSingup(data, json.email_mobile, json.password) ;
          return data;
        }),
        catchError(ex => {
          alert("Invalid user credentials! Please re-enter")
          return throwError(ex);
        })
      );
  }

  logOut() {
    DataService.deleteFromLocal(AppConstants.AUTH_KEY);
    DataService.deleteFromLocal(AppConstants.USER_OBJECT_KEY);
    DataService.deleteFromLocal(AppConstants.USER_PWD_KEY);
    DataService.deleteFromLocal(AppConstants.LOGIN_ID);
    DataService.deleteFromLocal(AppConstants.ACCESS_KEY);
  }

  /*
    Sign up Process
    1. sendOTP
    2. activate
  */

  private postAuthOrSingup(data , mobile, password) {
    DataService.setDataInLocal(AppConstants.AUTH_KEY, data['token']);
    DataService.setDataInLocal(AppConstants.USER_OBJECT_KEY, JSON.stringify(data['data']));
    DataService.setDataInLocal(AppConstants.USER_PWD_KEY, password);
    DataService.setDataInLocal(AppConstants.LOGIN_ID, mobile);
  }

  sendOTP(params): Observable<any> {
    this.pwd = JSON.parse(params['user_json']).password ;
    this.mobile = JSON.parse(params['user_json']).mobile;
    return this.postCommon(this.otpUrl, params, false)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  activate(params): Observable<any> {
    return this.postCommon(this.activateUrl, params, false)
      .pipe(
        map(data => {
          this.postAuthOrSingup(data, this.mobile, this.pwd)
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /* forgot password
    1. otpForgot
    3. verify
    2. updatePwd
  */

  otpForgot(params): Observable<any> {
  return this.postCommon(this.forgotOTP, params, false)
    .pipe(
      map(data => {
        console.log(data);
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  verify(params): Observable<any> {
    return this.postCommon(this.verifyOTP, params, false)
      .pipe(
        map(data => {
          console.log(data);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  resetPwd(params): Observable<any> {
    return this.postCommon(this.reset, params, false)
      .pipe(
        map(data => {
          console.log(data);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }
}
