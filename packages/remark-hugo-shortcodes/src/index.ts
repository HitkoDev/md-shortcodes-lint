import { PartialRemarkOptions } from 'remark'
// tslint:disable-next-line: no-implicit-dependencies
import { Processor } from 'unified'
import { shortcodeCompiler } from './compiler'
import { getTokenizer } from './parser'
import { cleanCurly, isRemarkCompiler, isRemarkParser, isShortcodeAST, ShortcodeAST } from './utils'

export interface ShortcodeOptions {
    /**
     * Array of shortcode tokens as `[start, end]`
     *
     * @default ```
     * [ ['{{<', '>}}'], ['{{%', '%}}'] ]
     * ```
     */
    tokens?: Array<[string, string]>
    /**
     * Whether to parse inline shortcodes
     *
     * @default false
     */
    inlineMode?: boolean,

    /**
     * Attributes where value contains markdown
     *
     * @default []
     */
    markdownAttributes?: string[]
}

export function shortcodes(this: Processor<PartialRemarkOptions>, options?: ShortcodeOptions) {
    const tokens: Array<[string, string]> = (options || {}).tokens || [
        ['{{<', '>}}'],
        ['{{%', '%}}']
    ]
    const inlineMode = (options || {}).inlineMode || false
    const markdownAttributes = new Set((options || {}).markdownAttributes || [])

    if (isRemarkParser(this.Parser)) {
        const parser = this.Parser.prototype
        const tokenizers = inlineMode ? parser.inlineTokenizers : (parser as any).blockTokenizers as typeof parser.inlineTokenizers
        const methods = inlineMode ? parser.inlineMethods : parser.blockMethods

        tokenizers.shortcode = getTokenizer(tokens, markdownAttributes)
        methods.splice(methods.indexOf('html'), 0, 'shortcode')
    }

    if (isRemarkCompiler(this.Compiler)) {
        const compiler = this.Compiler.prototype
        compiler.visitors.shortcode = shortcodeCompiler
    }
}

export {
    cleanCurly,
    isShortcodeAST,
    ShortcodeAST
}
