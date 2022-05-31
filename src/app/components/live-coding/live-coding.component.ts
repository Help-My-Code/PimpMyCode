import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as ace from "ace-builds";

@Component({
    selector: 'app-live-coding',
    templateUrl: './live-coding.component.html',
    styleUrls: ['./live-coding.component.css']
})
export class LiveCodingComponent implements AfterViewInit {

    constructor() {
    }

    @ViewChild("editor") private editor: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        ace.config.set("fontSize", "14px");
        ace.config.set(
            "basePath",
            "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
        );
        const aceEditor = ace.edit(this.editor.nativeElement);
        aceEditor.session.setValue("<h1>Ace Editor works great in Angular!</h1>");
        aceEditor.setTheme("ace/theme/twilight");
        aceEditor.session.setMode("ace/mode/html");
        aceEditor.on("change", () => {
            console.log(aceEditor.getValue());
        });
    }

}
