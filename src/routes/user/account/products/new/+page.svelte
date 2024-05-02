<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct, DisplayOptions } from '$lib/interfaces';
  import MenuLeftAccount from '$lib/components-menus-left/menus-left.account.svelte';
  import InputSelect from '$lib/components.input.select.svelte';
  import TagCloud from '$lib/components.tag.cloud.svelte';
  import { generateRandomString, protocols, audiences } from '$lib/utils';

  let newProduct: DataProduct = new DataProduct(generateRandomString(8), "", "", "", "Draft", "BigQuery", "", "", "", ["API"], ["internal"], []);
  let categoryData: string[] = [
    "ESG - Environmental", "ESG - Social", "ESG - Governance",
    "Investment - Research", "Investment - Statistics", "Investment - Management",
    "Pre-IPO - Research", "Pre-IPO - Statistics", "Pre-IPO - Management",
    "Listing - Research", "Listing - Statistics", "Listing - Management",
    "Trading - Research", "Trading - Statistics", "Trading - Classes"
  ];

  function submit() {
    newProduct.createdAt = new Date().toString();
    if (appService.currentUser) newProduct.ownerEmail = appService.currentUser.email;
    
    fetch("/api/products", {
      method: 'POST',
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

  function onProtocolChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];

    if (e.target.checked) {
      if (! newProduct.protocols.includes(name))
        newProduct.protocols.push(name);
    }
    else {
      let index = newProduct.protocols.indexOf(name);
      if (index >= 0)
        newProduct.protocols.splice(index, 1);
    }
  }

  function onAudienceChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];

    if (e.target.checked) {
      if (! newProduct.audiences.includes(name))
        newProduct.audiences.push(name);
    }
    else {
      let index = newProduct.audiences.indexOf(name);
      if (index >= 0)
        newProduct.audiences.splice(index, 1);
    }
  }

  function addCategory(category: string) {
    if (!newProduct.categories.includes(category)) {
      let newProductCopy = newProduct;
      newProductCopy.categories.push(category);
      newProduct = newProductCopy;
    }
  }

  function removeCategory(category: string) {
    if (newProduct.categories.includes(category)) {
      let newProductCopy = newProduct;
      let index = newProductCopy.categories.indexOf(category);
      newProductCopy.categories.splice(index, 1);
      newProduct = newProductCopy;
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
          <span>Create product</span>
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
            <input class="input_field" type="text" name="name" id="name" required bind:value={newProduct.productName} autocomplete="off" autofocus title="none" />
            <label for="name" class='input_field_placeholder'>
              Name
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="description" id="description" bind:value={newProduct.productDescription} autocomplete="off" title="none" />
            <label for="description" class='input_field_placeholder'>
              Description
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="entity" id="entity" bind:value={newProduct.entity} autocomplete="off" title="none" />
            <label for="entity" class='input_field_placeholder'>
              Entity name
            </label>
          </div>

          <div class="form_list">
            <h4>Data source</h4>
            <div class="select_dropdown">
              <select name="source" id="source" bind:value={newProduct.source}>
                <option value="BigQuery">BigQuery</option>
                <option value="API">API</option>
                <option value="AlloyDB">AlloyDB</option>
                <option value="Cloud Spanner">Cloud Spanner</option>
                <option value="Snowflake">Snowflake</option>
                <option value="Databricks">Databricks</option>
              </select>
            </div>
          </div>

          <div class="input_field_panel">
            <textarea name="query" id="query" required class="input_field" bind:value={newProduct.query} rows="10"></textarea>
            <label for="query" class='input_field_placeholder'>
              Query, table or backend URL
            </label>
          </div>

          <div class="form_list">
            <h4>Categories</h4>

            <InputSelect data={categoryData} label="Add category - subcategory" onSelect={addCategory} />

            <TagCloud data={newProduct.categories} onRemove={removeCategory} />

          </div>

          <div class="form_list">
            <h4>Protocols</h4>
            {#each protocols as protocol}
              <div class="form_list_line">
                <input id={protocol.name} name={protocol.name} disabled={!protocol.active} checked={newProduct.protocols.includes(protocol.name)} on:change={onProtocolChange} type="checkbox" /><label for={protocol.name}>{protocol.displayName}</label>
              </div>
            {/each}
          </div>          

          <div class="form_list">
            <h4>Audiences</h4>
            {#each audiences as aud}
              <div class="form_list_line">
                <input id={aud.name} name={aud.name} disabled={!aud.active} checked={newProduct.audiences.includes(aud.name)} on:change={onAudienceChange} type="checkbox" /><label for={aud.name}>{aud.displayName}</label>
              </div>
            {/each}      
          </div>

          <div class="form_list">
            <h4>Status</h4>
            <div class="select_dropdown">
              <select name="status" id="status" bind:value={newProduct.status}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div class="form_controls">
            <button type="button" on:click={submit} class="rounded_button_filled">Create</button>
            <button on:click={() => history.back()} type="button" class="rounded_button_outlined">Cancel</button>
          </div>

        </form>
      </div>

  </div>
  </div>
</div>

<style>

</style>