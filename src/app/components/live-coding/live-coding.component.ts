import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild,} from "@angular/core";
import * as ace from "ace-builds";
import {Ace} from "ace-builds";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ExecuteProgramService} from "../../services/execute-program.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import jwt_decode from 'jwt-decode';
import {RoomService} from "../../services/room.service";
import {MessageService} from "primeng/api";

interface DropDownElement {
    name: string;
    code: string;
}

@Component({
    selector: "app-live-coding",
    templateUrl: "./live-coding.component.html",
    styleUrls: ["./live-coding.component.css"],
})
export class LiveCodingComponent implements AfterViewInit, OnDestroy {
    private readonly MODE = "MODE";
    private readonly THEME = "THEME";
    private socket: WebSocket;

    readonly languages: DropDownElement[];
    readonly themes: DropDownElement[];

    selectedLanguage: DropDownElement;
    selectedTheme: DropDownElement;

    aceEditor: Ace.Editor;

    message = "";
    loading = "";

    codeResult = "";

    ref: DynamicDialogRef;

    @ViewChild("editor") private editor: ElementRef<HTMLElement>;

    token = null;
    contentId = null;
    userId = null;
    roomId: any;

    constructor(private executeProgramService: ExecuteProgramService,
                public dialogService: DialogService,
                private roomService: RoomService) {

        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token');
        try {
            const decoded = jwt_decode(this.token);
            this.userId = decoded['userId'];
        } catch (e) {
            console.log("Token invalide " + e);
        }

        this.contentId = urlParams.get('content');
        this.initRoomId();

        this.languages = [
            {name: 'Dart', code: 'dart'},
            {name: 'Python', code: 'python'},
            {name: 'C', code: 'ccpp'}
        ];

        this.themes = [
            {name: 'Ambiance', code: 'ambiance'},
            {name: 'Chaos', code: 'chaos'},
            {name: 'Chrome', code: 'chrome'},
            {name: 'Clouds', code: 'clouds'},
            {name: 'Clouds Midnight', code: 'clouds_midnight'},
            {name: 'Crimson editor', code: 'crimson_editor'},
            {name: 'Dawn', code: 'dawn'},
            {name: 'Dracula', code: 'dracula'},
            {name: 'Dreamweaver', code: 'dreamweaver'},
            {name: 'Eclipse', code: 'eclipse'},
            {name: 'Github', code: 'github'},
            {name: 'Gob', code: 'gob'},
            {name: 'Gruvbox', code: 'gruvbox'},
            {name: 'Idle Fingers', code: 'idle_fingers'},
            {name: 'Iplastic', code: 'iplastic'},
            {name: 'Katzenmilch', code: 'katzenmilch'},
            {name: 'Kr Theme', code: 'kr_theme'},
            {name: 'Kuroir', code: 'kuroir'},
            {name: 'Merbivore', code: 'merbivore'},
            {name: 'Merbivore Soft', code: 'merbivore_soft'},
            {name: 'Mono Industrial', code: 'mono_industrial'},
            {name: 'Monokai', code: 'monokai'},
            {name: 'Nord Dark', code: 'nord_dark'},
            {name: 'One Dark', code: 'one_dark'},
            {name: 'Pastel On Dark', code: 'pastel_on_dark'},
            {name: 'solarized Dark', code: 'solarized_dark'},
            {name: 'solarized Light', code: 'solarized_light'},
            {name: 'Sqlserver', code: 'sqlserver'},
            {name: 'Terminal', code: 'terminal'},
            {name: 'Textmate', code: 'textmate'},
            {name: 'Tomorrow', code: 'tomorrow'},
            {name: 'Tomorrow Night', code: 'tomorrow_night'},
            {name: 'Tomorrow Night Blue', code: 'tomorrow_night_blue'},
            {name: 'Tomorrow Night Bright', code: 'tomorrow_night_bright'},
            {name: 'Tomorrow Night Eighties', code: 'tomorrow_night_eighties'},
            {name: 'Twilight', code: 'twilight'},
            {name: 'Vibrant Ink', code: 'vibrant_ink'},
            {name: 'Xcode', code: 'xcode'},
        ];

        this.selectedLanguage = this.languages.find(language => {
            return language.code === localStorage.getItem(this.MODE);
        });

        this.selectedTheme = this.themes.find(theme => {
            return theme.code === localStorage.getItem(this.THEME);
        });
    }

    ngOnInit() {
        this.socket = new WebSocket("ws://localhost:8080/ws/room_id");
        this.socket.onopen = () => {
            console.log("Connected");
        };
        this.socket.onmessage = (event) => {
            console.log(event.data);
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
        this.aceEditor.session.setValue(
            "void main() {\n" +
            "    print('Hello world !');\n" +
            "    for(int i = 0 ; i < 10 ; i += 1) {\n" +
            "      print(i);\n" +
            "    }\n" +
            "}"
        );
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
        this.aceEditor.on("change", () => {
            console.log(this.aceEditor.getValue());
            this.socket.send("/code_update " + this.aceEditor.getValue());
        });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    setAceMode() {
        localStorage.setItem(this.MODE, this.selectedLanguage.code);
        this.aceEditor.session.setMode("ace/mode/" + this.selectedLanguage.code);
    }

    setAceTheme() {
        localStorage.setItem(this.THEME, this.selectedTheme.code);
        this.aceEditor.setTheme("ace/theme/" + this.selectedTheme.code);
    }

    private initRoomId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.contentId = urlParams.get('content');
        this.roomService.getByContentId(this.contentId)
            .pipe(catchError(err => {
                if (err.status) {
                    this.loading = "";
                    this.message = err.statusText;
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                this.loading = "";
                const returnedData: any = result;
                const jsondata = JSON.parse(returnedData._body);
                if (!returnedData.ok) {
                    this.message = returnedData.statusText;
                    return;
                } else if (jsondata.room) {
                    this.roomId = jsondata.room.id;
                } else {
                    this.message = "An error has occurred";
                }
            });
    }

    runCode() {
        this.codeResult = "";
        this.message = "";
        this.loading = "Code en cours d'exécution...";
        this.executeProgramService.execute(this.selectedLanguage.code.toUpperCase(), this.aceEditor.getValue())
            .pipe(catchError(err => {
                if (err.status) {
                    this.loading = "";
                    this.message = err.statusText;
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                this.loading = "";
                const returnedData: any = result;
                const jsondata = JSON.parse(returnedData._body);
                if (!returnedData.ok) {
                    this.message = returnedData.statusText;
                    return;
                } else if (jsondata.stdout) {
                    this.codeResult = jsondata.stdout;
                } else {
                    this.message = "An error has occurred";
                }
            });
    }
}
