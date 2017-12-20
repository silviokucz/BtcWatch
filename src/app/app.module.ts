import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {WatchpageComponent} from "./watchpage/watchpage.component";
import {BlockChainService} from "./service/block-chain.service";
import {LocalStorageService} from "./service/localStorage.service";
import {UiModule} from "./UI/UI.module";
import {CryptoWatchComponent} from "./watchpage/cryptoWatch.component";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {ButtonModule} from "primeng/components/button/button";
import {SharedModule} from "primeng/components/common/shared";
import {DataTableModule} from "primeng/components/datatable/datatable";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {LogService} from "./service/log.service";
import {PopupMenuComponent} from "./UI/popup-menu.component";
import {FootnoteComponent} from "./UI/footnote.component";

@NgModule({
  declarations: [
    AppComponent,
    WatchpageComponent,
    CryptoWatchComponent,
    PopupMenuComponent,
    FootnoteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    UiModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    DropdownModule
  ],
  providers: [BlockChainService, LocalStorageService, LogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
