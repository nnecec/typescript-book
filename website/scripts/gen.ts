import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
// import { visit } from 'unist-util-visit'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ENBooksPath = join(__dirname, '../src/content/docs/books')
const CNBooksPath = join(__dirname, '../src/content/docs/zh-cn/books')
const OriginEnBook = join(__dirname, '../../README.md')
const OriginCnBook = join(__dirname, '../../README-zh_CN.md')
const r = remark().use(remarkFrontmatter, { marker: '-', type: 'yaml' })

await run(OriginEnBook, ENBooksPath)
await run(OriginCnBook, CNBooksPath)

async function run(originPath: string, outputDir: string) {
  const content = await readFile(originPath, 'utf8')
  const ast = r.parse(content)
  type Root = typeof ast

  // visit(ast, ['link'], node => {
  //   console.log(inspect(node, false, null, true))
  // })

  const parts = []
  const titles: string[] = []

  let head = 0
  let tail = 0
  let index = 0

  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]

    if ((child.type === 'heading' && [1, 2].includes(child.depth)) || i === ast.children.length - 1) {
      tail = i
      const title = (ast as any).children[head].children[0].value
      const nodeList = [
        { type: 'yaml', value: `title: ${title}\nsidebar:\n  order: ${index}\n  label: ${index++}. ${title}` },
        ...ast.children.slice(head + 1, tail),
      ]
      titles.push(title)
      parts.push({ children: nodeList, type: 'root' })
      head = i
    }
  }

  try {
    const dirStat = await stat(outputDir)
    if (dirStat.isDirectory()) {
      await rm(outputDir, { recursive: true })
      mkdir(outputDir)
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      mkdir(outputDir)
    } else {
      throw err
    }
  }

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    await writeFile(join(outputDir, `${i}. ${titles[i]}.md`), r.stringify(part as Root))
  }
}
