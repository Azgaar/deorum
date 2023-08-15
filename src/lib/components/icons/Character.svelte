<script lang="ts">
  export let width: number;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  viewBox="0 0 200 200"
  {width}
>
  <circle stroke="currentColor" stroke-width="8" fill="none" cx="100" cy="100" r="75" />
  <path
    transform="translate(25 25) scale(1.5)"
    d="M26,70a4,4,0,0,0,8,0,16,16,0,0,1,32,0,4,4,0,0,0,8,0A24,24,0,0,0,61.57,49a16,16,0,1,0-23.14,0A24,24,0,0,0,26,70ZM42,38a8,8,0,1,1,8,8A8,8,0,0,1,42,38Z"
  />
</svg>
