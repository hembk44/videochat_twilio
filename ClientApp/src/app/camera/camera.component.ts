import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from "@angular/core";
import {
  createLocalTracks,
  LocalTrack,
  LocalVideoTrack,
  LocalAudioTrack,
} from "twilio-video";

@Component({
  selector: "app-camera",
  styleUrls: ["./camera.component.css"],
  templateUrl: "./camera.component.html",
})
export class CameraComponent implements AfterViewInit {
  // access the reference to native DOM of it's template (HTML) file
  @ViewChild("preview", { static: false }) previewElement: ElementRef;
  muteIcon: string = "mic";
  videoIcon: string = "videocam";
  isInitializing: boolean = true;
  videoToggle: boolean = true;
  private videoTrack: LocalVideoTrack;
  private audioTrack: LocalAudioTrack;
  private localTracks: LocalTrack[] = [];

  constructor(private readonly renderer: Renderer2) {}

  async ngAfterViewInit() {
    console.log(this.previewElement);
    if (this.previewElement && this.previewElement.nativeElement) {
      await this.initializeDevice();
    }
  }

  get tracks(): LocalTrack[] {
    return this.localTracks;
  }

  /** The MediaDevicesInfo interface contains information that describes
   * a single media input or output device. */
  initializePreview(deviceInfo?: MediaDeviceInfo) {
    if (deviceInfo) {
      this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
    } else {
      this.initializeDevice();
    }
  }

  // disable the camera of device
  finalizePreview() {
    try {
      if (this.videoTrack) {
        console.log(this.videoTrack);
        this.videoTrack.detach().forEach((element) => element.remove());
      }
    } catch (e) {
      console.error(e);
    }
  }

  // enable the camera of device and publishes audio and video media stream tracks
  private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {
    try {
      this.isInitializing = true;

      this.finalizePreview();

      this.localTracks = await this.createLocalTrack(kind, deviceId);
      console.log(this.localTracks);

      this.videoTrack = await this.getVideoTrack(this.localTracks);
      console.log(this.videoTrack.mediaStreamTrack.enabled);
      this.videoToggle = this.videoTrack.mediaStreamTrack.enabled;

      this.audioTrack = await this.getAudioTrack(this.localTracks);
      console.log(this.audioTrack.mediaStreamTrack.muted);

      const videoElement = this.videoTrack.attach();
      this.renderer.setStyle(videoElement, "height", "100%");
      this.renderer.setStyle(videoElement, "width", "100%");
      this.renderer.appendChild(
        this.previewElement.nativeElement,
        videoElement
      );
    } finally {
      this.isInitializing = false;
    }
  }

  // local tracks is an array of a MediaStream containing LocalAudioTrack and LocalVideoTrack for audio and video
  private async createLocalTrack(kind?: MediaDeviceKind, deviceId?: string) {
    const mediaStreamLocalTrack =
      kind && deviceId
        ? await this.initializeTracks(kind, deviceId)
        : await this.initializeTracks();
    return mediaStreamLocalTrack;
  }

  // get information about video tracks from an array of local tracks
  private async getVideoTrack(localTracks?: LocalTrack[]) {
    const mediaStreamVideoTrack = (await localTracks.find(
      (t) => t.kind === "video"
    )) as LocalVideoTrack;

    return mediaStreamVideoTrack;
  }

  // get information about audio tracks from an array of local tracks
  private async getAudioTrack(localTracks?: LocalTrack[]) {
    const mediaStreamVideoTrack = (await localTracks.find(
      (t) => t.kind === "audio"
    )) as LocalVideoTrack;

    return mediaStreamVideoTrack;
  }

  private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {
    if (kind) {
      switch (kind) {
        case "audioinput":
          return createLocalTracks({ audio: { deviceId }, video: true });
        case "videoinput":
          return createLocalTracks({ audio: true, video: { deviceId } });
      }
    }
    return createLocalTracks({ audio: true, video: true });
  }

  toggleMuteIcon() {
    if (this.muteIcon === "mic") {
      this.muteIcon = "mic_off";
      this.audioTrack.mediaStreamTrack.enabled = false;
      console.log(this.audioTrack.mediaStreamTrack.enabled);
    } else {
      this.muteIcon = "mic";
      this.audioTrack.mediaStreamTrack.enabled = true;
      console.log(this.audioTrack.mediaStreamTrack.enabled);
    }
  }

  toggleVideoIcon() {
    console.log(this.videoTrack.mediaStreamTrack.enabled);
    if (this.videoIcon === "videocam") {
      this.videoIcon = "videocam_off";
      this.videoTrack.mediaStreamTrack.enabled = false;
      console.log(this.videoTrack.mediaStreamTrack.enabled);
      // this.finalizePreview();
    } else {
      this.videoIcon = "videocam";
      this.videoTrack.mediaStreamTrack.enabled = true;
      console.log(this.videoTrack.mediaStreamTrack.enabled);

      // this.initializeDevice();
    }
  }
}
