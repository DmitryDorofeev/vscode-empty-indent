// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

  vscode.workspace.onDidSaveTextDocument(event => {
    vscode.commands.executeCommand('editor.action.trimTrailingWhitespace');
  });
}   


