// tslint:disable-next-line: no-implicit-dependencies
import { Node } from 'unist'
import { escapeAttribute, isShortcodeAST } from './utils'

export function shortcodeCompiler(node: Node) {
    if (!isShortcodeAST(node))
        return ''

    const { identifier, attributes, closing, selfClosing, startBlock, endBlock } = node
    let result = startBlock

    if (closing)
        result += '/'

    result += ' ' + identifier

    if (attributes.length)
        result += ' ' + attributes.map(attr => {
            return attr
                .map((a, i) => escapeAttribute(a, i > 0))
                .join('=')
        }).join(' ')

    result += ' '
    if (selfClosing)
        result += '/'

    result += endBlock

    return result
}
