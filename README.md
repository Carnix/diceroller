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

### Multiple formulas

Separate formulas with `|` to roll them all in one command:

```bash
npm run roll -- 1d20+15|1d10+5
npm run roll -- 4d6kh3|4d6kh3|4d6kh3|4d6kh3|4d6kh3|4d6kh3
npm run roll -- 1d8+3|1d6|1d4+1
```

Each formula is rolled independently and printed in order.

### Presets

```bash
npm run roll -- preset1
```

**preset1** — 6 rounds of attack + damage (1d20+15 attack, 1d10+5 damage). Handles crits (nat 20 → 2d10+5 damage) and misses (nat 1 → no damage).

## Formula syntax

| Syntax         | Meaning                                               |
| -------------- | ----------------------------------------------------- |
| `2d6`          | Roll two six-sided dice                               |
| `1d20+7`       | Roll a d20 and add 7 (use `-7` to subtract)           |
| `1d8+1d4+3`    | Mix dice and flat modifiers freely                    |
| `4d6kh3`       | Roll four d6, keep the highest 3 (stat rolls)         |
| `4d6kl3`       | Keep the lowest 3 instead                             |
| `2d20adv`      | Roll two d20, keep the higher (advantage)             |
| `2d20dis`      | Roll two d20, keep the lower (disadvantage)           |
| `2d6min3`      | Each die counts as at least 3 (`max` caps instead)    |
| `2d6totalmin3` | The dice total counts as at least 3                   |
| `1d6!`         | Exploding: a max face rolls again and adds            |
| `1d6!p`        | Penetrating: like `!` but each extra roll counts 1 less |
| `1d6x10`       | Multiply the group result by 10                       |

Spaces and capitals are accepted — `2D6 + 3` works.

## Output format

Single formula:

```
Formula: 1d20+5
  d20: [14]
  modifier: +5
Total: 19
```

Dropped dice (keep-highest, etc.) are shown in parentheses:

```
Formula: 4d6kh3
  d6: [5, 4, (2), 6]
Total: 15
```

Multiple formulas print each result separated by a blank line:

```
Formula: 1d20+15
  d20: [12]
  modifier: +15
Total: 27

Formula: 1d10+5
  d10: [7]
  modifier: +5
Total: 12
```
