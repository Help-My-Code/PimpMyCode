import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private httpClient: HttpClient) {
    }

    get<T>(url: string): Promise<T | undefined> {
        return new Promise((resolve, reject) =>
            this.httpClient.get(url, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve;
                        } else if (data.body) {
                            resolve(data.body as T);
                        } else {
                            reject;
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    getAll<T>(url: string): Promise<T[]> {
        return new Promise((resolve, reject) => this.httpClient.get(url, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve([]);
                        } else if (data.body) {
                            let res = data.body as T[];
                            res = res.map(function (res) {
                                return res;
                            })
                            resolve(res);
                        } else {
                            reject([]);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    post<T>(url: string, body?: any): Promise<T> {
        return new Promise((resolve, reject) => this.httpClient.post(url, body ? body : {}, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve;
                        } else if (data.body) {
                            resolve(data.body as T);
                        } else {
                            reject;
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    postMultiRes<T>(url: string, body?: any): Promise<T[]> {
        return new Promise((resolve, reject) => this.httpClient.post(url, body ? body : {}, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve([]);
                        } else if (data.body) {
                            let res = data.body as T[];
                            res = res.map(function (res) {
                                return res;
                            })
                            resolve(res);
                        } else {
                            reject([]);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    put<T>(url: string, body?: any): Promise<T> {
        return new Promise((resolve, reject) => this.httpClient.put(url, body ? body : {}, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve;
                        } else if (data.body) {
                            resolve(data.body as T);
                        } else {
                            reject;
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    putMultiRes<T>(url: string, body?: any): Promise<T[]> {
        return new Promise((resolve, reject) => this.httpClient.put(url, body ? body : {}, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve([]);
                        } else if (data.body) {
                            let res = data.body as T[];
                            res = res.map(function (res) {
                                return res;
                            })
                            resolve(res);
                        } else {
                            reject([]);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

    delete<T>(url: string): Promise<T[]> {
        return new Promise((resolve, reject) => this.httpClient.delete(url, {
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                observe: 'response'
            })
                .subscribe(
                    (data) => {
                        if (data.status === 204) {
                            resolve([]);
                        } else if (data.body) {
                            let res = data.body as T[];
                            res = res.map(function (res) {
                                return res;
                            })
                            resolve(res);
                        } else {
                            reject([]);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        );
    }

}
