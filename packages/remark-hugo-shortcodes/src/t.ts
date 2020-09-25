import { readFileSync, writeFileSync } from 'fs'
import remark from 'remark'
import guide from 'remark-preset-lint-markdown-style-guide'
import { shortcodes } from './index'

const rm = remark()
    .use(guide)
    .use(shortcodes, { inlineMode: true, markdownAttributes: ['title', 'alt', 'caption'] })

function format(code: string) {
    return new Promise<string>((resolve, reject) => rm.process(code, (err, res) => {
        if (err)
            return reject(err)

        resolve(String(res))
    }))
}

const c = readFileSync('in.md', 'utf8')

const out = ''
let content: string = c

content = content.replace(/[’′]/g, '&apos;').replace(/[“”″]/g, '&quot;').replace(/–/g, '--').replace(/—/g, '---')

format(content)
    .then(r => out + r)
    .then(r => writeFileSync('out.md', Buffer.from(r)))
    .catch()
