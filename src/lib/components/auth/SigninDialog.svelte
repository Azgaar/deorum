<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';

  import { t } from '$lib/locales/translations';
  import { signin } from '$lib/api/auth';

  export let open: boolean;

  let email = '';
  let password = '';
  let isAdmin = false;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    await signin({ isAdmin, email, password });
  };
</script>

<Dialog bind:open aria-labelledby="signin-dialog" aria-describedby="signin-dialog">
  <Title>{$t('common.auth.signinTitle')}</Title>

  <form on:submit={handleSubmit}>
    <div class="body">
      <Textfield
        required
        type="email"
        updateInvalid
        bind:value={email}
        label={$t('common.auth.email')}
        input$autocomplete="email"
      />

      <Textfield
        required
        type="password"
        updateInvalid
        bind:value={password}
        label={$t('common.auth.password')}
        input$autocomplete="password"
        input$pattern={'.{8,}'}
      />

      <FormField>
        <Checkbox bind:checked={isAdmin} />
        <span slot="label">
          {$t('common.auth.signinAsAdmin')}
        </span>
      </FormField>
    </div>

    <Actions>
      <Button type="button" style="color: white" on:click={() => (open = false)}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>

      <button type="submit">{$t('common.auth.signin')}</button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  div.body {
    width: min(300px, 90vw);
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button {
    font-family: Roboto, sans-serif;
    font-size: 0.875rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: white;
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>
