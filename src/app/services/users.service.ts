
import { Injectable, inject } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { HttpClient } from '@angular/common/http';
import { IWelcome } from '../interfaces/iwelcome.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private httpClient=inject(HttpClient);
  private url="https://peticiones.online/api/users";


  constructor() { }

  getAllUsers(): Observable<IWelcome>{
    return this.httpClient.get<IWelcome>(this.url);
  }

  
  getByUuid(uuid: string): Observable<IUser>{
    return this.httpClient.get<IUser>(`${this.url}/${uuid}`);

  }

  delete(uuid:string): Observable<IUser>{
    return this.httpClient.delete<IUser>(`${this.url}/${uuid}`);
  }
  
  insert(aUser:IUser): Observable<IUser>{
    return this.httpClient.post<IUser>(this.url, aUser);
  }

  update(aUser:IUser){
    return this.httpClient.put<IUser>(`${this.url}/${aUser._id}`,aUser);
  }
}
