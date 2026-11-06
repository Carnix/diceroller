#!/usr/bin/env node
import { roll } from 'opendice'

const arg = process.argv[2]

if (!arg) {
  console.log('Usage: npm run roll -- <formula|presetN>')
  console.log('  Single formula:    2d6  1d20+5  4d6kh3  2d20adv')
  console.log('  With label:        "1d20+9(attack roll)"')
  console.log('  Multiple formulas: "1d20+15(attack)|1d10+5(damage)"  (quoted, pipe-separated)')
  console.log('  Presets:           preset1')
  process.exit(1)
}

const formatGroup = group => {
  const kept = group.results.map((v, i) => group.keptFlags[i] ? String(v) : `(${v})`).join(', ')
  return `d${group.sides}: [${kept}]`
}

const formatRoll = result => {
  const dice = result.dice.map(formatGroup).join(', ')
  const mod = result.modifier !== 0 ? ` ${result.modifier > 0 ? '+' : ''}${result.modifier}` : ''
  return `${dice}${mod} = ${result.total}`
}

// --- preset1 ---
// 6 sets of attack (1d20+15) + damage (1d10+5)
// nat 20 → crit: 2d10+5 damage; nat 1 → miss: no damage
const runPreset1 = () => {
  console.log('Preset 1 — 6 attack/damage pairs (1d20+15 attack, 1d10+5 damage)\n')

  for (let i = 1; i <= 6; i++) {
    const attack = roll('1d20+15')
    const natural = attack.dice[0].results[0]

    let attackLabel = ''
    if (natural === 20) attackLabel = ' ★ CRITICAL HIT'
    else if (natural === 1) attackLabel = ' ✗ CRITICAL MISS'

    console.log(`Set ${i}:`)
    console.log(`  Attack: ${formatRoll(attack)}${attackLabel}`)

    if (natural === 1) {
      console.log('  Damage: — (no damage on a natural 1)')
    } else if (natural === 20) {
      const damage = roll('2d10+5')
      console.log(`  Damage: ${formatRoll(damage)} (crit: 2d10)`)
    } else {
      const damage = roll('1d10+5')
      console.log(`  Damage: ${formatRoll(damage)}`)
    }

    if (i < 6) console.log()
  }
}

const parseSegment = segment => {
  const match = segment.match(/^(.*)\(([^)]+)\)$/)
  if (match) return { formula: match[1].trim(), label: match[2].trim() }
  return { formula: segment.trim(), label: null }
}

const runSingleFormula = (formula, label) => {
  let result
  try {
    result = roll(formula)
  } catch (err) {
    console.error(`Error rolling "${formula}": ${err.message}`)
    process.exit(1)
  }
  const header = label ? `${label} [${result.formula}]` : `Formula: ${result.formula}`
  console.log(header)
  result.dice.forEach(g => console.log(`  ${formatGroup(g)}`))
  if (result.modifier !== 0) console.log(`  modifier: ${result.modifier > 0 ? '+' : ''}${result.modifier}`)
  console.log(`Total: ${result.total}`)
}

// --- dispatch ---
if (arg === 'preset1') {
  runPreset1()
} else if (arg.includes('|')) {
  const segments = arg.split('|')
  segments.forEach((segment, i) => {
    const { formula, label } = parseSegment(segment)
    runSingleFormula(formula, label)
    if (i < segments.length - 1) console.log()
  })
} else {
  const { formula, label } = parseSegment(arg)
  runSingleFormula(formula, label)
}
