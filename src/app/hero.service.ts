import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators'

import {Hero} from './hero'
import {HEROES} from './mock-heroes'

import {MessageService} from './message.service'
import {HttpClient,HttpHeaders} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesURL = 'api/heroes'
  httpOptions ={
    header: new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(
    private messageService:MessageService,
    private http: HttpClient
  ) { }
  /*
  getHeroes(): Observable <Hero []>{
    this.messageService.add('HeroService: fetched heroes')
    return of(HEROES)
  }*/

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesURL).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    )
  }
  /*
  getHero(id: number): Observable<Hero>{
    this.messageService.add(`HeroService: fetched hero id=${id}`)
    return of(HEROES.find(hero => hero.id === id))
  }*/

  getHero(id: number): Observable<Hero>{
    return this.http.get<Hero>(`${this.heroesURL}/${id}`).pipe(
      tap( _ => this.log(`fetched heroe id= ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero:Hero): Observable<any> {
    return this.http.put(this.heroesURL,hero).pipe(
      tap( _=> this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero:Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesURL,hero).pipe(
      tap((newHero:Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }
  deleteHero(hero:Hero | number):Observable<Hero>{
    const id = typeof hero === 'number'? hero: hero.id;
    
    return this.http.delete<Hero>(`${this.heroesURL}/${id}`).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  searchHeroes(term:string): Observable<Hero[]>{
    if(!term.trim()) return of([]);

    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`).pipe(
      tap( x => x.length ? 
          this.log(`found heroes matching "${term}"`):
          this.log(`no heroes matching "${term}"`)
        ),
      catchError(this.handleError<Hero[]>('searchHeroes',[]))
    )
  }

  private log(message:string){
    this.messageService.add(`HeroService: ${message}`)
  }

  private handleError<T>(operation='operation', result?:T){
    return (error:any):Observable<T> =>{
      console.error(error);
      this.log(`${operation} failed ${error.message}`)

      return of(result as T)
    }
  }
}
