<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import { page } from '$app/stores'
  import type { User, BucketSubscription } from "$lib/interfaces";
  import { onMount } from "svelte";
  import MenuLeftAccount from "$lib/components-menus-left/menus-left.account.svelte";

  let currentUser: User | undefined = appService.currentUser;
  let product: string = "";
  
  var urlProduct = $page.url.searchParams.get('product');
  if (urlProduct) product = urlProduct;

	onMount(() => {
      document.addEventListener("userUpdated", () => {
          currentUser = appService?.currentUser;
      });

      currentUser = appService?.currentUser;
	});

  function submit() {
    fetch("/api/storage?email=" + currentUser?.email + "&product=" + product + "&createdAt=" + (new Date()).toLocaleString(), {
      method: 'POST',
      headers: {
      'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: BucketSubscription) => {
        goto("/user/apps/buckets");
    });
  }

  function back() {
    history.back();
  }
</script>

<div class="left_menu_page">
  <MenuLeftAccount selectedName="bucketapps" />

  <div class="left_menu_page_right">

      <div>
          <div class="left_menu_page_right_header">
              <button class="back_button" on:click={back}>
                <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
              </button>
              {#if product}         
                <span>Add Data Sync for {product}</span>
              {:else}
                <span>Add Data Sync</span>
              {/if}
          </div>

          <div class="left_menu_page_right_content">
            
            <div class="right_content_tip">
              After creating a data sync, you will get a signed URL that you can use to download the refreshed dataset refreshed every 24 hours.
            </div>
            <br />
            <form>

              <div class="product_list">
                <h4>Product subscriptions</h4>
                <div class="select_dropdown">
                  <select name="product" id="product" bind:value={product}>
                      {#each appService.products as product}
                        {#if product.protocols?.includes("Data sync")}
                          <option value={product.name}>{product.name}</option>
                        {/if}
                      {/each}
                  </select>
                </div>
              </div>

              <div class="controls">
                <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
                <button on:click={submit} type="button" class="rounded_button_filled">Create</button>
              </div>

            </form>
          </div>

      </div>
  
  </div>

</div>

<style>

    .right_content_tip {
      font-size: 14px;
      max-width: 550px;
      line-height: 18px;
    }

    .product_list {
      margin-top: 24px;
    }

    .controls {
      margin-top: 34px;      
    }
</style>