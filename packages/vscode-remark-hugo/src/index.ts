import { Formatter } from 'remark-hugo-lint'
import * as vscode from 'vscode'

function getRangeOfDocument(document: vscode.TextDocument): vscode.Range {
    const start = new vscode.Position(0, 0)
    const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
    return new vscode.Range(start, end)
}

async function runRemarkHugo(document: vscode.TextDocument, range: vscode.Range, options: vscode.WorkspaceConfiguration): Promise<vscode.TextEdit[]> {
    const formatter = new Formatter(options as any)
    const content = document.getText(range)
    const formattedText: string = await formatter.format(content)
    return [new vscode.TextEdit(range, formattedText)]
}

export function activate(context: vscode.ExtensionContext) {
    const supportedDocument: vscode.DocumentSelector = 'markdown'

    // Support formatting the whole document.
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(supportedDocument, {
        async provideDocumentFormattingEdits(document: vscode.TextDocument, _options: vscode.FormattingOptions, _token: vscode.CancellationToken): Promise<vscode.TextEdit[]> {
            const remarkHugoConfig = vscode.workspace.getConfiguration('remarkHugo')
            if (remarkHugoConfig && !remarkHugoConfig['disableFormatter']) {
                const range = getRangeOfDocument(document)
                const formattedText: vscode.TextEdit[] = await runRemarkHugo(document, range, remarkHugoConfig)
                return formattedText
            }
            return []
        }
    }))

    // Support formatting a selection.
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocument, {
        async provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, _options: vscode.FormattingOptions, _token: vscode.CancellationToken): Promise<vscode.TextEdit[]> {
            const remarkHugoConfig = vscode.workspace.getConfiguration('remarkHugo')
            if (remarkHugoConfig && !remarkHugoConfig['disableFormatter']) {
                const formattedText: vscode.TextEdit[] = await runRemarkHugo(document, range, remarkHugoConfig)
                return formattedText
            }
            return []
        }
    }))
}
