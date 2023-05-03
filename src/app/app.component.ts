import { Component, OnInit } from '@angular/core';
import { EditorConfig, GrammarlyEditorPluginElement, init } from '@grammarly/editor-sdk';
import { quillsInformation } from 'src/mock-data';
import { GrammarlyEditor, QuillTextArea } from './models/quill.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  clientId = 'your_api_key'; // 👈 your grammarly client id here;
  quills: QuillTextArea[] = quillsInformation;
  toggle: boolean = false;
  editors: GrammarlyEditor[] = [];

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

      textAreas.forEach((item, index) => {
        const quillArea = item as HTMLElement;
        if (quillArea) {
          let editor = Grammarly.addPlugin(quillArea);
          this.addEventsToEditors(editor, index);
          this.editors.push(
            {
              document: {},
              session: {},
              editor
            }
          );
        }
      });
    })();
  }

  addEventsToEditors(editor: GrammarlyEditorPluginElement, index: number): void {
    editor.addEventListener(
      'document-stats',
      (event) => this.grammarLogs(event, index)
    );
    editor.addEventListener(
      'session-stats',
      (event) => this.grammarLogs(event, index)
    );
  }

  grammarLogs(event: any, index: number) {
    if(event.type === 'document-stats') this.editors[index].document = event.detail;
    if(event.type === 'session-stats') this.editors[index].session = event.detail;
  }

  toggleGrammarly(): void {
    this.toggle = !this.toggle;
    this.toggle ? this.disconnectEditors() : this.initGrammarly();
  }

  disconnectEditors(): void {
    this.editors.forEach((editor) => editor.editor.disconnect());
  }

  showLogs(): void {
    let reportCompleted = {
      characters: 0,
      wordsCount: 0,
      wordsAnalyzed: 0,
      wordsChecked: 0,
      suggestionsCount: 0
    }
    this.editors.forEach(items => {
      console.log(items);
      reportCompleted.characters += items.document.wordsCount !== 0 ? items.document.charsCount : 0;
      reportCompleted.wordsCount += items.document.wordsCount;
      reportCompleted.wordsAnalyzed += items.session.wordsAnalyzed;
      reportCompleted.wordsChecked += items.session.wordsChecked;
      reportCompleted.suggestionsCount += items.document.suggestionsCount;
    })

    console.log(reportCompleted);
  }
}
