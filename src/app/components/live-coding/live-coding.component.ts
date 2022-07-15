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
    this.initRoom();

    this.languages = [
      { name: "Dart", code: "dart" },
      { name: "Python", code: "python" },
      { name: "C", code: "ccpp" },
    ];

    this.themes = [
      { name: "Ambiance", code: "ambiance" },
      { name: "Chaos", code: "chaos" },
      { name: "Chrome", code: "chrome" },
      { name: "Clouds", code: "clouds" },
      { name: "Clouds Midnight", code: "clouds_midnight" },
      { name: "Crimson editor", code: "crimson_editor" },
      { name: "Dawn", code: "dawn" },
      { name: "Dracula", code: "dracula" },
      { name: "Dreamweaver", code: "dreamweaver" },
      { name: "Eclipse", code: "eclipse" },
      { name: "Github", code: "github" },
      { name: "Gob", code: "gob" },
      { name: "Gruvbox", code: "gruvbox" },
      { name: "Idle Fingers", code: "idle_fingers" },
      { name: "Iplastic", code: "iplastic" },
      { name: "Katzenmilch", code: "katzenmilch" },
      { name: "Kr Theme", code: "kr_theme" },
      { name: "Kuroir", code: "kuroir" },
      { name: "Merbivore", code: "merbivore" },
      { name: "Merbivore Soft", code: "merbivore_soft" },
      { name: "Mono Industrial", code: "mono_industrial" },
      { name: "Monokai", code: "monokai" },
      { name: "Nord Dark", code: "nord_dark" },
      { name: "One Dark", code: "one_dark" },
      { name: "Pastel On Dark", code: "pastel_on_dark" },
      { name: "solarized Dark", code: "solarized_dark" },
      { name: "solarized Light", code: "solarized_light" },
      { name: "Sqlserver", code: "sqlserver" },
      { name: "Terminal", code: "terminal" },
      { name: "Textmate", code: "textmate" },
      { name: "Tomorrow", code: "tomorrow" },
      { name: "Tomorrow Night", code: "tomorrow_night" },
      { name: "Tomorrow Night Blue", code: "tomorrow_night_blue" },
      { name: "Tomorrow Night Bright", code: "tomorrow_night_bright" },
      { name: "Tomorrow Night Eighties", code: "tomorrow_night_eighties" },
      { name: "Twilight", code: "twilight" },
      { name: "Vibrant Ink", code: "vibrant_ink" },
      { name: "Xcode", code: "xcode" },
    ];

    this.selectedLanguage = this.languages.find((language) => {
      return language.code === localStorage.getItem(this.MODE);
    });

    this.selectedTheme = this.themes.find((theme) => {
      return theme.code === localStorage.getItem(this.THEME);
    });
  }

  ngOnInit() {
    this.socket = new WebSocket(environment.websocket_url);
    this.socket.onopen = () => {
      console.log("Connected");
    };
    this.socket.onmessage = (event) => {
      console.log(event);
      const change = JSON.parse(event.data);
      const deltaHash = sha1(event.data);
      if (this.deltas.has(deltaHash)) {
        return;
      }
      this.deltas.set(deltaHash, change[0]);
      this.aceEditor.getSession().getDocument().applyDeltas(change);
    };
    this.socket.onclose = () => {
      console.log("Disconnected");
    };
    this.socket.onerror = (error) => {
      console.error(error);
    };
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
          return;
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
      console.log("compile", this.aceEditor.session.getValue());
      this.socket.send("/compile " + this.aceEditor.session.getValue());
  }

    getCodeOfComment() {
        if (this.aceEditor.getSelectedText().trim() === '') {
            return ''
        }
        let selectionRange = this.aceEditor.getSelectionRange();
        let rowStart = selectionRange.start.row;
        let columnStart = selectionRange.start.column;
        let rowEnd = selectionRange.end.row;
        let columnEnd = selectionRange.end.column;

        let numberOfLines = this.aceEditor.session.getLength();

        const ADDED_LINES_BEFORE = 2;
        const ADDED_LINES_AFTER = 3;

        let rangeStart = this.aceEditor.getSelectionRange();
        rangeStart.start.row = rowStart - ADDED_LINES_BEFORE > 0 ? rowStart - ADDED_LINES_BEFORE : 0;
        rangeStart.start.column = 0;
        rangeStart.end.row = rowStart;
        rangeStart.end.column = columnStart;

        let rangeEnd = this.aceEditor.getSelectionRange();
        rangeEnd.start.row = rowEnd;
        rangeEnd.start.column = columnEnd;
        rangeEnd.end.row = rowEnd + ADDED_LINES_AFTER < numberOfLines ? rowEnd + ADDED_LINES_AFTER : numberOfLines;
        /* on reste sur la column à 0 à la fin car on a pris 3 lignes en plus pour ne pas avoir
           à récupérer la dernière column de la ligne */
        rangeEnd.end.column = 0;

        return this.aceEditor.session.getTextRange(rangeStart) +
            "<b>" + this.aceEditor.getSelectedText() + "</b>" +
            this.aceEditor.session.getTextRange(rangeEnd);
    }
}
