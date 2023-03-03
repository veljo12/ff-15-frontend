import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./components/pages/pages.module').then(
                (pm) => pm.PagesModule
            ),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./components/admin/admin.module').then(
                (am) => am.AdminModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
