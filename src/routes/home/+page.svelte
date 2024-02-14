<script lang="ts">
  import type { PageServerData } from './$types';

  import Header from "$lib/header.svelte";
  import ProductCard from '$lib/product-card.svelte';

  export let data: PageServerData;

  let category_filter: string = "";
  let categories: { [key: string]: string[] } = {
    "Type": [
      "API",
      "Analytics hub",
      "Data sync"
    ],
    "Finance": [
      "Banking",
      "FX",
      "Trading"
    ],
    "Corporate": [
      "HR",
      "Trading"
    ]
  }

  console.log(data.products);
</script>

<Header />

<div class="banner">
  <div class="banner_title">
    Welcome to the Data Marketplace
    <div class="banner_subtitle">
      The Data Marketplace has all data products, links, and a smart search experience.
    </div>

    <div class="banner_search">
      <svg class="banner_search_icon" width="4%" height="100%" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.18 9.747l4.502 4.503-1.414 1.414-4.5-4.5a5 5 0 1 1 1.41-1.418zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill-rule="evenodd"></path></svg>
      <input class="banner_search_input" placeholder="Search for data proucts" />
    </div>
  </div>
</div>

<div class="product_showcase">
  <div class="product_filter">
    <div>
      <div class="product_filter_search">
        <svg class="product_filter_search_icon" data-icon-name="filterIcon" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M2 4h14v2H2V4zm2 4h10v2H4V8zm2 4h6v2H6v-2z"></path></svg>
        <input class="product_filter_search_input" bind:value={category_filter} placeholder="Filter categories" />
      </div>
      {#each Object.keys(categories) as cat}
      <div class="product_filter_header">
        <h4>{cat}</h4>
      </div>
      {#each categories[cat] as subcat}
      {#if category_filter == "" || subcat.toLowerCase().includes(category_filter.toLowerCase())}
      <div class="product_filter_checkbox">
        <input type="checkbox" id={subcat} /><label for={subcat}>{subcat}</label>
      </div>
      {/if}
      {/each}
      {/each}
    </div>
  </div>
  <div class="product_list">
    <div class="product_list_header">
      <h3>Finance data</h3>
    </div>
    {#each data.products.products as product, i}
      <ProductCard data={product} />
    {/each}
    <div class="product_list_header">
      <h3>Corporate data</h3>
    </div>
    {#each data.products.products as product, i}
      <ProductCard data={product} />
    {/each}
    <div class="product_list_header">
      <h3>Customer analytics</h3>
    </div>
    {#each data.products.products as product, i}
      <ProductCard data={product} />
    {/each}
  </div>
</div>

<style>
  .banner {
    background-image: url('https://www.gstatic.com/pantheon/images/marketplace/cameo_banner-1x.png');
    background-size: cover;
    width: 100%;
    height: 300px;
    margin: 0px;
    padding: 0px;
    padding-top: 145px;
  }

  .banner_title {
    text-align: left;
    width: 580px;
    margin-left: auto;
    margin-right: auto;
    font-size: 24px;
  }

  .banner_subtitle {
    margin-top: 16px;
    font-size: 14px;
  }

  .banner_search {
    width: 100%;
    height: 44px;
    margin-top: 28px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .banner_search_icon {
    margin-left: 9px;
  }

  .banner_search_input {
    width: 90%;
    margin-top: 4px;
    border-width: 0px;
    font-size: 14px;
    border: none;
    background-color: #fafafa;
    position: relative;
    top: -18px;
  }

  .banner_search_input:focus {
    outline: none;
  }

  .product_showcase {
    width: 100%;
    display: flex;
  }

  .product_filter {
    width: 240px;
    height: 700px;
  }

  .product_filter_header {
    margin-left: 18px;
  }

  .product_filter_checkbox {
    margin-left: 18px;
    margin-top: 8px;
    color: #333;
    font-size: 16px;
    user-select: none;
  }

  .product_filter_checkbox label {
    margin-left: 6px;
  }

  .product_list {
    margin-top: 10px;
    width: calc(100% - 240px);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .product_list_header {
    width: 100%;
    margin-left: 14px;
  }

  .product_filter_search {
    width: 240px;
    height: 44px;
    margin-top: 28px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .product_filter_search_input {
    border-width: 0px;
    font-size: 14px;
    border: none;
    background-color: #fafafa;
    position: relative;
    top: -3px;
    width: 80%;
  }

  .product_filter_search_input:focus {
    outline: none;
  }

  .product_filter_search_icon {
    margin-left: 9px;
    margin-top: 9px;
  }

</style>
