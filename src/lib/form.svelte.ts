import { ArkErrors, type Type } from 'arktype'

type FormErrors<S extends Type> = Partial<Record<Extract<keyof S['infer'], string> | '', string>>

export class Form<S extends Type> {
  errors: FormErrors<S> = $state({})
  submitting = $state(false)
  private element?: HTMLFormElement

  constructor(
    public schema: S,
    private onSubmit: (data: S['infer']) => unknown
  ) {}

  attach = (element: HTMLFormElement) => {
    this.element = element
    element.addEventListener('submit', this.handleSubmit)
    return () => {
      element.removeEventListener('submit', this.handleSubmit)
      this.element = undefined
    }
  }

  private handleSubmit = async (e: SubmitEvent) => {
    console.debug('Form.handleSubmit', e)
    console.log('Form.handleSubmit', this.schema)
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    const result = this.schema(data)
    console.debug('Form.handleSubmit', e, 'result', result)

    if (result instanceof ArkErrors) {
      this.errors = Object.fromEntries(
        Object.entries(result.byPath).map(([path, error]) => [path, error.message])
      ) as FormErrors<S>
      return
    }

    this.errors = {}
    this.submitting = true
    try {
      await this.onSubmit(result)
      this.element?.reset()
    } catch (e) {
      this.errors = { '': e instanceof Error ? e.message : String(e) } as FormErrors<S>
    } finally {
      this.submitting = false
    }
  }
}
