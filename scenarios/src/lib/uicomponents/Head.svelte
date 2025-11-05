<script>
    import { config } from "$lib";
</script>

<svelte:head>
    <link rel="icon" href={`https://${config.domain}/favicon.svg`} />
    <link rel="me" href="https://chaos.social/@arrrrrmin" />
    <link rel="canonical" href={`https://${config.domain}`} />
    <meta name="fediverse:creator" content="@arrrrrmin@chaos.social" />
    <meta name="description" content={config.description} />
    <meta name="author" content="Armin Müller-von Fischer (arrrrrmin)" />
    <meta name="language" content="de" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={config.title} />
    <meta property="og:description" content={config.description} />
    <meta property="og:url" content={`https://${config.domain}`} />
    <meta
        property="og:image"
        content={`https://${config.domain}/web-app-manifest-512x512.png`}
    />
    <meta name="theme-color" content="#C70036" />
</svelte:head>
