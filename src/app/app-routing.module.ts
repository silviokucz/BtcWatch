import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {WatchpageComponent} from "./watchpage/watchpage.component";

const routes: Routes = [
  {
    path: '',
    children: [{
      path: '', component: WatchpageComponent
    }]
  },
  {
    path: 'watch', component: WatchpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
