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
  'Amanecer',
  'Al atacar',
  'Al golpear',
  'Aniquilar',
  'Asalto',
  'Ataque 360',
  'Ataque rápido',
  'Atrapo',
  'Aturdir',
  'Cargar',
  'Caída libre',
  'Comerciable',
  'Creo',
  'curar',
  'Drenar',
  'Enfermedad',
  'Escudo mágico',
  'estructura',
  'Inicio del turno',
  'invocar',
  'inflinjo',
  'mejora',
  'Mover',
  'no puedo',
  'objetivo',
  'Ofrenda tenebrosa',
  'otorgo',
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
  'Silencio',
  'Sobrecarga',
  'Toque mortal',
  'Último suspiro',
  'Venganza',
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
    const card: Card = {
      id: this.editingIndex !== null ? this.cards[this.editingIndex].id : Date.now().toString(),
      ...formValue,
      tags: selectedTags
    };

    if(this.editingIndex !== null){
      this.cards[this.editingIndex] = card;
      this.editingIndex = null;
    } else {
      this.cards.push(card);
    }

    localStorage.setItem('cards', JSON.stringify(this.cards));
    this.cardForm.reset();
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


onFlagChange(selectedFlag: string, checked: boolean) {
  if (checked) {
    // Si activaste uno, desactivar todos los demás
    const flags = ['banned', 'isSeal', 'isToken', 'isQuickSpell', 'isSlowSpell', 'isArtifact'];
    flags.forEach(flag => {
      if (flag !== selectedFlag) {
        this.cardForm.get(flag)?.setValue(false, { emitEvent: false });
      }
    });
  }
  // Si desactivaste, no hace falta nada (queda ninguno seleccionado)
}


}
