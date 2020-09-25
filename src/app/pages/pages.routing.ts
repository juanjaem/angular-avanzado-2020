import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARDS
import { AuthGuard } from '../guards/auth.guard';

// PAGES
import { PagesComponent } from './pages.component';


const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard], // LAZY LOAD
        loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule) // LAZY LOAD
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
