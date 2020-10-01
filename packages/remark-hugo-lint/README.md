# remark-hugo-lint

[Remark](https://github.com/gnab/remark)-based linter for markdown with [Hugo](https://gohugo.io/content-management/shortcodes/)-style shortcodes.

## Example

```js
import { promises } from 'fs'
import { Formatter } from '.'

const formatter = new Formatter({
    tokens: [['[[', ']]']],
    inlineMode: true,
    markdownAttributes: ['title', 'alt', 'caption']
})

promises.readFile('in.md', 'utf8')
    .then(code => formatter.format(code))
    .then(clean => promises.writeFile('out.md', Buffer.from(clean)))
    .then(() => console.log('Done!'))

```

### See also

-   [Remark shortcodes plugin](https://github.com/HitkoDev/md-shortcodes-lint/tree/master/packages/remark-hugo-shortcodes)
-   [VS Code extension](https://github.com/HitkoDev/md-shortcodes-lint/tree/master/packages/vscode-remark-hugo)
