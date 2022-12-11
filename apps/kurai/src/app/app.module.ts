import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TimePickerComponent } from '@kurai/time-picker';

import { AppComponent } from './app.component';
import { KeyboardComponent } from './keyboard/keyboard.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TimePickerComponent, KeyboardComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
