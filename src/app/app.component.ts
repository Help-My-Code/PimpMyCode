import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Pimp My Code";
  ngOnInit() {
    const socket = new WebSocket("ws://localhost:8080/ws/room_id");
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onmessage = (event) => {
      console.log(event.data);
    };
    socket.onclose = () => {
      console.log("Disconnected");
    };
    socket.onerror = (error) => {
      console.error(error);
    };
  }
}
