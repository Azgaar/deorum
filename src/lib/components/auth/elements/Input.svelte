<script lang="ts">
  import EyeOpen from '$lib/components/icons/EyeOpen.svelte';
  import EyeClosed from '$lib/components/icons/EyeClosed.svelte';

  export let label: string;
  export let type: 'text' | 'email' | 'password';
  export let value: string;
  export let placeholder: string;
  export let disabled: boolean;
  export let required: boolean;
  export let minlength: number | undefined = undefined;

  let input: HTMLInputElement;
  let isPasswordVisible = false;
  const toggleVisibility = () => {
    isPasswordVisible = !isPasswordVisible;
    typeAction(input);
  };

  function typeAction(node: HTMLInputElement) {
    node.type = type === 'password' && isPasswordVisible ? 'text' : type;
  }
</script>

<label class="label">
  <span class="label-text">{label}</span>
  <input
    bind:this={input}
    use:typeAction
    bind:value
    {placeholder}
    {disabled}
    {required}
    {minlength}
  />

  {#if type === 'password'}
    <div class="visibility" on:click={toggleVisibility} on:keydown={toggleVisibility}>
      {#if isPasswordVisible}
        <EyeClosed />
      {:else}
        <EyeOpen />
      {/if}
    </div>
  {/if}
</label>

<style lang="scss">
  label {
    position: relative;
    font-weight: 300;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    input {
      background: none;
      border: none;
      border-bottom: 1px solid rgb($text, 0.4);
      outline: none;
      color: $text;

      width: 100%;
      height: 28px;
      text-indent: 6px;
    }

    div.visibility {
      position: absolute;
      right: -14px;
      bottom: -5px;

      padding: 1rem;
      width: 14px;
      height: 14px;

      cursor: pointer;
      user-select: none;
    }
  }
</style>
