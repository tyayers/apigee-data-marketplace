<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { appService } from "$lib/app-service";
  import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
  import type { DataProduct } from "$lib/interfaces";
  export let data: PageServerData;

  let products: DataProduct[] = appService.products;
  let product: DataProduct | undefined = undefined;
  
  let selectedProductTab = "overview";

  let newTab = $page.url.searchParams.get('tab')
  if (newTab) selectedProductTab = newTab;

  let appSubscriptions: string[] = [];
  let apiKey: string = "";

  let previewDataOpen: boolean = false;
  let apiDocOpen: boolean = false;

  onMount(async () => {
    
    document.addEventListener("cancelEvent", () => {
      previewDataOpen = false;
      apiDocOpen = false;
    });

    document.addEventListener("appsUpdated", () => {
      refreshApps();
    });

    document.addEventListener("productsUpdated", () => {
      products = appService.products;
      loadProduct();
      apiDocOpen = false;
    });

    products = appService.products;
    loadProduct();

    refreshApps();
  });

  function loadProduct() {
    if (products.length > 0 && !product) {
      product = products.find(prod => prod.productName === data.productId);
    }
  }

  function refreshApps() {
    if (appService.apiApps && appService.apiApps.apps) {
      var newAppSubscriptions = appSubscriptions;
      for (let app of appService.apiApps.apps) {
        let productName: string = "";
        if (product && product.productName) productName = product.productName;
        if (app.apiProducts && app.apiProducts.includes(productName)) {
          newAppSubscriptions.push(app.name);
          if (!apiKey && app.credentials && app.credentials.length > 0) apiKey = app.credentials[0].consumerKey;
        }
      }

      appSubscriptions = newAppSubscriptions;
    }
  }

  function back() {
    history.back();
  }

  function setSelectedProductTag(tabName: string) {
    selectedProductTab = tabName;
    const newUrl = new URL($page.url);
    newUrl?.searchParams?.set('tab', tabName);
    goto(newUrl, { replaceState: true });
  }
</script>

<div class="product_header">
  
  <button class="back_button" on:click={back}>
    <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
  </button>

  <span class="product_title">Product details</span>
</div>

