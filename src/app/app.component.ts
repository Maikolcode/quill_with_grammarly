import { Component, OnInit } from '@angular/core';
import { EditorConfig, init } from '@grammarly/editor-sdk';
import { quillsInformation } from 'src/mock-data';
import { QuillTextArea } from './models/quill.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  clientId = 'your_api_key'; // 👈 your grammarly client id here
  quills: QuillTextArea[] = quillsInformation;
  toggle: boolean = false;
  editors: any[] = [];

  ngOnInit() {
    this.initGrammarly();
  }

  initGrammarly() {
    (async () => {
      const config: EditorConfig = {
        activation: 'immediate',
        autocomplete: 'on',
        toneDetector: 'on',
        userFeedback: 'on',
        introText:
          'Grammarly and MaikolCode helps you write clearly and mistake-free.',
      };

      const Grammarly = await init(this.clientId, config);
      const textAreas = document.querySelectorAll('.ql-editor') as NodeList;

      textAreas.forEach((item) => {
        const quillArea = item as HTMLElement;
        if (quillArea) {
          let editor = Grammarly.addPlugin(quillArea);
          this.editors.push(editor);
        }
      });
    })();
  }

  toggleGrammarly(): void {
    this.toggle = !this.toggle;
    this.toggle ? this.disconnectEditors() : this.initGrammarly();
  }

  disconnectEditors(): void {
    this.editors.forEach((editor) => editor.disconnect());
  }
}
