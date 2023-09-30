<script lang="ts">
  import type { PageData } from './$types';

  export let data: [string, number][];

  const maxNumber = Math.max(...data.slice(0, 24).map(([_, created]) => created));

  const BAR_WIDTH = 20;
  const BAR_GAP = 5;
  const BAR_SPACE = BAR_WIDTH + BAR_GAP;

  const WIDTH = data.length * BAR_SPACE;
  const HEIGHT = 260;
</script>

<div class="chartBody">
  <svg width={WIDTH} height={HEIGHT}>
    {#each data as [date, createdNumber], index}
      <g>
        <rect
          class="bar"
          x={index * BAR_SPACE}
          y={HEIGHT - (createdNumber / maxNumber) * HEIGHT}
          width={BAR_WIDTH}
          height={(createdNumber / maxNumber) * HEIGHT}
        />
        <text class="label" x={index * BAR_SPACE + BAR_WIDTH / 2} y={HEIGHT - 5}>
          {createdNumber}
        </text>
      </g>
    {/each}
  </svg>
</div>

<style lang="scss">
  .chartBody {
    overflow-x: auto;

    svg {
      .bar {
        fill: $background;
      }

      .label {
        fill: $text;
        font-size: 12px;
        text-anchor: middle;
      }
    }
  }
</style>
