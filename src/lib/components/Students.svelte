<script lang="ts">
  import { Students, Settings } from '#lib/db/index.ts'
  import StudentModal from './StudentModal.svelte'

  let students = $derived(Students.find({}).fetch())

  let pinType = $derived(await Settings.getSetting('pinType'))
</script>

<StudentModal {pinType} />

<section class="table zebra">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Pin</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each students as student}
        <tr>
          <td>{student.name}</td>
          <td>{student.pin}</td>
          <td>
            <button onclick={() => Students.removeOne({ id: student.id })}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>
