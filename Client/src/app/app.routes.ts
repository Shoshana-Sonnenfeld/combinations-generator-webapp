import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { StartSessionComponent } from './components/start-session/start-session.component';
import { CombinationViewComponent } from './components/combination-view/combination-view.component';
import { SingleCombinationPageComponent } from './components/single-combination/single-combination-page.component';
import { AllCombinationsPageComponent } from './components/all-combinations/all-combinations-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: StartSessionComponent, pathMatch: 'full' },
            { path: 'single-combination', component: SingleCombinationPageComponent },
            { path: 'all-combinations', component: AllCombinationsPageComponent },
            { path: 'combination-view', component: CombinationViewComponent },
        ],
    },
];
