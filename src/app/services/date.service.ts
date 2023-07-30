import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
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

  postDates(data: any): Observable<HttpResponse<any>>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      observe: "response" as "response",
    };
    return this.http.post<any>(this.dateURL, data, httpOptions ).pipe(
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

  extractIndividualDates(dateRanges: any[]): Date[] {
    const step = 1;
    const individualDates: Date[] = [];
    dateRanges.forEach((dateRange) => {
      const startDate = new Date(dateRange.date_start);
      const endDate = new Date(dateRange.date_end);

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        individualDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + step);
      }
    });
    return individualDates;
  }

  formatDateToStringForDB(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  formatDateToStringForClient(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  }

}
