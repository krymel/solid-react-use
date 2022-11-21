import { createRoot, createSignal, createEffect, Accessor, createMemo } from 'solid-js'

// TODO: try the vitest! https://github.com/solidjs/templates/tree/master/ts-vitest/src

const loremIpsumWords =
  'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.split(
    /\s+/,
  )

const createLorem = (words: Accessor<number> | number) => {
  return createMemo(() => {
    const output = [],
      len = typeof words === 'function' ? words() : words
    while (output.length <= len) {
      output.push(...loremIpsumWords)
    }

    return output.slice(0, len).join(' ')
  })
}

describe('useCallback', () => {
  it('updates the result when words update', async () => {
    const input = [3, 2, 5],
      expectedOutput = ['Lorem ipsum dolor', 'Lorem ipsum', 'Lorem ipsum dolor sit amet,']

    const actualOutput = await new Promise<string[]>((resolve) =>
      createRoot((dispose) => {
        const [words, setWords] = createSignal(input.shift() ?? 3)
        const lorem = createLorem(words)

        const output: string[] = []
        createEffect(() => {
          // effects are batched, so the escape condition needs
          // to run after the output is complete:
          if (input.length === 0) {
            dispose()
            resolve(output)
          }
          output.push(lorem())
          setWords(input.shift() ?? 0)
        })
      }),
    )

    expect(actualOutput).toEqual(expectedOutput)
  })
})
