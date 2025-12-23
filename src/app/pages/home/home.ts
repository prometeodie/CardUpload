import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from '../../interface/card.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-home',
  standalone: true,
    styleUrl: './home.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIcon
  ],
  templateUrl: './home.html'
})
export class Home {

factions = ['marte', 'tierra', 'pluton', 'saturno', 'neptuno', 'jupiter'];
  rarities = ['common','rare','epic','legendary','unlimited'];
  tagsList = [
  'Adivinar',
  'Activar magia',
  'Amanecer',
  'Anulo',
  'Al atacar',
  'Alrededor',
  'Al golpear',
  'aliada',
  'Aniquilar',
  'Asalto',
  'Atacar 2 veces',
  'Ataque 360',
  'Ataque rápido',
  'Atrapo',
  'Aturdir',
  'Busco',
  'Cargar',
  'Carta',
  'Caída libre',
  'Cementerio',
  'Comerciable',
  'Contraatacar',
  'Creo',
  'Criatura',
  'curar',
  'Coste',
  'Daño',
  'Dejo',
  'Destruyo',
  'Devuelvo',
  'Drenar',
  'Diagonal',
  'Empujo',
  'Enfermedad',
  'Enemiga',
  'Entro',
  'Equipado',
  'Escudo mágico',
  'Estoy en el campo',
  'estructura',
  'Finalizar',
  'Gano',
  'Ganan',
  'huevo',
  'Inicio del turno',
  'invocar',
  'inflinjo',
  'Inmune',
  'Mano',
  'Mazo',
  'mejora',
  'Mezclo',
  'Mientras estoy',
  'morir',
  'Mover',
  'no puedo',
  'no puede',
  'objetivo',
  'Obtengo',
  'Ofrenda tenebrosa',
  'Oponente',
  'otorgo',
  'Pagar',
  'Primera vez',
  'Provocar',
  'Puñalada',
  'Regeneración',
  'Reducir',
  'Respuesta',
  'Revelar',
  'Revivo',
  'Robar',
  'Sacrificar',
  'Sello',
  'Selecciona',
  'Silencio',
  'Sobrecarga',
  'Toque mortal',
  'Token';
  'Último suspiro',
  'Venganza',
  'Vida',
  'Vínculo'
];


  cardForm: FormGroup;
  cards: Card[] = [];
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    // Crear formulario con controles
    const tagsGroup: any = {};
    this.tagsList.forEach(tag => tagsGroup[tag] = new FormControl(false));

    this.cardForm = this.fb.group({
      name: [''],
      faction: [''],
      rarity: [''],
      img: [''],
      factionCost: [0],
      cost: [0],
      banned: [false],
      isSeal: [false],
      isToken: [false],
      isQuickSpell: [false],
      isSlowSpell: [false],
      isArtifact: [false],
      tags: this.fb.group(tagsGroup)
    });
  }
  ngOnInit() {
    const saved = localStorage.getItem('cards');
    this.cards = saved ? JSON.parse(saved) : [];
  }

  saveCard() {
  const formValue = this.cardForm.value;
  const selectedTags = this.tagsList.filter(tag => formValue.tags[tag]);

  const rawCard: Card = {
    id: this.editingIndex !== null
      ? this.cards[this.editingIndex].id
      : Date.now().toString(),
    ...formValue,
    tags: selectedTags
  };

  const card = this.normalizeCard(rawCard);

  if (this.editingIndex !== null) {
    this.cards[this.editingIndex] = card;
    this.editingIndex = null;
  } else {
    this.cards.push(card);
  }

  localStorage.setItem('cards', JSON.stringify(this.cards));
  this.cardForm.reset();
}


 private normalizeCard<T extends Record<string, any>>(card: T): T {
  return Object.fromEntries(
    Object.entries(card).map(([key, value]) => {
      if (value === null) {
        if (key === 'cost') {
          return [key, 0];
        }
        return [key, false];
      }
      return [key, value];
    })
  ) as T;
}


  editCard(index: number) {
    const card = this.cards[index];
    this.editingIndex = index;

    // Setear valores en el formulario
    this.cardForm.patchValue({
      name: card.name,
      faction: card.faction,
      rarity: card.rarity,
      img: card.img,
      factionCost: card.factionCost,
      cost: card.cost,
      banned: card.banned,
      isSeal: card.isSeal,
      isToken: card.isToken,
      isQuickSpell: card.isQuickSpell,
      isSlowSpell: card.isSlowSpell,
      isArtifact: card.isArtifact,
    });

    // Setear tags
    const tagsGroup = this.cardForm.get('tags') as FormGroup;
    this.tagsList.forEach(tag => tagsGroup.get(tag)?.setValue(card.tags.includes(tag)));
  }

  deleteCard(index: number) {
  const card = this.cards[index];
  const confirmed = window.confirm(`¿Estás seguro que querés eliminar la carta "${card.name}"?`);
  if (confirmed) {
    this.cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }
}

downloadCards() {
  if (this.cards.length === 0) {
    window.alert("No hay cartas para descargar.");
    return;
  }
 const confirmed = window.confirm(`deseas descargar las cartas?`);

 if(confirmed){

   // Convertir a JSON
   const dataStr = JSON.stringify(this.cards, null, 2);
   const blob = new Blob([dataStr], { type: 'application/json' });

   // Crear URL temporal
   const url = window.URL.createObjectURL(blob);

   // Crear enlace de descarga y disparar click
   const a = document.createElement('a');
   a.href = url;
   a.download = 'cards.json';
   a.click();

   // Liberar URL
   window.URL.revokeObjectURL(url);

   // Vaciar array y localStorage
   this.cards = [];
   localStorage.removeItem('cards');
  }
}
}
