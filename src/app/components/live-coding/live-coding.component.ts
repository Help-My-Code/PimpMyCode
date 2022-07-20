import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as ace from "ace-builds";
import { Ace } from "ace-builds";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ExecuteProgramService } from "../../services/execute-program.service";
import { DialogService } from "primeng/dynamicdialog";
import jwt_decode from "jwt-decode";
import { RoomService } from "../../services/room.service";
import { Room } from "../../models/room";
import sha1 from "js-sha1";
import { environment } from "src/environments/environment";
import { themes } from "../../ace/theme";
import { languages } from "../../ace/languages";
import {
  CodeUpdateOutput,
  CompilationEvent,
} from "../../models/collaboration.model";

interface DropDownElement {
  name: string;
  code: string;
}

@Component({
  selector: "app-live-coding",
  templateUrl: "./live-coding.component.html",
  styleUrls: ["./live-coding.component.css"],
})
export class LiveCodingComponent implements OnInit, AfterViewInit {
  private readonly MODE = "MODE";
  private readonly THEME = "THEME";
  private socket: WebSocket;
  private deltas: Map<string, Ace.Delta>;

  readonly languages: DropDownElement[];
  readonly themes: DropDownElement[];

  selectedLanguage: DropDownElement;
  selectedTheme: DropDownElement;

  aceEditor: Ace.Editor;

  message = "";
  loading = "";

  codeResult = "";

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  token = null;
  contentId = null;
  userId = null;
  room: Room;

  constructor(
    private executeProgramService: ExecuteProgramService,
    public dialogService: DialogService,
    private roomService: RoomService
  ) {
    this.themes = themes;
    this.languages = languages;
    this.deltas = new Map();
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get("token");
    try {
      const decoded = jwt_decode(this.token);
      this.userId = decoded["userId"];
    } catch (e) {
      console.log("Token invalide " + e);
    }

    this.contentId = urlParams.get("content");
    
    // this.initRoom();

    this.selectedLanguage = this.languages.find((language) => {
      return language.code === localStorage.getItem(this.MODE);
    });

    this.selectedTheme = this.themes.find((theme) => {
      return theme.code === localStorage.getItem(this.THEME);
    });
  }

  ngOnInit() {
    this.socket = new WebSocket(environment.websocket_url + `user/${this.userId}/room/${this.contentId}`);
    this.socket.onopen = () => {
      console.log("Connected");
    };
    this.socket.onmessage = (data) => {
      const anyEvent = JSON.parse(data.data);
      if ("ChatMessage" in anyEvent) {
        // TODO
      } else if ("CodeUpdate" in anyEvent) {
        this.handleCodeUpdate(anyEvent["CodeUpdate"]);
      } else if ("CompilationEvent" in anyEvent) {
        this.handleCompilationEvent(anyEvent["CompilationEvent"]);
      } else if ("Init" in anyEvent) {
        this.handleInit(anyEvent["Init"]);
      } else {
        console.error("unhandled event", anyEvent);
      }
    };
    this.socket.onclose = () => {
      console.log("Disconnected");
    };
    this.socket.onerror = (error) => {
      console.error(error);
    };
  }

  handleInit(init: { [x: string]: CodeUpdateOutput; }) {
    // TODO message
    console.log(init);
    this.handleCodeUpdate(init["code_updates"])
  }
  

  handleCompilationEvent(change: CompilationEvent) {
    // todo make a switch and refacto the running button
    console.log(change);
    this.codeResult = change.stdout;
  }

  handleCodeUpdate(change: CodeUpdateOutput) {
    for (const update of change.content) {
        const changeAsString = JSON.stringify(update); 
        const hash = sha1(changeAsString);
        if (this.deltas.has(hash)) {
            continue;
        }
        this.deltas.set(hash, update);

        this.aceEditor.getSession().getDocument().applyDelta(update as unknown as Ace.Delta);
    }
  }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
    );
    this.aceEditor = ace.edit(this.editor.nativeElement);
    if (localStorage.getItem(this.THEME)) {
      this.aceEditor.setTheme("ace/theme/" + localStorage.getItem(this.THEME));
    } else {
      this.aceEditor.setTheme("ace/theme/" + this.selectedTheme.code);
    }
    if (localStorage.getItem(this.MODE)) {
      this.aceEditor.session.setMode(
        "ace/mode/" + localStorage.getItem(this.MODE)
      );
    } else {
      this.aceEditor.session.setMode("ace/mode/" + this.selectedLanguage.code);
    }
    this.aceEditor.on("change", (delta: any) => {
      delete delta.id;
      delta["timestamp"] = Math.floor(Date.now() / 1000).toString();
        // todo add user inside code update struct
      const deltaAsString = JSON.stringify([delta]);
      const deltaHash = sha1(deltaAsString);
      this.deltas.set(deltaHash, delta);
      this.socket.send("/code_updates " + deltaAsString);
    });
  }

  setAceMode() {
    localStorage.setItem(this.MODE, this.selectedLanguage.code);
    this.aceEditor.session.setMode("ace/mode/" + this.selectedLanguage.code);
  }

  setAceTheme() {
    localStorage.setItem(this.THEME, this.selectedTheme.code);
    this.aceEditor.setTheme("ace/theme/" + this.selectedTheme.code);
  }

  private initRoom() {
    const urlParams = new URLSearchParams(window.location.search);
    this.contentId = urlParams.get("content");
    this.roomService
      .getByContentId(this.contentId)
      .pipe(
        catchError((err) => {
          if (err.status) {
            this.loading = "";
            this.message = err.statusText;
          }
          return throwError(err);
        })
      )
      .subscribe((result) => {
        this.loading = "";
        const returnedData: any = result;
        const jsondata = JSON.parse(returnedData._body);
        if (!returnedData.ok) {
          this.message = returnedData.statusText;
        } else if (jsondata.room) {
          this.room = jsondata.room;
          this.initCode();
        } else {
          this.message = "An error has occurred";
        }
      });
  }

  private initCode() {
    this.aceEditor.session.setValue(this.room.program.stdin);
  }

  runCode() {
    const code = this.aceEditor.session.getValue().toString();
    this.socket.send(`/compile ${this.selectedLanguage.code.toUpperCase()} ${code}`);
  }
}
