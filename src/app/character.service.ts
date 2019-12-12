import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, AsyncSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private totalSubject: AsyncSubject<number>
  private topFiveCharactersSubject: AsyncSubject<Array<any>>
  private allCharactersSubject: AsyncSubject<Array<any>>
  private characters: Array<any>

  constructor(private http: HttpClient) {
    this.characters = new Array<any>()
    this.totalSubject = new AsyncSubject()
    this.topFiveCharactersSubject = new AsyncSubject()
    this.allCharactersSubject = new AsyncSubject<Array<any>>()
  }

  getAll(): Observable<Array<any>> {
    this.http.get(`/api/v1/characters`)
      .subscribe((result: any) => {
        this.characters = result

        this.totalSubject.next(this.characters.length)
        this.totalSubject.complete()
        
        this.allCharactersSubject.next(this.characters)
        this.allCharactersSubject.complete()
        
        let topFiveCharacters = _.map(_.orderBy(this.characters, 'comics.available', 'desc'))
        this.topFiveCharactersSubject.next(topFiveCharacters.slice(0, 5))
        this.topFiveCharactersSubject.complete()

      }, err => {
        console.error(err)
      })

    return this.allCharactersSubject
  }

  getTotal(): Observable<any> {
    return this.totalSubject
  }

  getTopFiveCharacters(): Observable<Array<any>> {
    return this.topFiveCharactersSubject
  }
}
