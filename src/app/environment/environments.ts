import { HttpHeaders } from '@angular/common/http';

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/',

  Apiheader:
  {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method'
  },
};
export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

export const httpFormData = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  })
};
