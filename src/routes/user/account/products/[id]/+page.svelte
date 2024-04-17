<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct } from '$lib/interfaces';
  import MenuLeftAccount from '$lib/components-menus-left/menus-left.account.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let name: string = data.productData.productName;
  let description: string = data.productData.productDescription;
  let source: string = data.productData.source;
  let query: string = data.productData.query;
  let status: string = data.productData.status;
  let id: string = data.productData.id;

  function submit() {
    let createdAt = new Date().toString();
    let email: string = "";

    if (appService.currentUser) email = appService.currentUser.email;

    let newProduct: DataProduct = new DataProduct(id, email, name, description, status,
      source, query, createdAt, [], []);

    fetch("/api/products/" + id, {
      method: 'PUT',
      body: JSON.stringify(newProduct),
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: DataProduct) => {
        goto("/user/account/products");
    }).catch((error) => {
      console.error(error);
    });
  }

  function back() {
    goto("/user/account/products");
  }
</script>

<div class="left_menu_page">
  <MenuLeftAccount selectedName="products" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
          <button class="back_button" on:click={back}>
            <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
          </button>            
          <span>Edit product</span>
      </div>

      <div class="right_content">
        
        <div class="right_content_tip">
          Give your data product an appropriate name and description, and enter the query and data source to connect the product to.
          Finally, configure which protocols and audiences your product should be offered to.
          <a href="/home" target="_blank">Learn more <svg class="right_content_tip_learnmore" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"></path></svg></a>
        </div>

        <form method="POST">

          <div class="input_field_panel">
            <!-- svelte-ignore a11y-autofocus -->
            <input class="input_field" type="text" name="name" id="name" required bind:value={name} autocomplete="off" autofocus title="none" />
            <label for="name" class='input_field_placeholder'>
              Name
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="description" id="description" bind:value={description} autocomplete="off" title="none" />
            <label for="description" class='input_field_placeholder'>
              Description
            </label>
          </div>

          <div class="form_list">
            <h4>Data source</h4>
            <div class="select_dropdown">
              <select name="source" id="source" bind:value={source}>
                <option value="BigQuery">BigQuery</option>
                <option value="BigQuery">API</option>
                <option value="AlloyDB">AlloyDB</option>
                <option value="CloudSpanner">Cloud Spanner</option>
                <option value="Snowflake">Snowflake</option>
                <option value="Databricks">Databricks</option>
              </select>
            </div>
          </div>

          <div class="input_field_panel">
            <textarea name="query" id="query" required class="input_field" rows="10" bind:value={query}></textarea>
            <label for="query" class='input_field_placeholder'>
              Query
            </label>
          </div>

          <div class="form_list">
            <h4>Protocols</h4>
            <div class="form_list_line">
              <input id="protocol_api" name="protocol_api" type="checkbox" /><label for="protocol_api">API</label>
            </div>
            <div class="form_list_line">
              <input id="protocol_event" name="protocol_event" type="checkbox" /><label for="protocol_event">Event stream</label>
            </div>
            <div class="form_list_line">
              <input id="protocol_ah" name="protocol_ah" type="checkbox" /><label for="protocol_ah">Analytics Hub</label>
            </div>              
            <div class="form_list_line">
              <input id="protocol_sync" name="protocol_sync" type="checkbox" /><label for="protocol_sync">Data sync</label>
            </div>          
          </div>

          <div class="form_list">
            <h4>Audience</h4>
            <div class="form_list_line">
              <input id="target_internal" name="target_internal" type="checkbox" /><label for="target_internal">Internal</label>
            </div>
            <div class="form_list_line">
              <input id="target_partners" name="target_partners" type="checkbox" /><label for="target_partners">Partners</label>
            </div>              
            <div class="form_list_line">
              <input id="target_external" name="target_external" type="checkbox" /><label for="target_external">External</label>
            </div>          
          </div>

          <div class="form_list">
            <h4>Status</h4>
            <div class="select_dropdown">
              <select name="status" id="status" bind:value={status}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div class="form_controls">
            <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
            <button on:click={() => history.back()} type="button" class="rounded_button_outlined">Cancel</button>
          </div>

        </form>
      </div>

  </div>
  </div>
</div>

<style>

</style>