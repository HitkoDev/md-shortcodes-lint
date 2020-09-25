import remark from 'remark'
// tslint:disable-next-line: no-implicit-dependencies
import { Eat, Tokenizer } from 'remark-parse'
import guide from 'remark-preset-lint-markdown-style-guide'
// tslint:disable-next-line: no-implicit-dependencies
import { Node } from 'unist'
import { cleanCurly, parseParam, parsePlainParam, ShortcodeAST } from './utils'

const rm = remark()
    .use(guide)

export function getTokenizer(tokens: Array<[string, string]>, markdownAttributes: Set<string>): Tokenizer {
    function shortcodeTokenizer(eat: Eat, value: string, silent: true): boolean | void
    function shortcodeTokenizer(eat: Eat, value: string): Node | void
    function shortcodeTokenizer(eat: Eat, value: string, silent?: true): Node | boolean | void {
        const matchingTokens = tokens.find(([start]) => value.startsWith(start))
        if (!matchingTokens)
            return

        const [startBlock, endBlock] = matchingTokens

        let remainingValue = value.substr(startBlock.length).trimLeft()
        const closing = remainingValue.startsWith('/')
        if (closing)
            remainingValue = remainingValue.substr(1).trimLeft()

        const parsedName = parsePlainParam(remainingValue, endBlock, true)
        if (!parsedName)
            return

        const identifier = parsedName.param
        remainingValue = parsedName.value.trimLeft()

        let selfClosing = false
        const attributes = []
        let kv = []
        let ended = false
        while (remainingValue.length) {
            if (remainingValue.indexOf('/') == 0) {
                selfClosing = true
                remainingValue = remainingValue.substr(1).trimLeft()
            }
            if (remainingValue.indexOf(endBlock) == 0) {
                remainingValue = remainingValue.substr(endBlock.length)
                ended = true
                break
            }
            if (remainingValue.indexOf('=') == 0) {
                remainingValue = remainingValue.substr(1).trimLeft()
            }

            const parsedParam = parseParam(remainingValue, endBlock, kv.length == 1)
            kv.push(parsedParam.param)
            remainingValue = parsedParam.value.trimLeft()
            if (kv.length == 2 || remainingValue.charAt(0) != '=') {
                attributes.push(kv)
                kv = []
            }
        }
        if (kv.length)
            attributes.push(kv)

        if (!ended)
            return

        if (silent) {
            return true
        }

        const entireShortcode = value.substr(0, value.length - remainingValue.length)

        attributes.forEach(attr => {
            if (attr.length == 2 && markdownAttributes.has(attr[0].toLowerCase()))
                attr[1] = cleanCurly(String(rm.processSync('' + (attr[1] || ''))).trim())
        })

        return eat(entireShortcode)({
            type: 'shortcode',
            identifier,
            attributes: closing ? [] : attributes,
            closing,
            selfClosing: closing ? false : selfClosing,
            startBlock,
            endBlock
        } as ShortcodeAST)
    }

    shortcodeTokenizer.locator = function locator(value: string, fromIndex?: number) {
        let i = -1
        tokens.forEach(([start]) => {
            const m = value.indexOf(start, fromIndex)
            if (m >= 0 && (i < 0 || m < i))
                i = m
        })
        return i
    }

    return shortcodeTokenizer
}
