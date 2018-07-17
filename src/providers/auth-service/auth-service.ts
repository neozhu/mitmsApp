import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';



export class User {
  name: string;
  phonenumber: string;
  title: string;


  constructor(name: string, phonenumber: string) {
    this.name = name;
    this.phonenumber = phonenumber;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;
  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
    this.currentUser = new User('蒋小斌', '13513661366');
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('蒋小斌', '13513661366');
        observer.next(access);
        observer.complete();
      });
    }
  }
  public getUserInfo(): User {
    return this.currentUser;
  }

}
