<script lang="ts">
  export let width: number;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  stroke="currentColor"
  stroke-width="14"
  stroke-linecap="round"
  stroke-linejoin="round"
  viewBox="0 0 256 256"
  {width}
>
  <circle cx="128" cy="128" r="96" />
  <polyline points="176 211.2 176 176 128 72 80 176 80 211.2" />
  <path d="M128,192a24,24,0,0,1,48,0" />
  <path d="M128,224V192a24,24,0,0,0-48,0" />
  <line x1="102.2" y1="128" x2="153.8" y2="128" />
</svg>
