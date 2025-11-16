import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout-component/admin-layout-component';
import { CadastroUsuarioComponent } from './cadastro-usuario-component/cadastro-usuario-component';
import { CriacaoMissaComponent } from './criacao-missa-component/criacao-missa-component';
import { GerenciamentoEscalaComponent } from './gerenciamento-escala-component/gerenciamento-escala-component';
import { LoginComponent } from './login-component/login-component';
import { authGuard } from './guards/AuthGuard';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children:[
            { path: 'cadastro-usuario', component: CadastroUsuarioComponent, canActivate: [authGuard]},
            { path: 'criacao-missa', component: CriacaoMissaComponent, canActivate: [authGuard] },
            { path: 'gerenciamento-escala', component: GerenciamentoEscalaComponent, canActivate: [authGuard] },
            { path: '', redirectTo: 'criacao-missa', pathMatch: 'full' }
        ]
    },
    {path: 'login', component: LoginComponent}
];
