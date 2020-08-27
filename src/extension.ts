import * as vscode from 'vscode'; // module contains the VS Code extensibility API
import { ExtensionProvider } from './provider';

export function activate(context: vscode.ExtensionContext) {
	// console.log('Congratulations, your extension "covidvscode" is now active!');
	context.subscriptions.push(ExtensionProvider.register(context));
}

export function deactivate() {}