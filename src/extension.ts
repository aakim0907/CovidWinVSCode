// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "covidvscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('covidvscode.start', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello Kimy! Welcome back to VS Code.');

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'catCoding', // Identifies the type of the webview. Used internally
			'COVID Testing Sites', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
			} // Webview options.
		);
		// And set its HTML content
		panel.webview.html = getWebviewContent(context.extensionUri, panel.webview);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

const getWebviewContent = (extensionUri: vscode.Uri, webview: vscode.Webview) => {
	const nonce = getNonce();

	const stylesheetPathOnDisk = vscode.Uri.joinPath(extensionUri, 'media', 'style.css');
	const stylesheetUri = webview.asWebviewUri(stylesheetPathOnDisk);

	const scriptPathOnDisk = vscode.Uri.joinPath(extensionUri, 'media', 'script.js');
	const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>COVID Testing Sites</title>
	<link rel="stylesheet" type="text/css" href ="${stylesheetUri}">
</head>
<body>
	<div class="main">
		<h3>Check COVID Testing Sites Near You</h3>
		<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="250" />

		<h1 id="lines-of-code-counter">0</h1>

		<input type="text" id="state-name" />
	<div/>
	
	<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
};

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}