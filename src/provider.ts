import * as vscode from 'vscode';

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export class CovidProvider implements vscode.CustomEditorProvider<any> {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
		return vscode.commands.registerCommand('covidvscode.start', () => {
            const panel = vscode.window.createWebviewPanel(
                'catCoding',
                'COVID Testing Sites',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                } // Webview options.
            );
            // And set its HTML content
            panel.webview.html = this.getWebviewContent(context.extensionUri, panel.webview);

            panel.webview.onDidReceiveMessage(
                message => {
                    console.log('message',message);
                    switch (message.command) {
                        case 'alert':
                            vscode.window.showErrorMessage(message.text);
                            return;
                        case 'information':
                            vscode.window.showInformationMessage(message.text);
                            return;
                    }
                },
                undefined,
                context.subscriptions
              );
        });
    }
    
    static getWebviewContent = (extensionUri: vscode.Uri, webview: vscode.Webview) => {
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
                    <h2>Check COVID Testing Sites Near You</h2>
                    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="250" />
            
                    <span>Type the name of the state you want to know about</span>
                    <input type="text" id="state-name" placeholder="washington"/>
                    <div id="testing-sites" />
                <div/>
                
                <script nonce="${nonce}" src="${scriptUri}">
                </script>
            </body>
            </html>`;
    };

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<any>>();
	public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;
    saveCustomDocument(document: any, cancellation: vscode.CancellationToken): Thenable<void> {
        throw new Error("Method not implemented.");
    }
    saveCustomDocumentAs(document: any, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {
        throw new Error("Method not implemented.");
    }
    revertCustomDocument(document: any, cancellation: vscode.CancellationToken): Thenable<void> {
        throw new Error("Method not implemented.");
    }
    backupCustomDocument(document: any, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        throw new Error("Method not implemented.");
    }
    openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken) {
        throw new Error("Method not implemented.");
    }
    resolveCustomEditor(document: any, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
}