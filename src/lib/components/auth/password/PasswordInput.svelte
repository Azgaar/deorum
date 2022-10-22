<script lang="ts">
  import Textfield from '@smui/textfield';

  import { t } from '$lib/locales/translations';

  export let password: string = '';
  export let isLoading: boolean = false;

  let visible = false;
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
  <div class="visibility" on:click={() => (visible = !visible)}>👁️</div>
</Textfield>

<style lang="scss">
  div.visibility {
    position: absolute;
    right: -16px;
    padding: 1rem;
    cursor: pointer;
    user-select: none;
    font-size: 1.2rem;
  }
</style>
