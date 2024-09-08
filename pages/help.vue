<template>

  <q-page class="q-pa-sm">
    <div class="row justify-center ">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <h3>GeoNode Help</h3>
        <q-separator />
        <br />
        <p class="text-h5">This page provides helpful information about how to use the GeoNode. You can use the sidebar links to navigate to what you want to know.</p>
        <p>The GeoNode provides access to data sets and a map editing application allows users to browse existing maps and contribute their own.</p>
        <p class="text-h6">Browsing Layers</p>
        <p>The <NuxtLink to="/catalogue/dataset">Layers</NuxtLink> tab allows you to browse data uploaded to this GeoNode. All data can be downloaded in a variety of formats, for use in other applications.</p>
        <p class="text-h6">Developer Access</p>
        <p>The <NuxtLink to="/developer">Developer</NuxtLink>Developer page is the place for developers to get started building applications against the GeoNode. It includes instructions on using the web services, links to the source code of the GeoNode, and information about the open source projects used to create it.</p>
        <p class="text-h6">Browsing Maps</p>
        <p>The GeoNode allows users to create and share maps with one another.</p>
        <p>The <NuxtLink to="/catalogue/map">Maps</NuxtLink> tab is a gateway to map exploration on GeoNode. From here you can <strong>search for a map</strong> or <strong>create a map</strong>, which will open the Map Composer.</p>
        <p class="text-bold">Google Earth Mode</p>
        <p>Any map viewed in the interactive map editor can be seen in 3D mode with the Google Earth plugin. To switch to 3D mode select the Google Earth globe logo, the rightmost button on top toolbar. If you do not have the Google Earth plugin installed you will be prompted to install it.</p>
        <p>This section in fact seems to be fake, it seems that there is no any plugin for this but is mentioned from original geonode page.</p>
        <p class="text-h6">Creating a Map</p>
        <p>To create a new map go to the <NuxtLink to="/catalogue/map">Contributed Maps</NuxtLink> tab and click the create your own map link.</p>
        <p>This will take you to the Map Composer with a base layer loaded.</p>
        <p>To add data layers from the GeoNode click on the green plus button located below the layers tab on the left hand side of the screen. This will open a dialog listing all the layers available on the GeoNode.</p>
        <p>To add layers to your map select them and hit the <strong>Add Layers</strong> button. When finished you may hit <strong>Done</strong> to close the dialog and go back to the map.</p>
        <p class="text-bold">Reordering and Removing Layers</p>
        <p>Change the display order of the layers listed in the data tab by simply dragging and dropping their names. The order in the map will be updated to reflect that. To turn a layer's visibility off simply uncheck it, and to remove it entirely select it and hit the red minus button.</p>
        <p class="text-bold">Saving your map</p>
        <p>Once a suitable set of layers and zoom level has been found it's time to save it so others can see it. Click the Save button--the left most icon on the top toolbar, an image of a map with a disk--on the top menu and fill out the title and abstract of the map.</p>
        <p class="text-h6">Publishing a Map</p>
        <p>Any map from the GeoNode can be embedded for use in another site or blog. To publish a map:</p>
        <ol>
          <li>Select the from the list of maps on the community or map page and then hit the 'Publish map' button.</li>
          <li>Choose your desired height and width for the widget in the wizard.</li>
          <li>Copy the HTML snippet provided in the wizard to any HTML page or iFrame-supporting blog post. This will put an interactive widget showing you map in your web page or blog post.</li>
        </ol>
        <p>Note that the Map Composer also has a button to publish the map. Just be sure to save the map before publishing if there are changes that you want others to see. It publishes the last saved version, not the last viewed version.</p>
        <p class="text-h6">Remixing a Map</p>
        <p>Any map available can serve as a starting point for a new map.</p>
        <ol>
          <li>Open the map in the Map Composer.</li>
          <li>Add and remove layers as you like.</li>
          <li>Pan and zoom to highlight the area of interest.</li>
          <li><strong>IMPORTANT</strong>: Update the title, abstract, contact info and tags to reflect the new map.</li>
          <li>Save the map.</li>
        </ol>
        <p>You will be able to see your new map when you search for it from the <NuxtLink to="/catalogue/map">Maps</NuxtLink> tab.</p>
      </div>
    </div>
  </q-page>
</template>
