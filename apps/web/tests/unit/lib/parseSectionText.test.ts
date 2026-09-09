import { parsePairs, parseBullets } from '@/lib/parseSectionText'

describe('parsePairs', () => {
  it('splits each line on the first colon into label/value', () => {
    expect(parsePairs('Purity: 100% certified\nShelf Life: Long')).toEqual([
      { label: 'Purity', value: '100% certified' },
      { label: 'Shelf Life', value: 'Long' },
    ])
  })

  it('ignores blank lines', () => {
    expect(parsePairs('A: 1\n\nB: 2\n')).toHaveLength(2)
  })

  it('returns an empty array for empty input', () => {
    expect(parsePairs('')).toEqual([])
  })
})

describe('parseBullets', () => {
  it('splits each line on " – " into label/value', () => {
    expect(parseBullets('Quality – Every batch is tested.')).toEqual([{ label: 'Quality', value: 'Every batch is tested.' }])
  })

  it('falls back to an unlabeled value when there is no dash', () => {
    expect(parseBullets('Just a plain line')).toEqual([{ label: '', value: 'Just a plain line' }])
  })

  it('ignores blank lines', () => {
    expect(parseBullets('A – 1\n\nB – 2\n')).toHaveLength(2)
  })
})
