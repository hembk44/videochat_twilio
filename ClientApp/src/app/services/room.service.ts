import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private roomName = new BehaviorSubject<string>("service");
  currentRoom = this.roomName.asObservable();

  constructor() {}

  sendRoomName(message: string) {
    this.roomName.next(message);
  }
}
