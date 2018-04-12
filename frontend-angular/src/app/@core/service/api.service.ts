import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';
import { APIData , SlotData,Tags , Session ,Request, CandicateSession , Profile , User , FileData } from '../service/models/api.data.structure';

@Injectable()
export class APIService {
  private apiUrl = 'http://localhost:3000/api/';
  public static apiUrl_Intercept_Ignore_list: Array<String> = ['auth/login','auth/signup'];
  constructor(private http: HttpClient) {}

  public static getToken() : string {
    return localStorage.getItem('token');
  }

  errorHandler(apiResponse: HttpErrorResponse) {
    return Observable.throw(apiResponse.error);
  // another merge conflict so i chose 1 and commented the other  
  // errorHandler(error: HttpErrorResponse) {
  //   console.log(error.message);
  //   return Observable.throw(error.message || "Server Error");
  }
 // all the methods here are used to link between the frontend and the backend by
 // using the url of the local host + url of the method that is created in the index
  getTags(): Observable<APIData> {
     return this.http.get<APIData>(this.apiUrl + 'Tags/getTags').catch(this.errorHandler);
   }

  
  signup(user:User):Observable<APIData>{
    return this.http.post<APIData>(this.apiUrl + 'auth/signup', user).catch(this.errorHandler);
  }

  
    AddTag(Tags:Tags): Observable<APIData>{
    return this.http.post<Tags>('http://localhost:3000/api/'+ 'Tags/AddTag', Tags).catch(this.errorHandler);
  }
  editTag(Tags:Tags):Observable<APIData>{
    return this.http.patch<Tags>(this.apiUrl + '/Tag/editTags/'+Tags._id,Tags)
    .catch(this.errorHandler);
  }
  deleteTags(Tags:Tags):Observable<APIData>{
    return this.http.delete<Tags>('http://localhost:3000/api/'+ '/Tags/deleteTags/'+Tags._id)
    .catch(this.errorHandler);
  }

  getSlotRequests(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'expert/viewSLotRequest').catch(this.errorHandler);

  }
 
 
 editSlotRequest(request: Request): Observable<APIData> {
  return this.http.patch<APIData>(this.apiUrl+'expert/editSlotRequest/'+request._id,request).catch(this.errorHandler);
 }

  /*getUserData(): Observable<APIData> {
   return this.http.get<APIData>(this.apiUrl + 'user/getUserData').catch(this.errorHandler);
}*/

login(user:User):Observable<APIData>{
  return this.http.post<User>(this.apiUrl + 'auth/login', user)
  .catch(this.errorHandler);
}

update_Email(profile:Profile):Observable<APIData>{
  console.log(profile.email)
  return this.http.post<Profile>(this.apiUrl + 'auth/updateEmail', profile)
  .catch(this.errorHandler);
}

update_Rating(user:User):Observable<APIData>{
  console.log('cbxjklvbfd');
  return this.http.post<User>(this.apiUrl + 'auth/updateRating', user)
  .catch(this.errorHandler);
}

  postFile(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>(this.apiUrl + 'photo', formData).catch(this.errorHandler);
  }

  getimage(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'getphoto').catch(this.errorHandler);
  }

  chooseSlot(slotData:SlotData): Observable<APIData>{
    console.log(slotData);
   return this.http.post<APIData>(this.apiUrl + 'expert/chooseSlot' , slotData).catch(this.errorHandler);
 
  }

  addCandidate( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }
  loadStatus(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'loadStatus').catch(this.errorHandler);
  }

  changeUserStatus(user: User): Observable<APIData>
  {
    return this.http.post<APIData>(this.apiUrl + 'auth/changeUserStatus', user).catch(this.errorHandler);
  };

  updateSessionCandidates( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  getSessionCandidatesRTCDes( session : Session ) {
    return this.http.post<APIData>( this.apiUrl + 'session/getCandidatesRTCDes/' + session.sessionId , session)
    .catch(this.errorHandler);
  }
}
