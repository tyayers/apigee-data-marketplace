<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
    import { page } from "$app/stores";
  import { appService } from "$lib/app-service";
  import type { PageData } from "./$types";

  export let data: PageData;
  
  let name: string = "";
  let description: string = "";
  let product_input: string = "";

  var urlProduct = $page.url.searchParams.get('product');
  if (urlProduct) product_input = urlProduct;

  function back() {
    history.back();
  }
</script>

<div class="left_menu_page">

  <div class="left_menu_page_left">
      <div class="left_menu_page_left_header">
          <svg class="left_menu_page_left_icon" width="36px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M17 9.008l-3.363-3.363-1.883 1.883 1.48 1.48-1.48 1.48 1.883 1.882L17 9.008zM8.992 1l3.363 3.363-1.883 1.883-1.48-1.48-1.48 1.48L5.63 4.363 8.992 1zm.016 16l-3.363-3.363 1.883-1.883 1.48 1.48 1.48-1.48 1.882 1.883L9.008 17zM1 8.992l3.363 3.363 1.883-1.883-1.48-1.48 1.48-1.48L4.363 5.63 1 8.992zM9.008 7.32l1.688 1.688-1.688 1.688-1.69-1.688 1.69-1.69z" fill-rule="evenodd"></path></svg>
          <span class="left_menu_page_left_title">My subscriptions</span>
      </div>
      <div class="left_menu_page_left_list">
          <a href="/apps/api" class="side_menu_button side_menu_button_selected">
              <svg class="side_menu_button_logo side_menu_button_logo_selected" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M9.874 10H12v2h3v-2h1V8H9.874A4.002 4.002 0 0 0 2 9a4 4 0 0 0 7.874 1zM6 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill-rule="evenodd"></path></svg>
              <span class="side_menu_button_name side_menu_button_name_selected">Credentials</span>
          </a>
          <a href="/apps/bigquery" class="side_menu_button">
              <svg class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.9 8.76L6 7.58a1.09 1.09 0 000-.26 1 1 0 10-.33.75l2 1.17a.28.28 0 00.15 0A.31.31 0 008 9.15a.29.29 0 00-.1-.39zM5 7.78a.46.46 0 010-.92.46.46 0 010 .92z"></path><path d="M6.9 14.12A5.12 5.12 0 1112 9a5.13 5.13 0 01-5.1 5.12zM6.9 5a4 4 0 104 4 4 4 0 00-4-4z"></path><path d="M14.83 11.66a1.4 1.4 0 00-.83.27L9.68 9.45a1.72 1.72 0 000-.9L14 6.07A1.39 1.39 0 1013.43 5a.68.68 0 000 .14L9.08 7.59a1.85 1.85 0 100 2.82l4.37 2.5a.68.68 0 000 .14 1.4 1.4 0 101.4-1.39z"></path></svg>            
              <span class="side_menu_button_name">Analytics Hub subscriptions</span>
          </a>
          <a href="/apps/buckets" class="side_menu_button">
              <svg class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.027 11h6.978c.55 0 .995.443.995 1v1c0 .553-.456 1-.995 1H7.027v1.758L2 12.378 7.027 9v2zM11 4H3.995C3.455 4 3 4.447 3 5v1c0 .557.446 1 .995 1H11v1.79l5.027-3.396L11 2v2z" fill-rule="evenodd"></path></svg>
              <span class="side_menu_button_name">Data syncs</span>
          </a>
      </div>
  </div>

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
                {#each data.products as product}
                <div class="form_list_line">
                  {#if product.name === product_input}
                    <input id={product.name} name={product.name} checked type="checkbox" /><label for={product.name}>{product.name}</label>
                  {:else}
                    <input id={product.name} name={product.name} type="checkbox" /><label for={product.name}>{product.name}</label>
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