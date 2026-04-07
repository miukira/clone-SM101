/**
 * BBFS (Bolak Balik Full Set): dari 4 digit (multiset), bangkitkan baris taruhan unik:
 * - 4D: semua permutasi unik 4 angka, posisi full
 * - 3D: semua permutasi berurutan panjang 3 dari multiset × posisi depan & belakang
 * - 2D: semua permutasi berurutan panjang 2 × depan, tengah, belakang
 */

function cloneFreq(freq) {
  return { ...freq }
}

function multisetPermutations(freqInput) {
  const freq = cloneFreq(freqInput)
  const total = Object.values(freq).reduce((a, b) => a + b, 0)
  const out = []
  function dfs(path) {
    if (path.length === total) {
      out.push(path.join(''))
      return
    }
    for (const d of Object.keys(freq).sort()) {
      if (freq[d] <= 0) continue
      freq[d]--
      path.push(d)
      dfs(path)
      path.pop()
      freq[d]++
    }
  }
  dfs([])
  return out
}

function multisetKPermutations(freqInput, k) {
  const freq = cloneFreq(freqInput)
  const out = []
  function dfs(path) {
    if (path.length === k) {
      out.push(path.join(''))
      return
    }
    for (const d of Object.keys(freq).sort()) {
      if (freq[d] <= 0) continue
      freq[d]--
      path.push(d)
      dfs(path)
      path.pop()
      freq[d]++
    }
  }
  dfs([])
  return out
}

/**
 * @param {string} fourDigits - tepat 4 karakter digit (boleh duplikat)
 * @returns {{ lines: Array<{ type: string, number: string, position: string }>, lineCount: number }}
 */
export function expandBbfsLines(fourDigits) {
  const digits = String(fourDigits || '').replace(/\D/g, '')
  if (digits.length !== 4) {
    return { lines: [], lineCount: 0 }
  }

  const freq = {}
  for (const c of digits) {
    freq[c] = (freq[c] || 0) + 1
  }

  const lines = []
  const seen = new Set()

  const add = (type, str, position) => {
    const number = str.split('').join(',')
    const key = `${type}|${number}|${position}`
    if (seen.has(key)) return
    seen.add(key)
    lines.push({ type, number, position })
  }

  for (const p of multisetPermutations(cloneFreq(freq))) {
    add('4D', p, 'full')
  }
  for (const p of multisetKPermutations(cloneFreq(freq), 3)) {
    add('3D', p, 'depan')
    add('3D', p, 'belakang')
  }
  for (const p of multisetKPermutations(cloneFreq(freq), 2)) {
    add('2D', p, 'depan')
    add('2D', p, 'tengah')
    add('2D', p, 'belakang')
  }

  return { lines, lineCount: lines.length }
}

export function countBbfsByKind(lines) {
  const c = { '4D': 0, '3D': 0, '2D': 0 }
  for (const row of lines) {
    if (c[row.type] !== undefined) c[row.type]++
  }
  return c
}
