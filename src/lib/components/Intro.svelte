<script>
  import { onMount } from 'svelte';
  import Header from '../content/00-header.md';
  import { Intro } from '#lib/utils/intro.js';

  let header;

  onMount(() => {
    const intro = new Intro(header);

    return () => intro.destroy();
  });
</script>

<header bind:this={header}>
  <div class="wrapper">
    <Header />
  </div>
</header>

<style lang="scss">
  header {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: 1.25em;
    height: 80vh;
    justify-content: flex-end;
    max-height: 800px;
    padding: 3em;

    .wrapper {
      max-width: 85vw;
      width: 800px;
    }

    @media screen and (orientation: portrait) {
      min-height: 60vh;
      padding: 0;
    }
  }

  :global(header canvas) {
    margin-block: 1em;
    max-width: 100%;
  }

  :global(header.intro-ready h1) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  :global(header.intro-ready h3),
  :global(header.intro-ready p) {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
</style>
