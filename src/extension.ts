import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitButtons.fetch', () => {
      void vscode.window.showInformationMessage('GIT Buttons: fetch not implemented yet');
    }),
    vscode.commands.registerCommand('gitButtons.pruneLocalBranches', () => {
      void vscode.window.showInformationMessage(
        'GIT Buttons: prune local branches not implemented yet'
      );
    })
  );
}

export function deactivate() {}
