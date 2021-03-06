// The ts file that contains all the linking functions for the video/text chat
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Component, OnInit, Renderer2, ElementRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

import { ActivatedRoute, Router } from '@angular/router';
import { IOService } from '../../@core/service/io.service';
import { APIService } from '../../@core/service/api.service';
import { SharedFunctions, SharedService } from '../../@core/service/shared.service';
import { APIData, User, Token } from '../../@core/service/models/api.data.structure';


@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy {
  public message;
  public senderImgSrc;
  public senderUsername;
  public recieverUsername;
  public messages = [];
  public failureMessage;
  public joinFlag = false;
  public showOptions = false;
  public joinButtonflag = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public startCapture = true;
  public mediaSource_local = null;
  public mediaSource_remote_list: any = [null];
  public constrains = { video: false, audio: false };
  private peer_config = <RTCConfiguration>{
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }
      , { urls: 'stun:stun.services.mozilla.com' }]
  };
  private sessionid: String;
  public connectedUsers: String[] = [];
  private connectedUsersData: any[] = [];
  private peerConnections: RTCPeerConnection[] = [];


  ngOnInit() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    // this.closeCall();
    this.ioService.closeConnection();
  }

  //forces the scroll area to focus on the last element
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //checks the screen size of the device that views the site
  screenSize() {
    if (screen.width <= 699) {
      return false;
    } else {
      return true;
    }
  }

  //forces the scroll area to focus on the last element
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  //starts the socket between the two users
  chatType(type: String) {
    switch (type) {
      case "Video":
        this.constrains = { video: true, audio: true };
        break;
      case "Voice":
        this.constrains = { video: false, audio: true };
    }
    this.joinFlag = true;
  }

  //switch cases for all of the chating protocols that are followed to make a connection between users
  constructor(private apiService: APIService, private ioService: IOService, private route: ActivatedRoute,
    private _sanitizer: DomSanitizer, private sharedService: SharedService, public router: Router) {
    let userToken = <Token>this.apiService.getToken(true);
    this.recieverUsername = userToken.username;
    this.route.params.subscribe(
      params => {
        this.showOptions = false;
        this.sessionid = params.sessionid;
        this.ioService.getMessages().subscribe((test: any) => {
          var js = JSON.parse(test);
          console.log(js);
          switch (js.type) {
            case "Join":
              if (!this.connectedUsers.includes(js.userid)) {
                this.connectedUsers.push(js.userid);
                this.peerConnections.push(new RTCPeerConnection(this.peer_config))
                this.apiService.getUsersbyIds([js.userid]).subscribe((apiresponse: APIData) => {
                  for (let user of apiresponse.data) {
                    SharedFunctions.getImageUrl(user.img).then((result) => {
                      this.connectedUsersData.push(
                        {
                          _id: user._id,
                          username: user.username,
                          role: user.role,
                          img: this._sanitizer.bypassSecurityTrustResourceUrl(result.toString())
                        }
                      )
                      this.senderUsername = user.username;
                      this.messages.push(
                        {
                          type: "recieved",
                          message: "Joined Session",
                          img: this._sanitizer.bypassSecurityTrustResourceUrl(result.toString())
                        }
                      );
                    });
                  }
                })
              }
              break;
            case "connected":
              this.apiService.getUsersbyIds([this.apiService.getToken(true)._id]).subscribe((apiresponse: APIData) => {
                for (let user of apiresponse.data) {
                  SharedFunctions.getImageUrl(user.img).then((result) => {
                    this.senderImgSrc = this._sanitizer.bypassSecurityTrustResourceUrl(result.toString());
                  });
                }
              });
              this.ioService.sendMessage(
                JSON.stringify({
                  type: "Join",
                  room: this.sessionid
                })
              )
              break;

            case "AcceptedInRoom":
              this.showOptions = true;
              break;

            case "connectedUsers":
              this.connectedUsers = js.data;
              this.apiService.getUsersbyIds(js.data).subscribe((apiresponse: APIData) => {
                for (let user of apiresponse.data) {
                  SharedFunctions.getImageUrl(user.img).then((result) => {
                    this.connectedUsersData.push(
                      {
                        _id: user._id,
                        username: user.username,
                        role: user.role,
                        img: this._sanitizer.bypassSecurityTrustResourceUrl(result.toString())
                      }
                    )
                    this.senderUsername = user.username;
                    this.messages.push(
                      {
                        type: "recieved",
                        message: "Joined Session",
                        img: this._sanitizer.bypassSecurityTrustResourceUrl(result.toString())
                      }
                    );
                    this.peerConnections.push(new RTCPeerConnection(this.peer_config))
                  })
                }
              });
              break;

            case "offer":
              let rtcPeer: RTCPeerConnection = this.peerConnections[this.connectedUsers.indexOf(js.from)];
              rtcPeer.setRemoteDescription(js.offer).then(
                () => {
                  this.preparePeerConnection(rtcPeer, js.from);
                  rtcPeer.createAnswer().then(
                    (desc) => {
                      rtcPeer.setLocalDescription(desc).then(
                        () => {
                          this.ioService.sendMessage(JSON.stringify(
                            {
                              room: this.sessionid,
                              type: "answer",
                              answer: desc,
                              to: js.from
                            })
                          );
                          this.joinButtonflag = true;
                        }
                      );
                    }
                  );
                  this.mediaSource_remote_list[0] = rtcPeer.getRemoteStreams()[0];
                }
              );
              break;

            case "answer":
              if (this.checkIsUserConnected(js.from)) {
                this.peerConnections[this.connectedUsers.indexOf(js.from)].setRemoteDescription(js.answer).then()
              }
              break;

            case "candidate":
              if (this.checkIsUserConnected(js.from)) {
                this.peerConnections[this.connectedUsers.indexOf(js.from)].addIceCandidate(js.candidate).then();
              }
              break;

            case "close":
              if (this.checkIsUserConnected(js.from)) {
                let user = this.connectedUsersData[this.connectedUsers.indexOf(js.from)];
                this.senderUsername = user.username;
                this.messages.push(
                  {
                    type: "recieved",
                    message: "Left Session",
                    img: user.img
                  }
                );
                this.peerConnections[this.connectedUsers.indexOf(js.from)].close()
                this.peerConnections.splice(this.peerConnections.indexOf(js.from), 1)
                this.connectedUsersData.splice(this.connectedUsers.indexOf(js.from), 1);
                this.connectedUsers.splice(this.connectedUsers.indexOf(js.from), 1)
              }
              break;

            case "disconnected":
              if (this.checkIsUserConnected(js.userid)) {
                let user = this.connectedUsersData[this.connectedUsers.indexOf(js.userid)];
                this.senderUsername = user.username;
                this.messages.push(
                  {
                    type: "recieved",
                    message: "Left Session",
                    img: user.img
                  }
                );
                this.connectedUsersData.splice(this.connectedUsers.indexOf(js.userid), 1);
                this.connectedUsers.splice(this.connectedUsers.indexOf(js.userid), 1)
              }
              break;

            case "message":
              this.senderUsername = this.connectedUsersData[this.connectedUsers.indexOf(js.userid)].username;
              this.messages.push(
                {
                  type: "recieved",
                  message: js.message,
                  img: this.connectedUsersData[this.connectedUsers.indexOf(js.userid)].img
                }
              );
              break;
            case "Failure":
              this.failureMessage = js.message;
              ioService.closeConnection();
              break;
          }
        });
      }
    );
  }

  //makes sure that the user is still connected to the session
  checkIsUserConnected(user: String) {
    return this.connectedUsers.includes(user);
  }

  preparePeerConnection(peerConnection: RTCPeerConnection, userid: String) {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.ioService.sendMessage(
          JSON.stringify(
            {
              room: this.sessionid,
              type: "candidate",
              candidate: event.candidate,
              to: userid
            }
          )
        )
      }
    }
    peerConnection.onaddstream = this.getRemoteStream;
    peerConnection.addStream(this.mediaSource_local);
  }

  //the function that connects the video between the two users
  public joinClick() {
    this.joinButtonflag = true;
    for (var i = 0; i < this.connectedUsers.length; i++) {
      let userid: String = this.connectedUsers[i];
      let rtcPeer: RTCPeerConnection = this.peerConnections[i];
      this.preparePeerConnection(this.peerConnections[i], userid);
      rtcPeer.createOffer().then(
        (desc) => {
          rtcPeer.setLocalDescription(desc).then();
          this.ioService.sendMessage(JSON.stringify(
            {
              room: this.sessionid,
              type: "offer",
              offer: desc,
              to: userid
            })
          );
        }
      )
    }
  }

  //the function that ends the video call between the two users
  public closeCall() {
    this.startCapture = false;
    for (var i = 0; i < this.connectedUsers.length; i++) {
      // this.peerConnections[i].close();
      this.ioService.sendMessage(JSON.stringify(
        {
          room: this.sessionid,
          type: "close",
          userid: this.connectedUsers[i]
        })
      )
    }
  }

  //gets the stream from the other user that is connected to the same session
  private getRemoteStream = (e) => {
    this.mediaSource_remote_list[0] = e.stream;
  }

  //stores the stream data
  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }

  //sends a message through the chat between the users 
  onEnter(value: string) {
    this.ioService.sendMessage(
      JSON.stringify(
        {
          type: "message",
          room: this.sessionid,
          message: value
        }
      )
    );
    this.message = null;
    this.messages.push({ type: "sender", message: value });
  }
}