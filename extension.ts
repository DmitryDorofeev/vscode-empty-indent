import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  vscode.workspace.onDidSaveTextDocument(event => {
    vscode.commands.executeCommand('editor.action.trimTrailingWhitespace');
    vscode.window.activeTextEditor.document.save();
  });
}
