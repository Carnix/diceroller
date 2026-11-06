# opendice CLI

A command-line dice roller built on [opendice](https://www.npmjs.com/package/opendice). Uses cryptographic randomness with modulo bias removed — every face is equally likely.

## Setup

```bash
npm install
```

## Usage

```bash
npm run roll -- <formula>
```

### Single formula

```bash
npm run roll -- 2d6
npm run roll -- 1d20+5
npm run roll -- 4d6kh3
npm run roll -- 2d20adv
```

### Labels

Append `(label)` to any formula to name the roll in the output:

```bash
npm run roll -- "1d20+9(attack roll)"
npm run roll -- "10d6(fireball damage)"
```

### Multiple formulas

Separate formulas with `|` to roll them all in one command. **Quote the argument** — shells treat `|` as a pipe operator otherwise:

```bash
npm run roll -- "1d20+15(attack)|1d10+5(damage)"
npm run roll -- "10d6(bob's fireball)|1d20(kobold save)|1d20+9(digby's attack)|2d8(digby's damage)"
npm run roll -- "4d6kh3|4d6kh3|4d6kh3|4d6kh3|4d6kh3|4d6kh3"
```

Labels are optional — unlabelled formulas work fine alongside labelled ones.

### Presets

```bash
npm run roll -- preset1
```

**preset1** — 6 rounds of attack + damage (1d20+15 attack, 1d10+5 damage). Handles crits (nat 20 → 2d10+5 damage) and misses (nat 1 → no damage).

## Formula syntax

| Syntax           | Meaning                                                   |
| ---------------- | --------------------------------------------------------- |
| `2d6`            | Roll two six-sided dice                                   |
| `1d20+7`         | Roll a d20 and add 7 (use `-7` to subtract)               |
| `1d8+1d4+3`      | Mix dice and flat modifiers freely                        |
| `4d6kh3`         | Roll four d6, keep the highest 3 (stat rolls)             |
| `4d6kl3`         | Keep the lowest 3 instead                                 |
| `2d20adv`        | Roll two d20, keep the higher (advantage)                 |
| `2d20dis`        | Roll two d20, keep the lower (disadvantage)               |
| `2d6min3`        | Each die counts as at least 3 (`max` caps instead)        |
| `2d6totalmin3`   | The dice total counts as at least 3                       |
| `1d6!`           | Exploding: a max face rolls again and adds                |
| `1d6!p`          | Penetrating: like `!` but each extra roll counts 1 less   |
| `1d6x10`         | Multiply the group result by 10                           |

Spaces and capitals are accepted — `2D6 + 3` works.

## Output format

Without a label:

```text
Formula: 1d20+5
  d20: [14]
  modifier: +5
Total: 19
```

With a label, the label leads and the formula appears in brackets:

```text
digby's attack roll [1d20+9]
  d20: [11]
  modifier: +9
Total: 20
```

Dropped dice (keep-highest, etc.) are shown in parentheses:

```text
Formula: 4d6kh3
  d6: [5, 4, (2), 6]
Total: 15
```

Multiple formulas print each result separated by a blank line:

```text
bob's fireball [10d6]
  d6: [3, 5, 2, 4, 6, 1, 3, 2, 5, 4]
Total: 35

kobold save [1d20]
  d20: [8]
Total: 8
```
