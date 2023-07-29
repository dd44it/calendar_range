import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private dateURL = 'http://localhost:5050/date'

  constructor(private http: HttpClient) { }

  getDates(): Observable<any[]> {
    return this.http.get<any[]>(this.dateURL).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Unknown error occurred";
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

}
