import { Injectable } from '@angular/core';
import { Character } from './models/character';

import { HttpClient } from '@angular/common/http';
import { Observable, AsyncSubject } from 'rxjs';
import { AuthHelper } from './helpers/auth';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private totalSubject: AsyncSubject<number>
  private topFiveCharactersSubject: AsyncSubject<Array<any>>
  private allCharactersSubject: AsyncSubject<Array<any>>
  private offset: number
  private characters: Array<any>

  constructor(private http: HttpClient) {
    this.characters = new Array<any>()
    this.totalSubject = new AsyncSubject()
    this.topFiveCharactersSubject = new AsyncSubject()
    this.allCharactersSubject = new AsyncSubject()
    this.offset = 0
  }

  getTotal(): Observable<any> {
    return this.totalSubject
  }

  getAll(): Observable<Array<any>> {
    this.http.get(`/v1/public/characters?limit=100&offset=${this.offset}${AuthHelper.getAuthParameters()}`)
      .subscribe((result: any) => {
        this.characters.push.apply(this.characters, result.data.results)

        if (result.data.results.length === 0) {
          this.offset = 0
          let topFiveCharacters = _.map(_.orderBy(this.characters, 'comics.available', 'desc'))
          this.topFiveCharactersSubject.next(topFiveCharacters.slice(0, 5))
          this.topFiveCharactersSubject.complete()
          this.allCharactersSubject.next(this.characters)
          this.allCharactersSubject.complete()
        } else {
          if (this.offset === 0) {
            this.totalSubject.next(result.data.total)
            this.totalSubject.complete()
          }
          this.offset += 100
          this.getAll()
        }
      }, err => {
        console.error(err)
      })

    return this.allCharactersSubject
  }

  getTopFiveCharacters(): Observable<Array<any>> {
    return this.topFiveCharactersSubject
  }
}
