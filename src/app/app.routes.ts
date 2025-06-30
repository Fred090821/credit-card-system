import { Routes } from '@angular/router';
import { AddCardComponent } from './add-card/add-card.component';
import { GetAllCardsComponent } from './get-all-cards/get-all-cards.component';

export const routes: Routes = [
  { path: 'add-card', component: AddCardComponent },
  { path: 'get-all-cards', component: GetAllCardsComponent },
  { path: '', redirectTo: '/add-card', pathMatch: 'full' }
];