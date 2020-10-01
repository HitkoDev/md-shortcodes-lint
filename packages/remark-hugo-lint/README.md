# remark-hugo-lint

[![Licence](https://flat.badgen.net/github/license/HitkoDev/md-shortcodes-lint?color=blue)](https://opensource.org/licenses/GPL-3.0)
[![NPM](https://flat.badgen.net/npm/v/remark-hugo-lint?color=blue)](https://www.npmjs.com/package/remark-hugo-lint)

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