<div class="product_overview">
  <div class="product_overview_icon">

    {#if product?.imageUrl}
      <img height="62px" alt="Product" src={product?.imageUrl} />
    {:else}
      <img height="62px" alt="Product" src="https://static-00.iconduck.com/assets.00/bigquery-icon-512x512-fxxj0xd6.png" />
    {/if}
  </div>
  <div class="product_overview_details">
    <h2>{product?.productName}</h2>
    <div class="product_overview_owner">{product?.audiences?.join(", ")}</div>
    <div class="product_overview_description">
      {product?.productDescription}
    </div>

    <div class="product_overview_buy">
      {#if product?.protocols.includes("API") || product?.protocols.includes("Event")}
        <a href={"/apps/api/new?product=" + product?.productName} class="rounded_button_filled">Subscribe to API</a>
      {/if}
      {#if product?.audiences.includes("Analytics hub")}
        <a href={"/apps/bigquery/new?product=" + product?.productName} class="rounded_button_filled">
          <svg width="25" height="25" style="position: relative; top: 7px; left: -6px;" class="sobti"
          ><g fill="none" fill-rule="evenodd"
            ><path
              d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z"
              fill="#4285F4"
            /><path
              d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z"
              fill="#34A853"
            /><path
              d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z"
              fill="#FBBC05"
            /><path
              d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z"
              fill="#EA4335"
            /></g
          ></svg>  
          Subscribe on Analytics Hub
        </a>
      {/if}
      {#if product?.protocols.includes("Data sync")}
        <a href={"/apps/buckets/new?product=" + product?.productName} class="rounded_button_filled">Enable data sync</a>
      {/if}      
      <button class="rounded_button_outlined" on:click|stopPropagation={()=>{previewDataOpen=!previewDataOpen}}>Preview data</button>
    </div>

    {#if appSubscriptions.length > 0}
      <div class="product_overview_description">
        Already subscribed in:
        {#each appSubscriptions as sub, i}
          <a class="sub_link" href={"/apps/api/" + sub}>{sub}</a>
        {/each}
      </div>
    {/if}

  </div>

</div>

<div class="product_tab_menu">
  <button on:click={() => setSelectedProductTag("overview")} class={selectedProductTab == "overview" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Overview</button>
  <button on:click={() => setSelectedProductTag("pricing")} class={selectedProductTab == "pricing" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Pricing</button>
  <button on:click={() => setSelectedProductTag("documentation")} class={selectedProductTab == "documentation" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>API Documentation</button>
  <button on:click={() => setSelectedProductTag("support")} class={selectedProductTab == "support" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Support</button>
  <button on:click={() => setSelectedProductTag("related")} class={selectedProductTab == "related" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Related products</button>
</div>

<div class="product_tab_content">
  {#if selectedProductTab == "overview"}
    <div class="product_tab_content_inner">
      <h3>Overview</h3>
      <div class="product_tab_content_text">
        {product?.productDescription}
      </div>
      <h3>SLA</h3>
      <div class="product_tab_content_text">
        This API has a 99.99% availability within the provided regions (EU, UK).
      </div>
    </div>
  {:else if selectedProductTab == "documentation"}
    <div>
      {#if product?.protocols.includes("API") && product?.specUrl}
        <button class="api_maximize_button" title="Maximize window" on:click|stopPropagation={()=>{apiDocOpen=!apiDocOpen}}>
          <svg style="width: 34px; height: 34px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 7H14M17 7V10M17 7L13.5 10.5M7 17H10M7 17V14M7 17L10.5 13.5" stroke="var(--light-gray-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 7H10M7 7V10M7 7L10.5 10.5M17 17H14M17 17V14M17 17L13.5 13.5" stroke="var(--light-gray-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="var(--light-gray-color)" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>        
        </button>
        <rapi-doc
          spec-url={product?.specUrl}
          show-header = 'false'
          show-info = 'true'
          bg-color = "#fafafa"
          nav-bg-color = '#f3f3f3'
          primary-color = "#3367d6"
          api-key-name = 'apikey'
          api-key-location = 'query'
          api-key-value = {apiKey}
          allow-authentication ='true'
          allow-server-selection = 'false'
          allow-api-list-style-selection ='false'
          allow-search = "false"
          allow-advanced-search = "false"
          theme = 'light'
          render-style = "focused"
          style = {{ textAlign: "left" }}
          data-reveal-delay="200"
          class="blue_text"
        > </rapi-doc>
      {:else if product?.protocols?.includes("Evet")}
        <!-- svelte-ignore a11y-missing-attribute -->
        <iframe style="width: 100%; height: 1000px; border: 0px;" src={product?.specUrl}></iframe>
      {/if}

    </div>
  {:else if selectedProductTab == "pricing"}
    <div class="product_tab_content_inner">
      <h3>Pricing</h3>
      <div class="product_tab_content_text">
        All of our APIs use a simple, customer-friendly consumption model to sample for free, and pay in easy-to-use 
        levels.
      </div>
      <div>
        <table class="flat_table" style="max-width: 900px; color: #555;">
          <thead>
              <tr>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Range</th>
              </tr>
          </thead>
          <tbody>
            {#if product?.pricing}
              {#each product?.pricing as price_tier}
                <tr>
                  <td>{price_tier.tier}</td>
                  <td>{price_tier.price}</td>
                  <td>{price_tier.range}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
    {:else if selectedProductTab == "support"}
      <div class="product_tab_content_inner">
        <h3>Support</h3>
        <div class="product_tab_content_text">
          You can reach our support forums and support channels in our support portal.
        </div>
      </div>
  {/if}
</div>

{#if previewDataOpen}
  <div class="preview_data">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="preview_data_content" on:click|stopPropagation={()=>{}}>
      <div style="display: flex;">
        <h3 style="position: relative; top: -4px; left: 6px;">Preview data</h3>
        <button class="rounded_button_outlined" style="margin-left: 26px; height: 39px; font-size: 12px">Download CSV</button>
      </div>

      <div style="position: absolute; right: 10px; top: 24px;">
        <button on:click={() => { previewDataOpen=false }} class="text_button">Close</button>
      </div>
      <div style="position: absolute; top: 70px; bottom: 10px; overflow: auto; width: 97%;">
        <table class="flat_table" style="font-size: 12px;">
          <thead>
              <tr>
                  <th>CFICode</th>
                  <th>LastPx</th>
                  <th>MaturityDate</th>
                  <th>OrderID</th>
                  <th>Quantity</th>
                  <th>SenderCompID</th>
                  <th>SendingTime</th>
                  <th>StrikePrice</th>
                  <th>Symbol</th>
                  <th>TargetCompID</th>
                  <th>TradeDate</th>
                  <th>TradeReportID</th>
                  <th>TransactTime</th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
            <tr>
              <td>MMMXXX</td>
              <td>2951.125</td>
              <td>1.589822511856E9</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965</td>
              <td>1</td>
              <td>MDOC</td>
              <td>1.589822451E9</td>
              <td>2952.125</td>
              <td>ESM0</td>
              <td>MOMOES-COMPID</td>
              <td>2020-05-18</td>
              <td>c772eb18-85d2-4cdd-aede-1749af6aa965-0</td>
              <td>1.589822451856E9</td>
            </tr>
          </tbody>
        </table>  
      </div>

    </div>
  </div>
{/if}

{#if apiDocOpen}
  <div class="preview_data">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="preview_data_content" on:click|stopPropagation={()=>{}}>
      <div style="display: flex;">
        <h3 style="position: relative; top: -4px; left: 6px;">API Documentation</h3>
        <button class="rounded_button_outlined" style="margin-left: 26px; height: 39px; font-size: 12px">Download spec</button>
      </div>

      <div style="position: absolute; right: 10px; top: 24px;">
        <button on:click={() => { apiDocOpen=false }} class="text_button">Close</button>
      </div>
      <div style="position: absolute; top: 70px; bottom: 10px; overflow: auto; width: 97%;">
        <rapi-doc
          spec-url={product?.specUrl}
          show-header = 'false'
          show-info = 'true'
          bg-color = "#fafafa"
          nav-bg-color = '#f3f3f3'
          primary-color = "#3367d6"
          api-key-name = 'apikey'
          api-key-location = 'query'
          api-key-value = {apiKey}
          allow-authentication ='true'
          allow-server-selection = 'false'
          allow-api-list-style-selection ='false'
          allow-search = "false"
          allow-advanced-search = "false"
          theme = 'light'
          render-style = "focused"
          style = {{ textAlign: "left" }}
          data-reveal-delay="200"
          class="blue_text"
        > </rapi-doc>
      </div>
    </div>
  </div>
{/if}

<style>
  .product_header {
    height: 36px;
    padding-top: 16px;
    padding-left: 42px;
    border-bottom: solid 2px rgba(242, 242, 242, 1);
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 8px 24px;
  }

  .product_title {
    font-size: 18px;
    padding-left: 10px;
  }

  .product_overview {
    padding-left: 100px;
    padding-top: 20px;
    display: flex;
    position: absolute;
    top: 100px;
    width: calc(100% - 100px);
  }

  .product_overview_icon {
    widows: 200px;
    padding-top: 24px;
  }

  .product_overview_details {
    padding-left: 20px;
  }

  .product_overview_owner {
    font-size: 13px;
    margin-left: 2px;
  }

  .product_overview_description {
    margin-top: 10px;
    margin-left: 2px;
    color: #666;
  }

  .product_overview_buy {
    margin-top: 44px;
    height: 54px;
  }

  .sub_link {
    padding: 4px 0px;
    margin-right: 8px;
    border-radius: 44px;
    border-width: 0px;
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    color: #666;
  }

  .sub_link:hover {
    text-decoration: underline;
    /* box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.08) 0px 2px 2px 0px, rgba(0, 0, 0, 0.06) 0px 3px 1px -2px; */
  }

  .product_tab_menu {
    margin-top: 130px;
    width: 100%;
    display: flex;
    position: absolute;
    top: 270px;
  }

  .product_tab_menu_item {
    padding-left: 18px;
    padding-right: 18px;
    cursor: pointer;
    height: 28px;
    border: 0px;
    background-color: transparent;
    font-size: 16px;
    color: #333;
    height: 34px;
  }

  .product_tab_menu_item_selected {
    border-bottom: solid 2px #3367d6;
  }

  .product_tab_content {
    width: 100%;
    background-color: #fafafa;
    border-top: solid 2px rgba(242, 242, 242, 1);
    position: absolute;
    bottom: 0px;
    top: 434px;
    height: auto;
    overflow-y: scroll;
  }

  .product_tab_content_inner {
    padding-top: 20px;
    padding-left: 40px;
  }

  .product_tab_content_text {
    color: #333;
    font-size: 14px;
  }

  .blue_text {
    --blue: #3367d6;
  }

  .preview_data {
    position: fixed;
    z-index: 3;
    top: 0px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background-color: rgba(255, 255, 255, 0.75);
  }

  .preview_data_content {
    position: absolute;
    top: 70px;
    left: 86px;
    right: 100px;
    bottom: 50px;
    padding: 12px;
    background-color: white;
    box-shadow: rgb(0 0 0 / 15%) 0px 2px 10px;
    /* overflow: scroll; */

    /* border-radius: 44px; */

  }

  .api_maximize_button {
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
  }
</style>