<template>
  <article class="content-container">
    <h1>HALLO verwerking nummer {{ $route.params.id }}!</h1>

    <div class="summary-box box-top">
      <div class="inner-box">
        <h2 class="visually-hidden">samenvatting</h2>
        <dl>
          <div>
            <dt>Categorie</dt>
            <dd/>
          </div>
          <div>
            <dt>Verwerkende dienst</dt>
            <dd/>
          </div>
          <div>
            <dt>Rechtmatigheid</dt>
            <dd/>
          </div>
        </dl>
        <div class="accolade "/>
      </div>
    </div>

    <h2>Beschrijving</h2>

    <h2>Gegevens</h2>
    <h3>Over wie?</h3>
    <h3>Welke persoonsgegevens?</h3>
    <ul>
      <li/>
      <li/>
      <li/>
    </ul>
    <h3>Welke gevoelige persoonsgegevens?</h3>
    <ul>
      <li/>
      <li/>
      <li/>
    </ul>
    <h2>Rechtmatigheid</h2>
    <h3>Type</h3>
    <h3>Verduidelijking</h3>
    <h2>Ontvangers</h2>
    <h2>Bewaartermijn</h2>

  </article>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.$route.params.id} | verwerkingsregister`
    }
  },
  meta: {
    breadcrumbs: [{ label: "verwerkingsregister", path: "/" }]
  }
}
</script>
