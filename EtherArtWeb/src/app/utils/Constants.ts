export const VisualMode = {
  day : 'DAY',
  night : 'NIGHT'
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
  COLLECTION_LIST_KEY : 'CollectionListKey',
  ACCESS_KEY : 'ACCESS',
  DATA: 'DATA',
  VERSION : 'VERSION'
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

export const StripeKey = {
  Test: 'pk_test_51KRePqSD3idCxgucuyT9XoBP3DC8hRH59I3SSKiyI32AqXqfbvllWD8NLWpqyECDZ1cn4mwt0RtbpmX1y2QunKrV00glY3nVVh',
  Prod: 'pk_live_51Kf16cLvM9rLkhkbBTkx2iVdjTjjzE6SHgRbYReslGx4JybPcqdQ0dbEld6DwMGQtwh1lJRiSoDnye4tg5fwY8No009HRvVjOQ'
}

