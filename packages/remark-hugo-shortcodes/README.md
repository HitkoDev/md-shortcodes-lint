# remark-hugo-shortcodes

[Remark](https://github.com/gnab/remark) parser & compiler for [Hugo](https://gohugo.io/content-management/shortcodes/)-style shortcodes.

## Example

```js
import remark from 'remark'
import { shortcodes } from 'remark-hugo-shortcodes'

const rm = remark()
    .use(shortcodes, {
        tokens: [["[[", "]]"]],
        inlineMode: true,
        markdownAttributes: ['title', 'alt', 'caption']
    })

```
