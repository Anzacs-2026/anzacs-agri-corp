export const parsePairs = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })

export const parseBullets = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(' – ')
      return rest.length ? { label: label.trim(), value: rest.join(' – ').trim() } : { label: '', value: line }
    })
