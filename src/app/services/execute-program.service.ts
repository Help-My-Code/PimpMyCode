import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExecuteProgramService {

  private readonly BASE_URL = '/program';

  constructor(private http: Http) {
  }

  execute(language: string, stdin: string) {
    return this.http.post(`${process.env.BACKEND}` + this.BASE_URL + '/execute', {
      language: language,
      stdin: stdin
    });
  }
}
