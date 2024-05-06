<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { appService } from "$lib/app-service";
  import { onMount } from "svelte";
  import MenuLeftAccount from "$lib/components-menus-left/menus-left.account.svelte";

  let name: string = "";
  let description: string = "";
  let product_input: string = "";

  let products = appService.products;
  var urlProduct = $page.url.searchParams.get('product');
  if (urlProduct) product_input = urlProduct;

	onMount(() => {
    document.addEventListener("productsUpdated", () => {
      products = appService.products;
    });
	});


  function back() {
    history.back();
  }
</script>

<div class="left_menu_page">

  <MenuLeftAccount selectedName="apiapps" />

  <div class="left_menu_page_right">

      <div>
          <div class="left_menu_page_right_header">
              <button class="back_button" on:click={back}>
                <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
              </button>            
              <span>Add credentials</span>
          </div>

          <div class="right_content">
            
            <div class="right_content_tip">
              Your credentials will be used for a specific platform and integration. After 
              creating the Client Id and Secret will be displayed here, and always be visible
              in the credentials overview page. 
              <a href="/home" target="_blank">Learn more <svg class="right_content_tip_learnmore" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"></path></svg></a>
            </div>

            <form method="POST">

              <input type="hidden" id="email" name="email" value={appService.currentUser?.email} />

              <div class="input_field_panel">
                <!-- svelte-ignore a11y-autofocus -->
                <input class="input_field" type="text" name="name" id="name" required bind:value={name} autocomplete="off" autofocus title="none" />
                <label for="name" class='input_field_placeholder'>
                  Name
                </label>
              </div>

              <div class="input_field_panel">
                <input class="input_field" type="text" name="description" id="description" bind:value={description} autocomplete="off" title="none" />
                <label for="description" class='input_field_placeholder'>
                  Description
                </label>
              </div>

              <div class="form_list">
                <h4>Product subscriptions</h4>
                {#each products as product}
                <div class="form_list_line">
                  {#if product.id === product_input}
                    <input id={product.id} name={product.id} checked type="checkbox" /><label for={product.id}>{product.name}</label>
                  {:else}
                    <input id={product.id} name={product.id} type="checkbox" /><label for={product.id}>{product.name}</label>
                  {/if}
                </div>
                {/each}
              </div>

              <div class="form_controls">
                <button type="submit" class="rounded_button_filled">Create</button>
                <button on:click={() => history.back()} type="button" class="rounded_button_outlined">Cancel</button>
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

    .right_content_tip a:hover {
      text-decoration: underline;
    }

    .right_content_tip_learnmore {
      position: relative;
      top: 5px;
      left: -3px;
    }
</style>