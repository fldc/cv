<script>
  import '$lib/styles/global.scss';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;400;600&display=swap"
    rel="stylesheet"
  />
  <noscript>
    <style>
      .wrapper {
        opacity: 1 !important;
        transform: none !important;
      }
    </style>
  </noscript>
</svelte:head>

{@render children()}
