<script lang="ts">
  import Header from "$lib/header.svelte";
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

<Header />

<div class="product_header">
  
  <button class="product_back_button" on:click={back}>
    <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
  </button>

  <span class="product_title">Product details</span>
</div>

<div class="product_overview">
  <div class="product_overview_icon">
    <img height="62px" alt="Product" src="https://static-00.iconduck.com/assets.00/bigquery-icon-512x512-fxxj0xd6.png" />
  </div>
  <div class="product_overview_details">
    <h2>{data.product.name}</h2>
    <div class="product_overview_owner">Google Enterprise Data</div>
    <div class="product_overview_description">
      {data.product.description}
    </div>

    <div class="product_overview_buy">
      <a href="/home" class="rounded_button_filled">Subscribe</a>
      <a href="/home" class="rounded_button_outlined">Preview data</a>
    </div>

  </div>



</div>

<div class="product_tab_menu">
  <button on:click={() => setSelectedProductTag("overview")} class={selectedProductTab == "overview" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Overview</button>
  <button on:click={() => setSelectedProductTag("pricing")} class={selectedProductTab == "pricing" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Pricing</button>
  <button on:click={() => setSelectedProductTag("documentation")} class={selectedProductTab == "documentation" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Documentation</button>
  <button on:click={() => setSelectedProductTag("support")} class={selectedProductTab == "support" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Support</button>
  <button on:click={() => setSelectedProductTag("related")} class={selectedProductTab == "related" ? "product_tab_menu_item product_tab_menu_item_selected" : "product_tab_menu_item"}>Related products</button>
</div>

<div class="product_tab_content">
  {#if selectedProductTab == "overview"}
    <div class="product_tab_content_inner">
      <h3>Overview</h3>
      <div class="product_tab_content_text">
        Builds conversational interfaces (for example, chatbots, and voice-powered apps and devices).
      </div>
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
  }


  .product_back_button {
    border: 0px;
    border-radius: 100px;
    background-color: transparent;
    padding: 6px;
    position: relative;
    top: -8px;
    left: -22px;
  }

  .product_back_button:hover {
    cursor: pointer;
    background-color: #eee;
  }

  .product_title {
    position: relative;
    top: -14px;
    font-size: 18px;
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
    position: relative;
    top: 36px;
    margin-left: 42px;
  }

  .product_tab_content_text {
    color: #333;
    font-size: 14px;
  }
</style>