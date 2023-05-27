<script lang="ts">
  import { t } from '$lib/locales/translations';

  const terms = {
    title: 'terms.title',
    intro: 'terms.intro',
    sections: [
      {
        title: 'terms.sections.section1.title',
        clauses: [
          {
            title: 'terms.sections.section1.clauses.clause1.title',
            content: 'terms.sections.section1.clauses.clause1.content',
            subclauses: [
              'terms.sections.section1.clauses.clause1.subclauses.subclause1',
              'terms.sections.section1.clauses.clause1.subclauses.subclause2',
              'terms.sections.section1.clauses.clause1.subclauses.subclause3'
            ]
          },
          {
            title: 'terms.sections.section1.clauses.clause2.title',
            content: 'terms.sections.section1.clauses.clause2.content'
          },
          {
            title: 'terms.sections.section1.clauses.clause3.title',
            content: 'terms.sections.section1.clauses.clause3.content'
          }
        ]
      },
      {
        title: 'terms.sections.section2.title',
        content: 'terms.sections.section2.content'
      },
      {
        title: 'terms.sections.section3.title',
        content: 'terms.sections.section3.content'
      },
      {
        title: 'terms.sections.section4.title',
        content: 'terms.sections.section4.content'
      },
      {
        title: 'terms.sections.section5.title',
        content: 'terms.sections.section5.content'
      }
    ]
  };
</script>

<main aria-label="terms of use page">
  <div class="content">
    <div>
      <h1>{$t(terms.title)}</h1>
      <p>{$t(terms.intro)}</p>
    </div>

    <ol>
      {#each terms.sections as section}
        <li>
          <h3>{$t(section.title)}</h3>

          {#if section.content}
            <p>{@html $t(section.content)}</p>
          {/if}

          {#if section.clauses}
            <ol type="a">
              {#each section.clauses as clause}
                <li>
                  <h3>{$t(clause.title)}</h3>
                  <p>{@html $t(clause.content)}</p>
                  {#if clause.subclauses}
                    {#each clause.subclauses as subclause}
                      <p>{@html $t(subclause)}</p>
                    {/each}
                  {/if}
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</main>

<style lang="scss">
  main {
    grid-area: main;
    overflow: hidden;

    padding: 24px;

    @media ($mobile) {
      padding: 0;
    }

    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      max-height: calc(100% - 24px);
      overflow-y: auto;

      padding: 24px;
      max-width: 1000px;
      background: linear-gradient(150deg, #160a05a4, #170904d9);
      border-radius: 8px;

      font-size: 0.9em;

      ol {
        padding-left: 12px;
        margin-bottom: 16px;

        li {
          margin-bottom: 8px;
        }
      }
    }
  }
</style>
