import fm from 'front-matter'
import yaml from 'js-yaml'
import remark, { PartialRemarkOptions } from 'remark'
import { cleanCurly, ShortcodeOptions, shortcodes } from 'remark-hugo-shortcodes'
import guide from 'remark-preset-lint-markdown-style-guide'
// tslint:disable-next-line: no-implicit-dependencies
import { Processor } from 'unified'

export class Formatter {

    readonly rm: Processor<PartialRemarkOptions>

    constructor(options?: ShortcodeOptions) {
        this.rm = remark()
            .use(guide)
            .use(shortcodes, options)
    }

    async format(code: string) {
        let out = ''
        let content: string

        // handle yaml front-matter
        try {
            const matter = fm(code)
            if (Object.keys(matter.attributes as any).length !== 0) {
                out += `---\n${yaml.dump(cleanCurly(matter.attributes), { flowLevel: 1 }).trim()}\n---\n\n`
            }
            content = matter.body
        } catch (error) {
            // parsing failed, just ignore front-matter
            content = code
        }

        content = cleanCurly(content)

        const formatted = await new Promise<string>((resolve, reject) => this.rm.process(content, (err, res) => {
            if (err)
                return reject(err)

            resolve(String(res))
        }))

        return out + formatted
            .replace(/\]\\\(\{\{/g, ']({{')
    }
}
