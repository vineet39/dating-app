import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { MembersListComponent } from 'src/app/members/members-list/members-list.component';
import { ListsComponent } from 'src/app/lists/lists.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { AuthGuard } from '_guards/auth.guard';
import { MemberDetailComponent } from 'src/app/members/member-detail/member-detail.component';
import { MemberEditComponent } from 'src/app/members/member-edit/member-edit.component';
import { MemberDetailResolver } from '_resolvers/member-detail.resolver';
import { MemberEditResolver } from '_resolvers/member-edit.resolver';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard]},
    { path: 'members/edit', component: MemberEditComponent, canActivate: [AuthGuard], resolve: {user: MemberEditResolver}},
    { path: 'members/:id', component: MemberDetailComponent, canActivate: [AuthGuard], resolve: {user: MemberDetailResolver}},
    { path: 'lists', component: ListsComponent},
    { path: 'messages', component: MessagesComponent},
    { path: '**', redirectTo: '', pathMatch: 'full'},
];
