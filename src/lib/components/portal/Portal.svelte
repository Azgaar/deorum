<script context="module" lang="ts">
  // implementation from https://github.com/romkor/svelte-portal
  import { tick } from 'svelte';

  export function portal(el: HTMLElement, target: string | HTMLElement) {
    let targetEl;

    async function update(newTarget: string | HTMLElement) {
      target = newTarget;

      if (typeof target === 'string') {
        targetEl = document.querySelector(target);
        if (targetEl === null) {
          await tick();
          targetEl = document.querySelector(target);
        }
        if (targetEl === null) throw new Error(`No element found matching selector: "${target}"`);
      } else if (target instanceof HTMLElement) {
        targetEl = target;
      } else {
        throw new TypeError(`Unknown target type: ${target === null ? 'null' : typeof target}`);
      }

      targetEl.appendChild(el);
      el.hidden = false;
    }

    function destroy() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }

    update(target);
    return { update, destroy };
  }
</script>

<script>
  export let target = 'body';
</script>

<div aria-label="portal" aria-hidden use:portal={target} hidden>
  <slot />
</div>
