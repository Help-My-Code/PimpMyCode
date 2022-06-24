import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as ace from "ace-builds";
import {Ace} from "ace-builds";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ExecuteProgramService} from "../../services/execute-program.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {CommentListComponent} from "../comment-list/comment-list.component";
import jwt_decode from 'jwt-decode';

interface DropDownElement {
    name: string,
    code: string
}

@Component({
    selector: 'app-live-coding',
    templateUrl: './live-coding.component.html',
    styleUrls: ['./live-coding.component.css']
})

export class LiveCodingComponent implements AfterViewInit, OnDestroy {

    private readonly MODE = 'MODE';
    private readonly THEME = 'THEME';

    readonly languages: DropDownElement[];
    readonly themes: DropDownElement[];

    selectedLanguage: DropDownElement;
    selectedTheme: DropDownElement;

    private aceEditor: Ace.Editor;

    message = "";
    loading = "";

    codeResult = "";

    contentId = null;
    token = null;
    userId = null;

    ref: DynamicDialogRef;

    constructor(private executeProgramService: ExecuteProgramService,
                public dialogService: DialogService,
                private messageService: MessageService) {

        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token');
        try {
            const decoded = jwt_decode(this.token);
            this.userId = decoded['userId'];
        } catch (e) {
            console.log(e);
        }

        this.contentId = urlParams.get('content');

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

    @ViewChild("editor") private editor: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        ace.config.set("fontSize", "14px");
        ace.config.set(
            "basePath",
            "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
        );
        this.aceEditor = ace.edit(this.editor.nativeElement)
        this.aceEditor.session.setValue("void main() {\n" +
            "    print('Hello world !');\n" +
            "    for(int i = 0 ; i < 10 ; i += 1) {\n" +
            "      print(i);\n" +
            "    }\n" +
            "}");
        if (localStorage.getItem(this.THEME)) {
            this.aceEditor.setTheme("ace/theme/" + localStorage.getItem(this.THEME));
        } else {
            this.aceEditor.setTheme("ace/theme/" + this.selectedTheme.code);
        }
        if (localStorage.getItem(this.MODE)) {
            this.aceEditor.session.setMode("ace/mode/" + localStorage.getItem(this.MODE));
        } else {
            this.aceEditor.session.setMode("ace/mode/" + this.selectedLanguage.code);
        }
        this.aceEditor.on("change", () => {
            console.log(this.aceEditor.getValue());
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

    addComment() {
        if (this.aceEditor.getSelectedText().trim() === "") {
            this.messageService.add({
                severity: 'warn',
                summary: 'Impossible to add a comment',
                detail: 'Please select some code to add a comment'
            });
        }
        //TODO ajouter un commentaire sur certaines lignes de code
        console.log(this.aceEditor.getSelectedText())
    }

    printComments() {
        this.ref = this.dialogService.open(CommentListComponent, {
            header: 'Comments',
            width: '90%',
            contentStyle: {"max-height": "500px", "overflow": "auto"},
            baseZIndex: 10000
        });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
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
