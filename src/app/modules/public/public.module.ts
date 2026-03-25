import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GuestRoutingModule } from './public-routing.module';
import { LogIn} from 'lucide-angular';

const icons = { LogIn };

@NgModule({
  declarations: [],
  imports: [
    LucideAngularModule.pick(icons),
    CommonModule,
    GuestRoutingModule
  ]
})
export class PublicModule { }
