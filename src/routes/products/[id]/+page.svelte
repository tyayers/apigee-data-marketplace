<script lang="ts">
	import type { PageServerData } from "./$types";
  export let data: PageServerData;

  let selectedProductTab = "overview";

  function back() {
    history.back();
  }

  function setSelectedProductTag(tabName: string) {
    selectedProductTab = tabName;
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
        <a href="/home" class="rounded_button_filled">Subscribe to API</a>
      {/if}
      {#if data.product.type?.includes("ah")}
        <a href="/home" class="rounded_button_filled">Analytics Hub</a>
      {/if}
      {#if data.product.type?.includes("sync")}
        <a href="/home" class="rounded_button_filled">Enable data sync</a>
      {/if}      
      <a href="/home" class="rounded_button_outlined">Preview data</a>
    </div>

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
    </div>
  {:else if selectedProductTab == "documentation"}
    <div class="product_tab_content_inner">
      {#if data.product.specUrl}
        <rapi-doc
          spec-url={data.product.specUrl}
          show-header = 'false'
          show-info = 'true'
          bg-color = "#fafafa"
          nav-bg-color = '#fcfcfc'
          primary-color = "#3367d6"
          api-key-name = 'x-api-key'
          api-key-location = 'header'
          api-key-value = {"fdsfsdjkfjsdlj"}
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
    </div>
  {/if}
</div>

<style>
  .product_header {
    width: 100%;
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
    width: 100%;
    padding-left: 100px;
    display: flex;
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
    position: relative;
    top: -10px;
    left: 4px;
  }

  .product_overview_description {
    position: relative;
    top: 18px;
    left: 4px;
    color: #666;
  }

  .product_overview_buy {
    position: relative;
    top: 70px;
    left: 2px;
  }

  .product_tab_menu {
    position: relative;
    top: 160px;
    left: 42px;
    width: 100%;
    display: flex;
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
    height: 500px;
    position: relative;
    top: 160px;
    background-color: #fafafa;
    border-top: solid 2px rgba(242, 242, 242, 1);
  }

  .product_tab_content_inner {
    display: flex;
    position: relative;
    top: 10px;
    margin-left: 28px;
    height: 500px;
  }

  .product_tab_content_text {
    color: #333;
    font-size: 14px;
  }

  .blue_text {
    --blue: #3367d6;
  }
</style>