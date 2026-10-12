<script lang="ts">
  import { Students } from '#lib/db/index.ts'
  import { Form } from '#lib/form.svelte.ts'
  import type { PinTypeOptions } from '#lib/db/collections/settings.ts'

  import { ArkErrors, type } from 'arktype'
  import { preventDefault } from 'svelte/legacy'

  let { pinType }: { pinType: PinTypeOptions } = $props()

  let dialogRef: HTMLDialogElement | null = $state(null)
  const schema = $derived(
    type({
      name: 'string > 0',
      pin: (() => {
        switch (pinType) {
          case 'alpha':
            return 'string > 0'
          case 'digit':
            return 'string.digits > 0'
          case '4-digit':
            return 'string.digits == 4'
          case '6-digit':
            return 'string.digits == 6'
        }
      })(),
    })
  )

  const close = () => dialogRef?.close()

  function handleDialogClick(e: MouseEvent) {
    if (e.target === dialogRef) {
      close()
    }
  }

  let form = $derived(
    new Form(schema, (values) => {
      Students.insert(values)
      close()
    })
  )
</script>

<dialog bind:this={dialogRef} onclick={handleDialogClick}>
  <h5>Add Student</h5>

  <form {@attach form.attach}>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" aria-invalid={!!form.errors.name} />
    <small>{form.errors.name}</small>

    <label for="pin">Pin</label>
    <input
      type={pinType !== 'alpha' ? 'number' : 'text'}
      name="pin"
      id="pin"
      aria-invalid={!!form.errors.pin}
    />
    <small>{form.errors.pin}</small>

    <div class="dialog-actions">
      <button type="button" onclick={close}>Cancel</button>
      <button class="primary" type="submit">Add</button>
    </div>
  </form>
</dialog>

<button onclick={() => dialogRef?.showModal()}> Add Student </button>

<style>
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>
