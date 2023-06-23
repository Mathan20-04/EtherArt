export const VisualMode = {
  day : 'DAY',
  night : 'NIGHT'
}

export const ViewPage = {
  Generate : 1,
  Release : 2,
  Rarity : 3,
  Browse : 4
}
export const ErrorCodes = {
  GENERAL_ERROR : 'ERROR001',
  HTTP_ERROR : 'ERROR002'
}

export const ErrorMessages = {
  INTERNAL_ERROR : 'Internal Error!',
  NO_RESP_ERROR : 'No Response from the server',
  NO_DATA_ERROR : 'No Data',
  NO_AUTH_ERROR : 'Not Authorised'
}

export const HttpMethod = {
  GET : 'GET',
  POST : 'POST',
  PUT : 'PUT',
  DELETE : 'DELETE'
}

export const AppConstants = {
  AUTH_KEY : 'AUTH_KEY',
  USER_OBJECT_KEY : 'USER_OBJECT_KEY',
  USER_PWD_KEY : 'USER_PWD_KEY',
  LOGIN_ID : 'LOGIN_ID_KEY',
  LAST_SYNC_DATE : 'last_sync_date',
  ACCESS_KEY : 'ACCESS',
  REPORT_LIST : 'reports'
}

export const Actions = {
  add : 'ADD',
  edit : 'EDIT',
  view : 'VIEW',
  del : 'DELETE'
}

export const Config = {
  SMS : true
}

export const ItemStatus = {
  OnSale : 1 , // user can buy
  Owned : 2, // user can bid
  OwnerSale: 3 // user can buy and bid
}

export const ItemStatusText = {
  OnSale : "On Sale",
  OnBid : "Open for Bid",
  OwnerSale : "On Sale"
}
