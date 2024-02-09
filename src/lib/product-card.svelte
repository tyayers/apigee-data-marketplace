<script lang="ts">
	import { goto } from "$app/navigation";
import type { ApiProduct } from "apigee-x-module";

  export let data: ApiProduct | undefined = undefined;

  function OpenProduct() {
    goto("/products/" + data?.name);
  }
</script>

{#if data}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="product-box" on:click={OpenProduct}>
    <div>
      <img height="32px" alt="Product" src="https://static-00.iconduck.com/assets.00/bigquery-icon-512x512-fxxj0xd6.png" />
    </div>
    {data.name}
    <div class="product-owner-box">
      {data.access}
    </div>
    <div class="product-description-box">
      {data.description}
    </div>
  </div>
{/if}

<style>
    .product-box {
    color: black;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
    padding: 16px 20px;
    transition: box-shadow 0.2s ease 0s;
    width: 246px;
    height: 246px;
    display: inline-block;
    margin: 14px;

  }

  .product-box:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }

  .product-owner-box {
    font-size: 13px;
    font-weight: 300;
    color: rgb(0,0,0,.66);
  }

  .product-description-box {
    font-size: 13px;
    line-height: 20px;
    margin-top: 8px;
    max-height: 80px;
    overflow: hidden;
  }
</style>