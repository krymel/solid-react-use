import { render } from '@solidjs/testing-library'
import { useDomId } from './useDomId'

describe('useDomId', () => {
  it('can generate and render a DOM id', async() => {
    expect(useDomId).toBeInstanceOf(Function)

    const { queryByRole, unmount } = render(() => () => {
      const domId = useDomId()
      expect(domId).toBeDefined()
      expect(domId.indexOf('-')).toBeGreaterThan(-1)
      return (
        <>
          <input type="text" role={"textbox"} id={domId} />
          <label role={"definition"} for={domId}>Some label</label>
        </>
      )
    })
    const label = (await queryByRole("definition")) as HTMLDivElement
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute("for", "cl-0")

    const input = (await queryByRole("textbox")) as HTMLDivElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("id", "cl-0")
    unmount()
  })
})
