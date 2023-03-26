<script lang="ts">
  export let width: number;
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="-2 -2 20 20" {width}>
  <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
  <g transform="translate(2, 1.5) scale(.5)">
    <rect width="6" height="6" x="4" y="6" rx="1" />
    <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="14" y1="7" x2="20" y2="7" />
      <line x1="14" y1="11" x2="20" y2="11" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </g>
  </g>
</svg>
