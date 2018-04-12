import 'rxjs/add/operator/filter';
import { Subscription } from 'rxjs/Subscription';
import { NouisliderModule } from 'ng2-nouislider';
import { DOCUMENT } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from './template/template.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbdModalContent } from './components/modal/modal.component';
import { ComponentsComponent } from './components/components.component';
import { NgbdModalComponent } from './components/modal/modal.component';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TypographyComponent } from './components/typography/typography.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BasicelementsComponent } from './components/basicelements/basicelements.component';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule, Component, OnInit, Inject, Renderer, ElementRef, ViewChild} from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
/* Our Components
---------------------------------------------------*/
import { PagesRoutingModule } from './page.routing';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SessionComponent } from './session/session.component';
import { RequestModule } from './request/request.module';
import { RequestComponent } from './request/request.component';
import { ExpertComponent } from './expert/expert.component';
import { ExpertModule } from './expert/expert.module';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoViewComponent } from './videoView/videoView.component';
import { SessionVideoComponent } from './sessionVideoVoice/session.component';
import { RtcMediaCaptureModule } from '../@core/rtc-media-capture/rtc-media-capture.module'
import { RatingComponent } from './rating/rating.component';
import { DatePickerComponent } from './date-picker/date-picker.component';




@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    NouisliderModule,
    PagesRoutingModule,
    RtcMediaCaptureModule,
    AngularFontAwesomeModule,
    JWBootstrapSwitchModule,
    AmazingTimePickerModule
  ],
  declarations: [
    BasicelementsComponent,
    ComponentsComponent,
    NavigationComponent,
    TypographyComponent,
    NucleoiconsComponent,
    NotificationComponent,
    NgbdModalComponent,
    NgbdModalContent,
    TemplateComponent,
    SessionComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    SignupComponent,
    DashboardComponent,
    VideoViewComponent,
    SessionVideoComponent,
    RatingComponent,
    DatePickerComponent,
 ExpertComponent,
  ],
  entryComponents: [NgbdModalContent]
})
export class PageModule { 

}