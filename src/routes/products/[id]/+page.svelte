<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
    import { appService } from "$lib/app-service";
    import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
  export let data: PageServerData;

  let selectedProductTab = "overview";

  let newTab = $page.url.searchParams.get('tab')
  if (newTab) selectedProductTab = newTab;

  let appSubscriptions: string[] = [];
  let apiKey: string = "";

  let previewDataOpen: boolean = false;

  onMount(async () => {
    document.addEventListener("cancelEvent", () => {
      previewDataOpen = false;
    });

    document.addEventListener("appsUpdated", () => {
      refreshApps();
    });

    refreshApps();
  });

  if (data.product) {
    data.product.attrArray = [];
    data.product.groupArray = [];
    data.product.typeArray = data.product.type?.split(",");
    if (data.product.attributes) {
      for (let tagData of data.product.attributes){
        if (tagData.name === "tags") {
          let tags = tagData.value.split(", ");

          for (let tag of tags) {
            data.product.attrArray.push(tag);
            let pieces = tag.split("/");
            if (! data.product.attrArray.includes(pieces[0])) data.product.attrArray.push(pieces[0]);
          }
        }
        else if (tagData.name === "groups") {
          data.product.groupArray = tagData.value.split(", ");
        }
      }
    }
  }

  function refreshApps() {
    if (appService.apiApps && appService.apiApps.app) {
      var newAppSubscriptions = appSubscriptions;
      for (let app of appService.apiApps.app) {
        if (app.apiProducts && app.apiProducts.includes(data.product.name)) {
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

    {#if data.product.imageUrl}
      <img height="62px" alt="Product" src={data.product.imageUrl} />
    {:else}
      <img height="62px" alt="Product" src="https://static-00.iconduck.com/assets.00/bigquery-icon-512x512-fxxj0xd6.png" />
    {/if}
  </div>
  <div class="product_overview_details">
    <h2>{data.product.name}</h2>
    <div class="product_overview_owner">{data.product.groupArray?.join(", ")}</div>
    <div class="product_overview_description">
      {data.product.description}
    </div>

    <div class="product_overview_buy">
      {#if data.product.type?.includes("api")}
        <a href={"/apps/api/new?product=" + data.product.name} class="rounded_button_filled">Subscribe to API</a>
      {/if}
      {#if data.product.type?.includes("ah")}
        <a href={"/apps/bigquery/new?product=" + data.product.name} class="rounded_button_filled">Subscribe on Analytics Hub</a>
      {/if}
      {#if data.product.type?.includes("sync")}
        <a href={"/apps/buckets/new?product=" + data.product.name} class="rounded_button_filled">Enable data sync</a>
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
        {data.product.description}
      </div>
      <h3>SLA</h3>
      <div class="product_tab_content_text">
        This API has a 99.99% availability within the provided regions (EU, UK).
      </div>
    </div>
  {:else if selectedProductTab == "documentation"}
    <div>
      {#if data.product.specUrl}
        <rapi-doc
          spec-url={data.product.specUrl}
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
                  <th>Tier</th>
                  <th>Price</th>
                  <th>Range</th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <td>Starter</td>
              <td>Free</td>
              <td>20 API calls or file downloads per month</td>
            </tr>
            <tr>
              <td>Basic</td>
              <td>0.20€ per 100 API calls or file downloads</td>
              <td>21 - 5000 API calls or file downloads per month</td>
            </tr>
            <tr>
              <td>Premium</td>
              <td>0.10€ per 100 API calls or file downloads</td>
              <td>	&gt; 5000 API calls or file downloads per month</td>
            </tr>
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
    <div class="preview_data_content" on:click|stopPropagation={()=>{}}>
      <div style="display: flex;">
        <h3 style="position: relative; top: -4px;">Preview data</h3>
        <button class="rounded_button_outlined" style="margin-left: 19px; height: 39px; font-size: 12px">Download CSV</button>
      </div>

      <div style="position: absolute; right: 10px; top: 24px;">
        
        <button on:click={() => { previewDataOpen=false }} class="text_button">Close</button>
      </div>
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
    width: 100%;
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
    /* padding: 12px;
    padding-left: 24px;
    padding-right: 24px; */
    border-width: 0px;
    font-size: 16px;
    /* background-color: #e8def8; */
    /* background-color: #f3f3f3; */
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
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
    padding: 12px;
    background-color: white;
    box-shadow: rgb(0 0 0 / 15%) 0px 2px 10px;
    overflow: scroll;

    /* border-radius: 44px; */

  }
</style>