import {CommonModule} from "@angular/common";
import {AppComponent} from "../app.component";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {seconds2TimePipe} from "./seconds2Time.pipe";
import {LogViewComponent} from "./logView.component";
import {DialogModule} from "primeng/components/dialog/dialog";
import {first3EllpsisLast3Pipe} from "./first3...last3.pipe";
import {ButtonModule} from "primeng/components/button/button";
import {TickerComponent} from "./ticker.component";
import {PanelModule} from "primeng/components/panel/panel";
import {CarouselModule} from "primeng/components/carousel/carousel";
import {AccordionModule, InputTextareaModule, MenuModule, MessagesModule} from "primeng/primeng";
import {ImportExportComponent} from "./importExport.component";
import {AboutComponent} from "./about.component";


@NgModule({
  declarations: [
    seconds2TimePipe,
    LogViewComponent,
    first3EllpsisLast3Pipe,
    TickerComponent,
    ImportExportComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    CarouselModule,
    MessagesModule,
    MenuModule,
    InputTextareaModule,
    AccordionModule
  ],
  exports: [
    seconds2TimePipe,
    LogViewComponent,
    first3EllpsisLast3Pipe,
    TickerComponent,
    PanelModule,
    CarouselModule,
    MessagesModule,
    MenuModule,
    ImportExportComponent,
    InputTextareaModule,
    AccordionModule,
    AboutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class UiModule {
}
