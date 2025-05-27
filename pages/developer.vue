<template>

  <q-page class="q-pa-sm">
    <div class="row justify-center ">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <h3>Information for Developers</h3>
        <q-separator/>
        <br/>
        <p class="text-h5">Useful information for developers interested in GeoNode.</p>
        <p><a href="https://geonode.org" target="_blank">GeoNode</a> is an open service built on open source software.
          We encourage you to build new applications using the components and resources it provides. This page is a
          starting point for developers interesting in taking full advantage of GeoNode. It also includes links to the
          project's source code so anyone can build and customize their own GeoNode.</p>
        <p class="text-h6">GeoNode Software</p>
        <p>All the code that runs GeoNode is open source. The code is available at <a
            href="https://github.com/GeoNode/geonode" target="_blank">https://github.com/GeoNode/geonode</a>. The issue
          tracker for the project is at <a href="https://github.com/GeoNode/geonode/issues" target="_blank">https://github.com/GeoNode/geonode/issues</a>.
        </p>
        <p>GeoNode is built using several open source projects, each with its own community. If you are interested in
          contributing new features to the GeoNode, we encourage you to do so by contributing to one of the projects on
          which it is built:</p>
        <ul>
          <li><a href="http://geoserver.org" target="_blank">GeoServer</a> - Standards based server for geospatial
            information
          </li>
          <li><a href="http://geowebcache.org" target="_blank">GeoWebCache</a> - Cache engine for WMS Tiles</li>
          <li><a href="http://openlayers.org" target="_blank">OpenLayers</a> - Pure JavaScript library powering the
            visualization maps
          </li>
          <li><a href="http://pycsw.org" target="_blank">pycsw</a> - CSW, OpenSearch and OAI-PMH metadata catalogue
            server
          </li>
        </ul>
        <p class="text-h6">What are OGC Services?</p>
        <p>The data in this application is served using open standards endorsed by ISO and the <a
            href="http://opengeospatial.org/" target="_blank">Open Geospatial Consortium</a>; in particular, WMS (Web
          Map Service) is used for accessing maps, WFS (Web Feature Service) is used for accessing vector data, and WCS
          (Web Coverage Service) is used for accessing raster data. WMC (Web Map Context Documents) is used for sharing
          maps. You can use these services in your own applications using libraries such as OpenLayers, GeoTools, and
          OGR (all of which are open-source software and available at zero cost). Additionally, CSW (Catalog Service for
          the Web) supports access to collections of descriptive information (metadata) about data and services.</p>
        <p class="text-h6">What is GeoWebCache?</p>
        <p>GeoWebCache provides mapping tiles that are compatible with a number of mapping engines, including Google
          Maps, Bing Maps and OpenLayers. All the data hosted by GeoNode is also available through GeoWebCache.
          GeoWebCache improves on WMS by caching data and providing more responsive maps.</p>
        <p class="text-h6">CSW Example Code</p>
        <p>To interact with GeoNode's CSW you can use any CSW client (QGIS MetaSearch, GRASS, etc.). The following
          example illustrates a simple invocation using the OWSLib Python package:</p>
        <pre class="custom-code">
<code>
<span class="keyword">from</span> owslib.csw <span class="keyword">import</span> CatalogueServiceWeb
<span class="keyword">from</span> owslib.fes <span class="keyword">import</span> PropertyIsLike
csw = <span class="class-name">CatalogueServiceWeb</span>(<span class="string">'{{config.public.NUXT_PUBLIC_GEONODE_BASEURL}}/catalogue/csw'</span>)
anytext = <span class="class-name">PropertyIsLike</span>(<span class="string">'csw:AnyText'</span>, <span class="string">'birds'</span>)
csw.getrecords2(constraints=[anytext])
<span class="keyword">print</span>(csw.results)
<span class="keyword">print</span>(csw.records)</code>
        </pre>
        <p class="text-h6">OpenLayers Example Code</p>
        <p>To include a GeoNode map layer in an OpenLayers map, first find the name for that layer. This is found in the layer's <code class="bg-grey-4 q-px-xs">name</code> field (not <code class="bg-grey-4 q-px-xs">title</code>) of the layer list. For this example, we will use the Nicaraguan political boundaries background layer, whose name is <code class="bg-grey-4 q-px-xs">risk:nicaragua_admin</code>. Then, create an instance of OpenLayers.Layer.WMS:</p>
        <pre class="custom-code">
<code>
let geonodeLayer = new <span class="class-name">OpenLayers.Layer.WMS</span>(
    <span class="string">"GeoNode Risk Data"</span>,
    <span class="string">"{{config.public.NUXT_PUBLIC_GEONODE_BASEURL}}/geoserver/wms"</span>,
    {layers: <span class="string">"risk:nicaragua_admin"</span>}
  );</code>
        </pre>
        <p class="text-h6">Google Maps Example Code</p>
        <p>To include a GeoNode map layer in a Google Map, include the dataset name in the URL template.</p>
        <pre class="custom-code">
<code>
const tileUrl = <span class="string">"{{config.public.NUXT_PUBLIC_GEONODE_BASEURL}}/geoserver/gwc/service/gmaps?layers=risk:nicaragua_admin&zoom={Z}&x={X}&y={Y}"</span>;
let tilelayer = new <span class="class-name">GTileLayer</span>(null, null, null, {tileUrlTemplate: tileUrl});</code>
        </pre>
        <p class="text-h6">Shapefile/GeoJSON/GML Output</p>
        <p>To get data from the GeoNode web services use the WFS protocol. For example, to get the full Nicaraguan admin boundaries use:</p>
        <p><code class="bg-grey-4 q-px-xs">{{config.public.NUXT_PUBLIC_GEONODE_BASEURL}}/geoserver/wfs?request=GetFeature&typeName=risk:nicaragua_admin&outputformat=SHAPE-ZIP</code></p>
        <p>Changing output format to <code class="bg-grey-4 q-px-xs">json</code>, <code class="bg-grey-4 q-px-xs">GML2</code>, <code class="bg-grey-4 q-px-xs">GML3</code>, or <code class="bg-grey-4 q-px-xs">csv</code> will get data in those formats. The WFS protocol also can handle more precise queries, specifying a bounding box or various spatial and non-spatial filters based on the attributes of the data.</p>
        <p class="text-h6">GeoTools Example Code</p>
        <p>Create a DataStore and extract a FeatureType from it, then run a Query. It is all documented on the wiki at <a href="https://geotools.org" target="_blank">https://geotools.org</a>.</p>

      </div>
    </div>


  </q-page>

</template>


<script setup lang="ts">
// Remember to disable the middleware protection from your page!
/*
definePageMeta({
  auth: {unauthenticatedOnly: true, navigateAuthenticatedTo: '/'}
})
*/
const config = useRuntimeConfig()
// const headers = useRequestHeaders(['cookie']) as HeadersInit
const {signIn, getProviders} = useAuth()
const providers = await getProviders()

const {getSession, data} = useAuth()

const authStore = useAuthStore()

const {
  status,
  loading,
  lastRefreshedAt
} = useAuthState()

// const {data: token} = await useFetch('/api/token', {headers})
</script>

<style scoped>
.custom-code {
  padding-left: 16px;
  background-color: #f5f5f5;
  font-family: 'Courier New', Courier, monospace;
}

.custom-code .keyword {
  color: #d73a49;
  font-weight: bold;
}

.custom-code .class-name {
  color: #6f42c1;
}

.custom-code .string {
  color: #005dd4;
}
</style>