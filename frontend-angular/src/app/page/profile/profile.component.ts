import { Buffer } from 'buffer';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../@core/service/api.service';
import { SharedService, SharedFunctions } from '../../@core/service/shared.service';
import { APIData, User, FileData, Tag } from '../../@core/service/models/api.data.structure'

@Component({
  selector: 'app-profile',
  templateUrl: './template/profile.component.html',
  styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  private user = <User>{};
  private BookmarkedUsers: User[];
  private Tag = <Tag>{};
  private CoverImgOfUser;
  public usernameOfProfile: string;
  public usernameOfProfileRole: string;
  public rating: number;
  private ratingwidth: number;
  public currusername: string;
  public description: string;
  public profileInfo = true;
  public profilesettings = false;
  public role: string;
  public fileToUpload: File = null;
  public editable: boolean = true; // intially just for testing


  constructor(private apiServ: APIService, private route: ActivatedRoute,
    private sharedService: SharedService, private spinner: NgxSpinnerService, private router: Router,
    private _sanitizer: DomSanitizer) { };

  changeUserStatus() {

    var onlineStatusElem = document.getElementById("onlinestat");
    //var elem = document.querySelector('.toggle-btn');
    if (//inputValue && 
      onlineStatusElem.style.color == "rgb(231, 76, 60)" &&
      !this.user.onlineStatus) {  //if offline 
      // elem.classList.add('active');
      this.user.onlineStatus = true; //change the status to online
      onlineStatusElem.style.color = "#2ecc71"; //change the color of the status circle to green
    } else {
      //elem.classList.remove('active');
      this.user.onlineStatus = false;  //change the status to offline
      onlineStatusElem.style.color = "#e74c3c"; //change the color of the status circle to red
    }
    //after that send the user with the new user status value
    //connects to th backend using changeUserStatus() method wchich is implemented in the service file
    this.apiServ.changeUserStatus(this.user).subscribe((apiresponse: APIData) => {

    })
  }

  addtobookmark() {
    this.apiServ.addtoToBookmark(this.user).subscribe((apires: APIData) => {
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apires.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg })
    })
  }

  //this method loads the user's current status
  //connects to th backend using loadStatus() method wchich is implemented in the service file
  loadStatus(datain) {
    var onlineStatusElem = document.getElementById("onlinestat");
    if (datain) {
      onlineStatusElem.style.color = "#2ecc71"; //change the color of the status circle to green if online
    } else {
      onlineStatusElem.style.color = "#e74c3c"; //change the color of the status circle to red if offline
    }
  }

  //this method gets called everytime the page is reloaded

  ngOnInit() {
    this.getcurrusername();
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
      this.spinner.show();
      this.user.username = params['username'];
      this.apiServ.getUserProfile(this.user).subscribe((apires: APIData) => { //this method gets all the info of current profile 
        var specialities = <Tag[]>apires.data.speciality; //getting the speciality array of the user
        this.usernameOfProfile = apires.data.username; //getting the username of showed profile
        this.BookmarkedUsers = new Array();
        var i, j, l = 0, Tags_names_length;
        var specsElem = document.getElementById("specs"); //specs div
        // specsElem.innerHTML="";  
        var Tagsdiv = document.getElementById("tagsdiv");
        while (Tagsdiv.firstChild) {
          Tagsdiv.removeChild(Tagsdiv.firstChild);
        }
        this.user._id = apires.data._id;
        for (i = 0; i < specialities.length / 4; i++) {
          var TagsContainer = document.createElement("div");
          TagsContainer.setAttribute("id", "TagsSmallContainer" + i);
          for (j = 0; j < 4 && l < specialities.length; j++) {
            var Tag = document.createElement("button");
            var DeleteTag = document.createElement("i");
            DeleteTag.classList.add('fa');
            DeleteTag.classList.add('fa-close');
            DeleteTag.style.display = "none";

            let tag: Tag = specialities[l];
            if (this.isloggeduser()) {
              Tag.appendChild(DeleteTag);
              DeleteTag.addEventListener("mouseover", function () {
                var ParentTag = event.target as HTMLElement;
                var x = ParentTag.firstChild as HTMLElement;
                if (ParentTag != null) {
                  ParentTag.style.display = "inline-block";
                  // x.style.zIndex="block";
                }
              });

              DeleteTag.addEventListener("mouseout", function () {
                var ParentTag = event.target as HTMLElement;
                var x = ParentTag.firstChild as HTMLElement;
                if (ParentTag != null) {
                  ParentTag.style.display = "none";
                }
              });

              DeleteTag.addEventListener("click", () => {
                var iElementX = event.target as HTMLElement;
                var parentBtn = iElementX.parentNode as HTMLElement
                this.editSpecs(tag, parentBtn)
              });

              var ParentTag = event.target as HTMLElement;
              var x = ParentTag.firstChild as HTMLElement;

              Tag.addEventListener("mouseover", function () {
                var ParentTag = event.target as HTMLElement;
                var x = ParentTag.firstChild as HTMLElement;
                if (x != null) {
                  x.style.display = "inline-block";
                }
              });

              Tag.addEventListener("mouseout", function () {
                var ParentTag = event.target as HTMLElement;
                var x = ParentTag.firstChild as HTMLElement;
                if (x != null) {
                  x.style.display = "none";
                }
              });
            }
            var divider = document.createElement("div");
            divider.classList.add("divider");
            var t = document.createTextNode(specialities[l].name + "");
            Tag.classList.add("btn");
            Tag.classList.add("btn-round");
            Tag.style.backgroundColor = specialities[l].color.name.toString();
            Tag.style.borderColor = specialities[l].color.name.toString();
            Tag.classList.add("btn-sm");
            Tag.appendChild(t);
            TagsContainer.appendChild(Tag);
            TagsContainer.appendChild(document.createTextNode(' '));                                         // Append the text to <p>
            l++
          }
          document.getElementById("tagsdiv").appendChild(TagsContainer);
          document.getElementById("tagsdiv").appendChild(document.createTextNode(' '));           // Append <p> to <div> with id="myDIV"
        }
        this.usernameOfProfileRole = apires.data.role;//getting the role of the showed profile
        this.description = apires.data.description; //getting the desc. of showed profile
        SharedFunctions.loadImageBy('profileimg', apires.data.img, false);
        SharedFunctions.loadImageBy('coverImg', apires.data.CoverImg, true);
        this.BookmarkedUsers = new Array();
        for (let bookmark of apires.data.bookmarks) {
          SharedFunctions.getImageUrl(bookmark.img).then((result) => {
            bookmark.img = this._sanitizer.bypassSecurityTrustResourceUrl(result.toString())
            this.BookmarkedUsers.push(bookmark);
          })
        }
        this.showrating(apires.data.rating);
        this.CoverImgOfUser = apires.data.CoverImg;
        this.role = apires.data.role;
        if (this.role == 'user') {
          this.role = '';
        }
        this.editstatus();
        this.loadStatus(apires.data.onlineStatus); //this method gets/views the status of the user
        this.spinner.hide();
      }, (err) => {
        this.router.navigate(['/page/err']);
        this.sharedService.triggerErrMessage.next(err.msg);
        this.spinner.hide();
      })
    });
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  removeBookmarked(user: any) {
    this.apiServ.removeFromBookmark(<User>{ _id: user._id }).subscribe((apires: APIData) => {
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apires.msg.toString() });
      this.BookmarkedUsers.splice(this.BookmarkedUsers.indexOf(user), 1);
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg })
    })
  }


  editSpecs(tag, button) {
    this.apiServ.editSpeciality(tag).subscribe((apiresponse: APIData) => {
      if (apiresponse.msg == "Speciality removed") {
        button.remove();
        this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
      }
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg })
    });
  }


  //this method takes the data(ratings) of the user from ngOnIt
  showrating(datain) {
    this.rating = datain;
    var widthofStars = document.getElementById("widthofStars") as HTMLElement
    widthofStars.style.width = 'calc(100% * (' + this.rating + '/ 5))';
  }

  getcurrusername() {
    this.currusername = this.apiServ.getToken(true).username;
  }
  //this method checks if the profile that's currently viewed is the same as the loggedin user
  isloggeduser() {

    if (this.usernameOfProfile != this.currusername) {
      return false;
    }
    else {
      return true;
    }
  }
  //this method checks if the profile that's currently viewed is an expert
  isUserExpert() {
    if (this.usernameOfProfileRole == 'expert') {
      return true;
    }
    return false;
  }

  isExpert() {
    if (this.role == 'expert') {
      return true;
    }
    else {
      return false;
    }
  }

  editstatus() {
    var onlineStatusElem = document.getElementById("onlinestat");
    if (!this.isloggeduser()) {
      onlineStatusElem.setAttribute('style', 'pointer-events:none');
    }
    else {
      onlineStatusElem.setAttribute('style', 'pointer-events:block');
    }
  }
  //this method basically disables the profile page and views the settings page

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    let fy: FileData = { file: files.item(0) };
    this.apiServ.postFile(fy).subscribe(data => {
      this.getimage();
    }, error => {

    });

  }

  handleFileInputCoverImg(files: FileList) {
    this.fileToUpload = files.item(0);
    let fy: FileData = { file: files.item(0) };
    this.apiServ.postCoverImg(fy).subscribe(data => {
      this.apiServ.getUserProfile(this.user).subscribe((apires: APIData) => {
        SharedFunctions.loadImageBy('coverImg', apires.data.CoverImg, true);
      });
    }, error => {

    });
  }

  getimage() {
    this.apiServ.getimage().subscribe((apires: APIData) => {
      SharedFunctions.loadImageBy('profileimg', apires.data, false);
      SharedFunctions.loadImageBy('profileimgnavbar', apires.data, false);
    }, (err) => {
    });
  }

  //this method is responsible for altering the view of the settings/profile
  public profilesettingsbtn() {
    this.profileInfo = false;
    this.profilesettings = true;
  }
  //this method is responsible for altering the view of the settings/profile
  settingsComponentClose($event) {
    this.profileInfo = true;
    this.profilesettings = false;
    this.ngOnInit();
  }
  goToSchedule() {
    this.router.navigate(['page/schedule', this.user._id]);
  }
}