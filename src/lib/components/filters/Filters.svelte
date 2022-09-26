<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  export let open: boolean;
  export let filter: string;
  export let sort: string;
  export let onSubmit: (sort: string, filter: string) => void;

  const handleCancel = () => {
    open = false;
  };

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newFilter = formData.get('filter') as string;
    const newSort = formData.get('sort') as string;

    if (newFilter !== filter || newSort !== sort) {
      onSubmit(newFilter, newSort);
    }
  };
</script>

<Dialog class="filters" bind:open aria-labelledby="filters" aria-describedby="filters">
  <div class="title">Filter images</div>

  <form class="body" on:submit={handleApply}>
    <div class="content">
      <div class="inputLine">
        <span>Filter string:</span>
        <input name="filter" type="text" value={filter} />
      </div>
      <div class="description">
        Filter the returned records. The syntax follows the format: FIELD OPERATOR VALUE. Operators
        are <code>=</code> (equals), <code>!=</code> (not equals),
        <code>&gt;</code> (greater than), <code>&lt;</code> (less than), <code>&lt;=</code> (greater
        than or equal to),
        <code>&lt;=</code> (less than or equal to), <code>&&</code> (and), <code>||</code> (or),
        <code>~</code> (contains), or <code>!~</code> (not contains). Example:
        <code>original.name='joy' && quality&gt;7</code>
      </div>

      <div class="inputLine">
        <span>Sort string:</span>
        <input name="sort" type="text" value={sort} />
      </div>
      <div class="description">
        Specify the records order. Add <code>-</code> / <code>+</code> in front of the attribute for
        DESC / ASC order. Example: <code>-created,id</code>
      </div>

      <div>
        <span>Fields:</span>
      </div>
      <div class="description">
        Available fields are <code>active</code> (true or false), <code>original.name</code>
        (string),
        <code>quality</code> (number), <code>tags.name</code>, <code>styles.name</code> and
        <code>colors</code> (string, use <code>~</code> contains or <code>!~</code> not contains
        operators),
        <code>created</code> and <code>updated</code> (date)
      </div>
    </div>

    <Actions>
      <Button type="button" style="color: white" on:click={handleCancel}>
        <Label>Cancel</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>Apply</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  div.title {
    display: flex;
    align-items: center;
    margin-left: 31px;
    height: 48px;
    font-size: large;
  }

  div.content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 2rem;

    div.description {
      font-size: 0.9rem;
      padding: 0.5rem;
      background-color: #26262b;
      border-radius: 4px;
      line-height: 1.5;
      margin-bottom: 1rem;

      code {
        background-color: #1f1f1f;
        padding: 1px 5px;
        border-radius: 4px;
      }
    }

    div.inputLine {
      display: grid;
      grid-template-columns: 1fr 4fr;
      gap: 0.3rem;
      align-items: center;
    }

    input {
      outline: none;
      height: 26px;
      border: none;
      border-bottom: 1px solid black;
      background: #26262b;
      color: $text;
      border-radius: 2px;
      text-indent: 4px;
    }
  }
</style>
