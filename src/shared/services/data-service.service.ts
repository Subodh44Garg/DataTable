import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getClientIds() {
    return [4,5,6,7,9]
  }

  getAnalyses(client_ids, sortBy, sortDir, search, offset, limit) {
    const postBody = {
      client_ids: client_ids,
      searchReq: search
    }
    return this.http.get('asstets/data/data.json');
  }

  getTableColumnConfig(tableName) {
    // GET column config object here
    // return this.http.get(`assets/data/${tableName}ColumnConfig.json`).pipe(
    //   map(
    //     (res: Response) => res['data']
    //   ));
  }
}
