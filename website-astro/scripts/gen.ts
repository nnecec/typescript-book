import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ENBooksPath = join(__dirname, '../src/content/docs/books')
const CNBooksPath = join(__dirname, '../src/content/docs/zh-cn/books')
const OriginEnBook = join(__dirname, '../../README.md')
const OriginCnBook = join(__dirname, '../../README-zh_CN.md')
const r = remark().use(remarkFrontmatter, { marker: '-', type: 'yaml' })
let enTitles: string[]

await run(OriginEnBook, ENBooksPath)
await run(OriginCnBook, CNBooksPath)

async function run(originPath: string, outputDir: string) {
  const content = await readFile(originPath, 'utf8')
  const ast = r.parse(content)
  type Root = typeof ast

  const parts = []
  const titles: string[] = []

  let head = 0
  let tail = 0
  let index = 0

  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]

    if ((child.type === 'heading' && [1, 2].includes(child.depth)) || i === ast.children.length - 1) {
      tail = i
      const title = (ast as any).children[head].children[0].value as string
      if (!['Translations', 'Downloads and website', '下载和网站', '翻译'].includes(title)) {
        console.log(index, title)
        const nodeList = [
          { type: 'yaml', value: `title: ${title}\nsidebar:\n  order: ${index}\n  label: ${index++}. ${title}` },
          ...ast.children.slice(head + 1, tail),
        ]
        titles.push(title)
        const root = { children: nodeList, type: 'root' }
        // deal with anchor redirect
        visit(root, ['link'], (node: any) => {
          if (node.url.startsWith('#')) {
            let anchor = node.url.slice(1)
            if (anchor.endsWith('-')) {
              anchor = anchor.slice(0, -1)
            }
            let heading: string = ''
            let finded = false
            visit(ast, ['heading'], (node: any) => {
              const title = node.children[0].value

              if ([1, 2].includes(node.depth) && !finded) {
                heading = title
              }
              if (
                title
                  .replaceAll(/[^\s\w]/gi, '')
                  .replaceAll(/\s+/g, '-')
                  .toLowerCase()
                  .includes(anchor)
              ) {
                finded = true
              }
            })
            node.url = `/books/${heading
              .replaceAll(/[^\s\w]/gi, '')
              .replaceAll(/\s+/g, '-')
              .toLowerCase()}#${anchor}`
          }
        })
        parts.push(root)
      }

      head = i
    }
  }

  if (!enTitles) enTitles = titles

  try {
    const dirStat = await stat(outputDir)
    if (dirStat.isDirectory()) {
      await rm(outputDir, { recursive: true })
      mkdir(outputDir)
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      mkdir(outputDir)
    } else {
      throw error
    }
  }
  // console.log(enTitles, parts)
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    await writeFile(join(outputDir, `${enTitles[i]}.md`), r.stringify(part as Root))
  }
}
