import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
 import {APIService } from '../../@core/service/api.service';
 import {APIData , Tag } from '../../@core/service/models/api.data.structure';
 import { LocalDataSource } from 'ng2-smart-table';
 import { Ng2SmartTableModule } from 'ng2-smart-table';
 import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

 @Component({
  selector: 'app-AdminPage',
  templateUrl: './Admin.component.html',
  styleUrls: ['./Admin.component.css']
})

export class AdminComponent implements OnInit {
  private tagswithColors:Tag[];
    private colors:string[];
  ngOnInit() {
   // we call refresh to load data on entery of the page
    this.refresh();
  }
    settings = {
      edit: {
        editButtonContent: '<i  class="fa fa-edit"></i>',
        saveButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-ban"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash"></i>',
      },
      add: {
        addButtonContent: '<i class="fa fa-plus"></i>',
        createButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-close"></i>',
      },
      pager:{
        display: true ,
        perPage: 5
      },

    actions:{
// Initializing the custom buttons for the ng2smarttable
      custom: [{
        name:'accept', 
        title: `<i class="fa fa-check-circle"></i>`
      } ,
       {name:'reject', 
       title: `<i class="fa fa-times-circle"></i>`
      },
      {name:'block',
       title: `<i class="fa fa-lock"></i>`
      },
      {name: 'unblock',
      title: `<i class="fa fa-unlock"></i>`
      }]
      
      },
    columns: {
// Initializing the columns with their name and type and whether they are selectable
// when adding or editing the columns or not.        
      name: {
        title: 'Name',
        type: 'string',
        
      },
      status: {
        title: 'Status',
        type:'string',
        editable: false,
        addable: false,
      },
      blocked: {
        title: 'Blocked',
        type: 'Boolean',
        editable: false,
        addable: false,
      }
    }
  };
  //source is the data from the ng2smarttable
  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;
  // this is a constructor for all the APIServices in the pages
  constructor(private _apiService: APIService) {
    //onAdded is called when some 1 adds a tag using the ng2smarttable 
    this.source.onAdded().subscribe((tag :Tag)=>{
      // we intilialize status to accepted and blocked to false as the admin is 
      // the one adding the tag so he doesn't need to write these himself 
      tag.status = 'Accepted';
      tag.blocked = false;
      //Then we send APIData to the method named AddTag through the api.service then we 
      //refresh after the database has been updated to get the new tag
      this._apiService.AddTag(tag).subscribe((apiresponse: APIData)=>{
        console.log(apiresponse.msg);
        console.log(tag);
        this.refresh();  
      });
      this.refresh();  
    });
    //This is called when the user removes a tag using ng2smarttable
    this.source.onRemoved().subscribe((tags :Tag)=>{
      //Then we send APIData to the method named deleteTags through the api.service then we 
      //refresh after the database has been updated to get the tags without the delete tag
      this._apiService.deleteTags(tags).subscribe((apiresponse: APIData)=>{
        this.refresh();
      });
    });
    //This is called when the user edits a tag using ng2smarttable      
    this.source.onUpdated().subscribe((tag :Tag)=>{
      //Then we send APIData to the method named editTag through the api.service then we 
      //refresh after the database has been updated to get the tags without the updated tag
      this._apiService.editTag(tag).subscribe((apiresponse: APIData)=>{
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      });
    });
}
// the refresh method loads all the data from the database and inserts it into the 
// ng2smarttable
refresh(): void {
  this.tagswithColors = new Array();
    this.colors= new Array();
// we call the method getTags through the api.service and then loop on all the 
// recived data and add it to the ng2smarttable
  this._apiService.getTags().subscribe((apiresponse: APIData)=>{
    for (var i = 0 ; i < apiresponse.data.length ; i++ ){
           this.tagswithColors.push(apiresponse.data[i]);
           this.colors.push(apiresponse.data[i].color);
          }
      //apiresponse.data[i].id = (i+1);
      console.log(apiresponse.data);
    this.source.load(apiresponse.data);
  });
}
// this initializes custom events for the buttons that we added in the ng2smarttable 
custom(event):void{
  if(event.action == 'accept'){
    this.OnAccept(event)
  }
  if(event.action == 'block'){
    this.OnBlock(event)
  }
  if(event.action == 'unblock'){
    this.OnUnblock(event)
  }
  if(event.action == 'reject'){
    this.OnReject(event)
  }
}
//this method is invoked when the user presses the custom made button Block
OnBlock(event): void {
  var tag = <Tag>{};
  tag = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to accepted otherwise we say the tag is already accepted and we don't change the data   
  if(tag.blocked != true){
    tag.blocked = true;
    this._apiService.editTag(tag).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already Blocked")
  }
}
OnUnblock(event): void {
  var tag = <Tag>{};
  tag = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to accepted otherwise we say the tag is already accepted and we don't change the data   
  if(tag.blocked != false){
    tag.blocked = false;
    this._apiService.editTag(tag).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already UnBlocked")
  }
}
  //this method is invoked when the user presses the custom made button Accept
  OnAccept(event): void {
    var tag = <Tag>{};
    tag = event.data
    // we check if the tag is not accepted if it is not we change it's status through edit tags
    //to accepted otherwise we say the tag is already accepted and we don't change the data   
    if(tag.status != 'Accepted'){
      tag.status = 'Accepted';
      this._apiService.editTag(tag).subscribe((apiresponse: APIData)=>{
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      });
    } else {
      console.log("This Tag is Already Accepted")
    }
  }
  //this method is invoked when the user presses the custom made button Reject
  OnReject(event): void {
    var tags = <Tag>{};
    tags = event.data;
    // we check if the tag is not accepted if it is not we change it's status through edit tags
    //to rejected otherwise we say the tag is already Rejected and we don't change the data   
    if(tags.status != 'Rejected'){
      tags.status = 'Rejected';
      this._apiService.editTag(tags).subscribe((apiresponse: APIData)=>{
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      });
    } else {
      console.log("This Tag is Already Rejected")
    }
  }
}

