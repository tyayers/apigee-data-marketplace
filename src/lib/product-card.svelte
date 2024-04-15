<script lang="ts">
	import { goto } from "$app/navigation";
    import { resolveRoute } from "$app/paths";
    import type { Product } from "./interfaces";

  export let data: Product | undefined = undefined;
  let types: string[] = [];
  let tags: { [key: string]: string } = {};

  if (data && data.attributes) {
    for (let tagData of data.attributes) {
      tags[tagData.name] = tagData.value;
    }
  }

  if (data && data.type)
    types = data.type.split(",");

  function OpenProduct() {
    goto("/products/" + data?.name);
  }

  function getTypeClass(type: string) {
    let result = "tag tag_orange";
    if (type === "api")
      result = "tag tag_green";
    else if (type === "ah")
      result = "tag tag_red";

    return result;
  }

  function getTypeName(type: string): string {
    let result = type;

    if (type === "ah")
      result = "Analytics hub";
    else if (type === "sync")
      result = "Data sync";
    else if (type === "api")
      result = "API";
    
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
</script>

{#if data}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="product-box" on:click={OpenProduct}>
    <div>
      {#if data.imageUrl}
        <img height="32px" alt="Product" src={data.imageUrl} />
      {:else}
        <img height="32px" alt="Product" src="https://static-00.iconduck.com/assets.00/bigquery-icon-512x512-fxxj0xd6.png" />
      {/if}
    </div>
    {data.name}
    <div class="product-owner-box">
      {data.groupArray?.join(", ")}
    </div>
    <div class="product-description-box">
      {data.description}
    </div>
    <div class="tags_box">
      {#each types as type}
        <span class={getTypeClass(type)}>{getTypeName(type)}</span>
      {/each}
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
    margin: 14px;
    position: relative;
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
    text-overflow: ellipsis;
    display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  }

  .tags_box {
    position: absolute;
    bottom: 10px;
  }

  .tag {
    padding: 2px 8px 2px 8px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    margin-right: 6px;
  }

  .tag_green {
    background-color: rgb(85, 153, 85);
  }

  .tag_red {
    background-color: rgb(240, 74, 74);
  }

  .tag_orange {
    background-color: orange;
  }
</style>