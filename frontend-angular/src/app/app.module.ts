import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { IOService } from './@core/service/io.service';
import { APIService } from './@core/service/api.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './@core/service/auth.intercepter';
import { HTTP_INTERCEPTORS , HttpClientModule , HttpClient } from '@angular/common/http';
import { NavbarComponent } from './page/shared/navbar/navbar.component';
import { FooterComponent } from './page/shared/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRatingComponent } from './page/components/admin-rating/admin-rating.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material';
import { PopOutComponent } from './page/components/pop-out/pop-out.component';
import { NavBarService } from './@core/service/shared.service';
import { RoleGuardService } from './@core/service/role-guard.service';
import { JwtHelper } from 'angular2-jwt';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PopOutComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    MatDialogModule,
  ],

  entryComponents: [
    PopOutComponent
  ],
  
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
     , APIService , IOService , NavBarService , JwtHelper , RoleGuardService
     ,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
