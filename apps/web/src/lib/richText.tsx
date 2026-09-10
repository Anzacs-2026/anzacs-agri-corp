import type { ReactNode } from 'react'

// Plain lines render as paragraphs; a line starting with "- " renders as a
// bullet point. Mix both freely. Inline **bold**, *italic*, __underline__ —
// typed by hand, no toolbar. Kept deliberately simple, not a rich text editor.
const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('__') && part.endsWith('__')) return <u key={i}>{part.slice(2, -2)}</u>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })

export const renderRichText = (text: string): ReactNode => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const nodes: ReactNode[] = []
  let bulletBuffer: string[] = []

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="list-disc space-y-1 pl-5">
        {bulletBuffer.map((line, i) => (
          <li key={i}>{renderInline(line)}</li>
        ))}
      </ul>,
    )
    bulletBuffer = []
  }

  lines.forEach((line) => {
    if (line.startsWith('- ')) {
      bulletBuffer.push(line.slice(2))
      return
    }
    flushBullets()
    nodes.push(<p key={`p-${nodes.length}`}>{renderInline(line)}</p>)
  })
  flushBullets()

  return nodes
}
