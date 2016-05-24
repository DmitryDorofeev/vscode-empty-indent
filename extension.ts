import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  let removeIndent: boolean = vscode.workspace.getConfiguration('emptyIndent')['removeIndent'];
  let highlightIndent: boolean = vscode.workspace.getConfiguration('emptyIndent')['highlightIndent'];
  let highlightColor: string = vscode.workspace.getConfiguration('emptyIndent')['highlightColor'];

  let activeEditor = vscode.window.activeTextEditor;

  if (removeIndent) {
    vscode.workspace.onDidSaveTextDocument(event => {
      vscode.commands.executeCommand('editor.action.trimTrailingWhitespace');
      vscode.window.activeTextEditor.document.save();
    });
  }

  if (highlightIndent) {

     let decoration = vscode.window.createTextEditorDecorationType({
       backgroundColor: highlightColor
     });

     vscode.window.onDidChangeActiveTextEditor(editor => {
      activeEditor = editor;
      if (editor) {
        updateDecorations(editor, decoration);
      }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations(activeEditor, decoration);
      }
    }, null, context.subscriptions);

    vscode.window.onDidChangeTextEditorSelection(event => {
        const line = event.selections.length === 1 ? event.selections[0].active : null;
        if (activeEditor) {
          updateDecorations(activeEditor, decoration, line);
        }
    }, null, context.subscriptions);
  }

}

function updateDecorations(editor, decoration, line?) {
    if (!editor) {
      return;
    }

    const regEx = /^[\t\s]+$/gm;
    var text = editor.document.getText();
    var tabsize = editor.options.tabSize
    var tabs = " ".repeat(tabsize)
    var decor: vscode.DecorationOptions[] = [];
    var match;

    const currentLine = editor.selection.active;
    const currentLineRange = new vscode.Range(new vscode.Position(currentLine.line, 0), currentLine);

    while (match = regEx.exec(text)) {
      var startPos = editor.document.positionAt(match.index);
      var endPos = editor.document.positionAt(match.index + match[0].length);
      let range = new vscode.Range(startPos, endPos);
      if (editor.selection.isEmpty && range.contains(currentLineRange)) {
        const rangeBeforeSelection = new vscode.Range(range.start, currentLineRange.start);
        const rangeAfterSelection = new vscode.Range(currentLineRange.end, range.end);

        var decorationPosBefore = { range: rangeBeforeSelection, hoverMessage: null };
        var decorationPosAfter = { range: rangeAfterSelection, hoverMessage: null };
        decor.push(decorationPosBefore);
        decor.push(decorationPosAfter);
      } else {
        var decorationPos = { range: range, hoverMessage: null };
        decor.push(decorationPos);
      }
    }
    editor.setDecorations(decoration, decor);
}
