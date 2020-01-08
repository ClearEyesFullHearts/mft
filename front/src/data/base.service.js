import axios from 'axios';
import { ResponseWrapper, ErrorWrapper } from './util';
import $store from '../store';
// eslint-disable-next-line import/extensions
import { API_URL } from '../.env';

export default class BaseService {
  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
    });
    this.ResponseWrapper = ResponseWrapper;
    this.ErrorWrapper = ErrorWrapper;
    this.store = $store;
  }

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  request() {
    if (this.store.state.auth && this.store.state.auth.authorized) {
      this.http.defaults.headers.Authorization = `Bearer ${this.store.state.auth.token}`;
    } else {
      delete this.http.defaults.headers.Authorization;
    }
    // add token from store
    return this.http;
  }

  responseWrapper(...rest) {
    return new this.ResponseWrapper(...rest);
  }

  errorWrapper(...rest) {
    return new this.ErrorWrapper(...rest);
  }
}
