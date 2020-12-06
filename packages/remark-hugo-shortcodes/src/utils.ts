import { PartialRemarkOptions } from 'remark'
// tslint:disable-next-line: no-implicit-dependencies
import { Parser } from 'remark-parse'
// tslint:disable-next-line: no-implicit-dependencies
import { Compiler } from 'remark-stringify'
// tslint:disable-next-line: no-implicit-dependencies
import { Processor } from 'unified'
// tslint:disable-next-line: no-implicit-dependencies
import { Node } from 'unist'

/**
 * Recursively replace pretty UTF quotes and dashes with corresponding straight ones.
 */
export function cleanCurly<T>(val: T[]): T[]
export function cleanCurly<T>(val: T): T
export function cleanCurly<T>(val: T): T {
    if (Array.isArray(val))
        val = val.map(cleanCurly) as any
    else if (val && typeof val == 'object') {
        Object.keys(val).forEach(k => (val as any)[k] = cleanCurly((val as any)[k]))
    } else if (typeof val == 'string') {
        val = val
            .replace(/[’′]/g, "'")
            .replace(/[“”″]/g, '"')
            .replace(/–/g, '--')
            .replace(/—/g, '---')
            .replace(/…/g, '...') as any
    }
    return val
}

export interface ShortcodeAST extends Node {
    type: 'shortcode'
    identifier: string
    attributes: Array<[string] | [string, string]>
    closing: boolean
    selfClosing: boolean
    startBlock: string
    endBlock: string
}

export interface ParamParseResult {
    param: string
    value: string
}

export function parsePlainParam(value: string, endBlock: string, trimValue = false, asValue = false): ParamParseResult {
    const matches = [
        /\s/m.exec(value),
        asValue ? undefined : /=/.exec(value),
        /\//.exec(value),
        new RegExp(endBlock.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).exec(value)
    ]

    const index = matches
        .map(m => m?.index ?? -1)
        .reduce((t, i) => Math.min(t, i) >= 0 ? Math.min(t, i) : Math.max(t, i), -1)

    if (index < 0) {
        return {
            param: value.trim(),
            value: ''
        }
    } else {
        const param = value.substr(0, index)
        value = value.substr(index).trimLeft()
        if (trimValue && value.charAt(0) === '=') {
            const i = /\s/m.exec(value)?.index ?? -1
            value = i >= 0
                ? value.substr(i).trimLeft()
                : ''
        }
        return {
            param,
            value
        }
    }
}

export function parseParam(value: string, endBlock: string, asValue = false): ParamParseResult {
    const t = value.charAt(0)
    if (!escapingTokensSet.has(t)) {
        return parsePlainParam(value, endBlock, false, asValue)
    } else {
        value = value.substr(1)
        const i = new RegExp(`(^|[^\\\\])${t}`).exec(value)?.index ?? -1
        if (i < 0)
            return {
                param: value.replace(new RegExp(`\\\\${t}`, 'g'), t),
                value: ''
            }
        else
            return {
                param: value.substr(0, i + 1).replace(new RegExp(`\\\\${t}`, 'g'), t),
                value: value.substr(i + 2).trimLeft()
            }
    }
}

const escapingTokens = ['"', '`']
const escapingTokensSet = new Set(escapingTokens)

export function escapeAttribute(attr: string, forceQuotes = false) {
    const hasTokens = !!escapingTokens.find(t => attr.indexOf(t) >= 0)
    const freeToken = escapingTokens.find(t => attr.indexOf(t) < 0)
    const hasNewLine = attr.indexOf('\n') >= 0
    const needsEscape = forceQuotes || hasTokens || !attr.match(/^[a-z0-9]+$/)

    if (hasNewLine)
        return '`' + attr.replace(/`/g, '\\`') + '`'

    if (hasTokens && freeToken)
        return freeToken + attr + freeToken

    if (needsEscape)
        return '"' + attr.replace(/"/g, '\\"') + '"'

    return attr
}

export function isRemarkParser(parser?: Processor<PartialRemarkOptions>['Parser']): parser is typeof Parser {
    return !!parser?.prototype?.inlineTokenizers?.break?.locator
}

export function isRemarkCompiler(compiler: Processor<PartialRemarkOptions>['Compiler']): compiler is typeof Compiler {
    return !!compiler?.prototype
}

export function isShortcodeAST(node: Node): node is ShortcodeAST {
    return node.type === 'shortcode'
}
