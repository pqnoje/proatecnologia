import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js';
import { CharacterService } from '../character.service';
import { Character } from '../models/character';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('topFiveCharacters', { static: false }) donut: ElementRef

  public characters: Array<Character>
  public totalCharacters: number
  public dtOptions: DataTables.Settings = {}
  public dtTrigger: Subject<any>

  constructor(private characterService: CharacterService) {
    this.characters = new Array<Character>()
    this.dtTrigger = new Subject()
    this.dtOptions = {}
  }

  ngOnInit() {
    this.getTotal()
    this.getAllCharacters()
    this.getTopFiveCharacters()
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100
    }
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe()
  }

  getTotal() {
    this.characterService.getTotal().subscribe(
      total => this.totalCharacters = total,
      err => console.error(err)
    )
  }

  getAllCharacters() {
    this.characterService.getAll().subscribe(
      allCharacters => {
        this.characters = allCharacters
        this.dtTrigger.next()
      },
      err => console.error(err)
    )
  }

  getTopFiveCharacters() {
    let nativeEl = document.getElementById('topFiveCharacters') as HTMLCanvasElement

    this.characterService.getTopFiveCharacters().subscribe(
      topFiveCharacters => {
        let characterLabels = topFiveCharacters.map(character => character.name)
        let characterAvailables = topFiveCharacters.map(character => character.comics.available)

        new Chart(nativeEl, {
          type: 'bar',
          data: {
            labels: characterLabels,
            datasets: [
              {
                label: "Aparições",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: characterAvailables
              }
            ]
          },
          options: {
            legend: { display: true },
            title: {
              display: true,
              text: 'Cinco heróis que mais apareceram em quadrinhos'
            }
          }
        })
      },
      err => console.error(err)
    )
  }
}
