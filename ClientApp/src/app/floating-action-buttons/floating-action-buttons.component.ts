import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-floating-action-buttons',
  templateUrl: './floating-action-buttons.component.html',
  styleUrls: ['./floating-action-buttons.component.css']
})
export class FloatingActionButtonsComponent implements OnInit {

  muteIcon: string = "mic";
  videoIcon: string = "videocam";

  constructor() { }

  ngOnInit() {
  }

  toggleMuteIcon() {
    if (this.muteIcon === 'mic') {
      this.muteIcon = 'mic_off';

    } else {
      this.muteIcon = 'mic'
    }
  }

  toggleVideoIcon() {
    if (this.videoIcon === 'videocam') {
      this.videoIcon = 'videocam_off';

    } else {
      this.videoIcon = 'videocam'
    }
  }
}
