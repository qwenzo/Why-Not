import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User ,FileData,Tags} from '../../@core/service/models/api.data.structure'
import {Buffer} from 'buffer';
import { ActivatedRoute } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
    selector: 'app-profile',
    templateUrl: './template/profile.component.html',
    styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private user =<User>{};
    private Tag =<Tags>{};
    usernameOfProfile: string;
    currusername: string;
    description:string;
    profileInfo=true;
    profilesettings=false;
    

    constructor(private apiServ:APIService,private route: ActivatedRoute) { };
    //this method changes the user's current status if it's online to offlne and vice versa
    //connects to th backend using changeUserStatus() method wchich is implemented in the service file
    changeUserStatus(){
      this.apiServ.changeUserStatus(this.user).subscribe((apiresponse:APIData)=>
      {
        var onlineStatusElem = document.getElementById("onlinestat");  
      var elem = document.querySelector('.toggle-btn');
      //var inputValue = (<HTMLInputElement>document.getElementById("cb-value")).checked;
      if(//inputValue && 
        !this.user.onlineStatus){  //if offline 
       // elem.classList.add('active');
        this.user.onlineStatus=true; //change the status to online
        onlineStatusElem.style.color="#2ecc71"; //change the color of the status circle to green
      }
      else{
        //elem.classList.remove('active');
        this.user.onlineStatus=false;  //change the status to offline
        onlineStatusElem.style.color="#e74c3c"; //change the color of the status circle to red
      }
      })
    }

    //this method loads the user's current status
    //connects to th backend using loadStatus() method wchich is implemented in the service file
    loadStatus(datain)
    {
      var onlineStatusElem = document.getElementById("onlinestat");  
     // var elem = document.querySelector('.toggle-btn');
      this.apiServ.loadStatus().subscribe((apiresponse:APIData)=>
      {
        if(datain)
      {
        onlineStatusElem.style.color="#2ecc71"; //change the color of the status circle to green if online
       // elem.classList.add('active');
      }
      else
      {
        onlineStatusElem.style.color="#e74c3c"; //change the color of the status circle to red if offline
        
       // elem.classList.remove('active');
      }
      })

    } 

    
   //this method gets called everytime the page is reloaded
    ngOnInit() {
     
       this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
        this.user.username = params['username'];
        this.apiServ.getUserProfile(this.user).subscribe((apires : APIData) =>{ //this method gets all the info of current profile 
          var specialities_ids=apires.data.speciality; //getting the speciality array of the user in terms of Object_id
          var specialities_names: String[]= new Array(); //array to hold the names of the specs
          var i;
          var specsElem = document.getElementById("specs"); //specs div
          specsElem.innerHTML="";  
          for( i=0;i<specialities_ids.length;i++ ){ //looping over every object_id and calling getTagbyId to get it's info
            this.Tag._id=specialities_ids[i]+"";  
            this.apiServ.getTagbyId(this.Tag).subscribe((apires : APIData) =>{
              specsElem.innerHTML += apires.data.name+" ";
            },(err) =>{
              console.log(err);
            });  
          }
          this.usernameOfProfile = apires.data.username;
          this.description=apires.data.description;
          this.getcurrusername();  
          this.getimageuser(apires.data.img); //this method gets/views the image of the user 
          this.showrating(apires.data.rating); //this method gets/views the ratings of the user 
          this.loadStatus(apires.data.onlineStatus); //this method gets/views the status of the user  
 })
     });

       
    }

   //this method takes the data(ratings) of the user from ngOnIt
    showrating(datain){
      var stars = document.querySelectorAll('[id^=star]');
      var textToWrite;
      var i;
      for(i in stars ){
        if (i<datain){
          stars[i].classList.add('checked');
        }
      }
     }
  
     //this method gets username of the loggedin user
     //connects to th backend using getusername() method wchich is implemented in the service file
    getcurrusername(){
      this.apiServ.getusername().subscribe((apires : APIData) =>{
               this.currusername = apires.data;             
      });      
  }
  //this method checks if the profile that's currently viewed is the same as the loggedin user
    isloggeduser(){
        if(this.usernameOfProfile!=this.currusername){
             return false;
        }
        else{
        return true;       
        }       
    }

   /*  editstatus(){
      var onlineStatusElem = document.getElementById("onlinestat");  
      if(!this.isloggeduser){
        onlinestat.removeEventListener("click", this.changeUserStatus);
      }
      else{
        onlinestat.addEventListener("click", this.changeUserStatus);
      }       
  
  } */

   //this method basically disables the settings page and views the profile page
     profileinfo(){
     
      this.profileInfo=true;
      this.profilesettings=false;
    }
    //this method basically disables the profile page and views the settings page
    public profilesettingsbtn(){
      this.profilesettings=true;
      this.profileInfo=false;
    
    }
    ProfileComponent=this;
    fileToUpload: File = null;
    editable: boolean = true; // intially just for testing

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy:FileData ={file:files.item(0)};
    this.apiServ.postFile(fy).subscribe(data => {
      // do something, if upload success
      this.getimage();
      }, error => {
        console.log(error);
      });
      
  }
  
  getimage(){
    this.apiServ.getimage().subscribe((apires : APIData) =>{
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
      var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(apires.data.buffer)] , {type: apires.data.contentType}))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
        navbarimg.src = reader.result;
      }, false);
      },(err) =>{
      console.log(err);
    });
  }

  getimageuser(datain){
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
     // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
       // navbarimg.src = reader.result;
      }, false);
      
  }

}
