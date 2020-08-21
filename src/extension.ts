// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {CovidProvider} from './provider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "covidvscode" is now active!');
	context.subscriptions.push(CovidProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}