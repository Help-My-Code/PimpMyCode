import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {config} from "../../config/pimpmycode.config";

@Injectable({
  providedIn: 'root'
})
export class ExecuteProgramService {

  private readonly BASE_URL = '/program';

  constructor(private http: Http) {
  }

  execute(language: string, stdin: string) {
    return this.http.post("http://backend.dev.pimp-my-code.xyz" + this.BASE_URL + "/execute", {
      language: language,
      stdin: stdin
    });
  }
}
