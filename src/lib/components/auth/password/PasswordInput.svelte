<script lang="ts">
  import Textfield from '@smui/textfield';
  import EyeOpen from '$lib/components/icons/EyeOpen.svelte';
  import EyeClosed from '$lib/components/icons/EyeClosed.svelte';
  import { t } from '$lib/locales/translations';

  export let password: string = '';
  export let isLoading: boolean = false;

  let visible = false;
  const toggle = () => (visible = !visible);
</script>

<Textfield
  required
  type={visible ? 'text' : 'password'}
  updateInvalid
  bind:value={password}
  disabled={isLoading}
  label={$t('common.auth.password')}
  input$autocomplete="password"
  input$pattern={'.{8,}'}
>
  <div class="visibility" on:click={toggle} on:keydown={toggle}>
    {#if visible}
      <EyeClosed />
    {:else}
      <EyeOpen />
    {/if}
  </div>
</Textfield>

<style lang="scss">
  div.visibility {
    position: absolute;
    right: -16px;
    top: 10px;
    padding: 1rem;

    cursor: pointer;
    user-select: none;
    width: 14px;
    height: 14px;
  }
</style>
