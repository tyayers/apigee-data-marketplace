<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct } from '$lib/interfaces';
  import MenuLeftAccount from '$lib/components-menus-left/menus-left.account.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { protocols, audiences } from '$lib/utils';

  export let data: PageData;

  function submit() {
    
    if (appService.currentUser) data.product.ownerEmail = appService.currentUser.email;
    
    fetch("/api/products", {
      method: 'POST',
      body: JSON.stringify(data.product),
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

  function onProtocolChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];

    if (e.target.checked) {
      if (! data.product.protocols.includes(name))
        data.product.protocols.push(name);
    }
    else {
      let index = data.product.protocols.indexOf(name);
      if (index >= 0)
        data.product.protocols.splice(index, 1);
    }
  }

  function onAudienceChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];

    if (e.target.checked) {
      if (! data.product.audiences.includes(name))
        data.product.audiences.push(name);
    }
    else {
      let index = data.product.audiences.indexOf(name);
      if (index >= 0)
        data.product.audiences.splice(index, 1);
    }
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
            <input class="input_field" type="text" name="name" id="name" required bind:value={data.product.productName} autocomplete="off" autofocus title="none" />
            <label for="name" class='input_field_placeholder'>
              Name
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="description" id="description" bind:value={data.product.productDescription} autocomplete="off" title="none" />
            <label for="description" class='input_field_placeholder'>
              Description
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="entity" id="entity" bind:value={data.product.entity} autocomplete="off" title="none" />
            <label for="entity" class='input_field_placeholder'>
              Entity name
            </label>
          </div>

          <div class="form_list">
            <h4>Data source</h4>
            <div class="select_dropdown">
              <select name="source" id="source" bind:value={data.product.source}>
                <option value="bigquery">BigQuery</option>
                <option value="api">API</option>
                <option value="alloydb" disabled>AlloyDB</option>
                <option value="cloudspanner" disabled>Cloud Spanner</option>
                <option value="snowflake" disabled>Snowflake</option>
                <option value="databricks" disabled>Databricks</option>
              </select>
            </div>
          </div>

          <div class="input_field_panel">
            <textarea name="query" id="query" required class="input_field" bind:value={data.product.query} rows="10"></textarea>
            <label for="query" class='input_field_placeholder'>
              Query or table
            </label>
          </div>

          <div class="form_list">
            <h4>Publish protocols</h4>
            {#each protocols as protocol}
              <div class="form_list_line">
                <input id={protocol.name} name={protocol.name} disabled={!protocol.active} checked={data.product.protocols.includes(protocol.name)} on:change={onProtocolChange} type="checkbox" /><label for={protocol.name}>{protocol.displayName}</label>
              </div>
            {/each}
          </div>

          <div class="form_list">
            <h4>Audiences</h4>
            {#each audiences as aud}
              <div class="form_list_line">
                <input id={aud.name} name={aud.name} disabled={!aud.active} checked={data.product.audiences.includes(aud.name)} on:change={onAudienceChange} type="checkbox" /><label for={aud.name}>{aud.displayName}</label>
              </div>
            {/each}      
          </div>

          <div class="form_list">
            <h4>Status</h4>
            <div class="select_dropdown">
              <select name="status" id="status" bind:value={data.product.status}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
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