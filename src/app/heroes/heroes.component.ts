import { Component, OnInit } from '@angular/core';

import {HeroService} from '../hero.service'
import { Hero } from '../hero';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes:Hero[]

  constructor(private herosService:HeroService
    ){}

  ngOnInit(): void {
    this.getHeroes()
  }

  getHeroes(): void{
  //  this.heroes = this.herosService.getHeroes()

    this.herosService.getHeroes().subscribe(
      heroes => this.heroes = heroes
    )
  }

  add(name:string): void{
    name =name.trim();
    if(!name) {return}
    this.herosService.addHero({name} as Hero).subscribe(
      hero => this.heroes.push(hero)
    )
  }

  delete(hero:Hero): void{
    this.heroes = this.heroes.filter(h => h !== hero);
    this.herosService.deleteHero(hero).subscribe()
  }
}
