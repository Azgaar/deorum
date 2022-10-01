<script lang="ts">
  export let quality: number;
  export let onChange = (_: number) => {};

  const values = Array(11)
    .fill(0)
    .map((_, i) => i);

  const handleChange = (value: number) => () => {
    onChange(value);
  };
</script>

<div class="quality">
  {#each values as value}
    <button class:active={value <= quality} on:click={handleChange(value)}>
      <span class:current={value === quality}>{value}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  .quality {
    display: flex;
    margin-left: 2px;
    height: 22px;

    button {
      width: 20px;

      cursor: pointer;
      color: $text;
      background-color: rgba($surface, 0.3);
      border: none;
      transition: all 0.2s ease-in-out;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: small;

      span {
        pointer-events: none;
      }

      span:not(.current) {
        opacity: 0;
      }
    }

    .active {
      background-color: rgba($surface, 0.35);
    }

    button:hover {
      background-color: rgba($surface, 0.4);

      span:not(.current) {
        opacity: 0.5;
      }
    }

    button:first-child {
      border-radius: 16px 0 0 16px;
    }

    button:last-child {
      border-radius: 0 16px 16px 0;
    }
  }
</style>
