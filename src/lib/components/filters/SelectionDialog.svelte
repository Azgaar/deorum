<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import Picture from '$lib/components/picture/Picture.svelte';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let isOpen: boolean;
  export let type: 'image' | 'text';
  export let title: string;
  export let translationPath: string;
  export let key: 'name' | 'id' = 'id';
  export let data: { id: string; name: string; image?: string }[];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;
  export let columns: number;

  let searchQuery = '';
  const search = (query: string, text: string) =>
    query && new RegExp(query, 'i').test(text) === false;

  const handleCancel = () => {
    isOpen = false;
    searchQuery = '';
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const current = Array.from(formData.keys());

    onSubmit(current);
    handleCancel();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    <div class="title">
      <span>{title}</span>
      <input type="search" bind:value={searchQuery} placeholder={$t('common.controls.search')} />
    </div>
  </DialogHeader>

  <form name="selection dialog" on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        <div class="grid" style="grid-template-columns: repeat({columns}, 1fr);">
          {#each data as element (element.id)}
            {#if type === 'image' && element.image}
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label
                class="imageElement"
                class:filtered={search(searchQuery, $t(`${translationPath}.${element.name}`))}
                use:tooltip
                title={$t(`${translationPath}.${name}`)}
              >
                <Picture src={element.image} alt={element.name} />
                <div class="checkbox">
                  <Checkbox name={element[key]} checked={selected.includes(element[key])} />
                </div>
              </label>
            {:else}
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label
                class="textElement"
                class:filtered={search(searchQuery, $t(`${translationPath}.${element.name}`))}
              >
                <Checkbox name={element[key]} checked={selected.includes(element[key])} />
                <div>
                  {#if element.image}
                    <img src={element.image} alt={element.name} />
                  {/if}
                  <span>{$t(`${translationPath}.${element.name}`)}</span>
                </div>
              </label>
            {/if}
          {/each}
        </div>
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    input[type='search'] {
      outline: none;
      height: 26px;
      border: none;
      border-bottom: 1px solid black;
      background: #26262b;
      color: white;
      border-radius: 2px;
      text-indent: 4px;
    }
  }

  form {
    width: min(500px, 80vw);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.content {
      max-height: min(580px, 75vh);
      overflow-y: auto;

      div.grid {
        display: grid;
        align-items: start;
        grid-gap: 3px;

        @media ($mobile) {
          grid-gap: 1px;
        }

        label {
          position: relative;
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;

          &.filtered {
            opacity: 0.2;
          }

          &.imageElement {
            .checkbox {
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }

          &.textElement {
            display: flex;
            align-items: center;
            gap: 4px;

            > div {
              display: flex;
              align-items: center;
              gap: 4px;

              img {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
</style>
