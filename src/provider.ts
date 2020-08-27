import * as vscode from 'vscode';

export class ExtensionProvider implements vscode.CustomEditorProvider<any> {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
		return vscode.commands.registerCommand('covidvscode.start', () => {
            const panel = vscode.window.createWebviewPanel(
                'customExtension',
                'COVID Testing Sites',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                } 
            );
            panel.webview.html = this.getWebviewContent(context.extensionUri, panel.webview);

            panel.webview.onDidReceiveMessage(
                message => { this.showMessage(message); },
                undefined,
                context.subscriptions
              );
        });
    }

    static showMessage = (message: any) => {
        switch (message.command) {
            case 'alert':
                vscode.window.showErrorMessage(message.text);
                break;
            case 'information':
                vscode.window.showInformationMessage(`Check [${message.name}] on the map 🗺️`, 'Open Bing Maps')
                    .then(() => {
                        const uri = vscode.Uri.parse(message.url);
                        vscode.env.openExternal(uri);
                    });
                break;
            default:
                break;
        }
    };
    
    static getWebviewContent = (extensionUri: vscode.Uri, webview: vscode.Webview) => {
        const getWebviewUri = (filename: string) => {
            const pathOnnDisk = vscode.Uri.joinPath(extensionUri, 'media', filename);
            return webview.asWebviewUri(pathOnnDisk);
        };
    
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>COVID Testing Sites</title>
                <link rel="stylesheet" type="text/css" href ="${getWebviewUri('style.css')}">
            </head>
            <body>
                <div class="main">
                    <h2>Check COVID Testing Sites Near You</h2>
                    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="250" />
            
                    <span>Type the name of the state you want to know about</span>
                    <input type="text" id="state-name"/>
                    <div id="testing-sites" />
                <div/>
                
                <script src="${getWebviewUri('script.js')}" />
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