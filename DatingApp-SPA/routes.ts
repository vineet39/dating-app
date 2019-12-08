import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { MembersListComponent } from 'src/app/members-list/members-list.component';
import { ListsComponent } from 'src/app/lists/lists.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { AuthGuard } from '_guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard]},
    { path: 'lists', component: ListsComponent},
    { path: 'messages', component: MessagesComponent},
    { path: '**', redirectTo: '', pathMatch: 'full'},
];