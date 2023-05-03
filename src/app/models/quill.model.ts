import { GrammarlyEditorPluginElement } from "@grammarly/editor-sdk";

export interface QuillTextArea {
  text: string
}


export interface GrammarlyEditor {
  editor: GrammarlyEditorPluginElement;
  document: any;
  session: any;
}
