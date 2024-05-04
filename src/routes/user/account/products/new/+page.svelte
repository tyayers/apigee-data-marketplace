<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct, DisplayOptions } from '$lib/interfaces';
  import MenuLeftAccount from '$lib/components-menus-left/menus-left.account.svelte';
  import ProductEditor from '$lib/components.product-edit.svelte';
  import { generateRandomString, protocols, audiences } from '$lib/utils';

  let product: DataProduct = new DataProduct(generateRandomString(4), "", "", "", "Draft", "BigQuery", "", "", "", ["API"], ["internal"], []);
  let categoryData: string[] = [
    "ESG - Environmental", "ESG - Social", "ESG - Governance",
    "Investment - Research", "Investment - Statistics", "Investment - Management",
    "Pre-IPO - Research", "Pre-IPO - Statistics", "Pre-IPO - Management",
    "Listing - Research", "Listing - Statistics", "Listing - Management",
    "Trading - Research", "Trading - Statistics", "Trading - Classes"
  ];

  function submit() {
    product.createdAt = new Date().toString();
    product.id = product.name.toLowerCase().replaceAll(" ", "_") + "_" + product.id;
    if (appService.currentUser) product.ownerEmail = appService.currentUser.email;
        
    let newProduct: DataProduct = product;
    if (newProduct.categories.length == 0) newProduct.categories.push("Uncategorized");

    fetch("/api/products", {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: DataProduct) => {
      appService.products.push(data);
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
          <span>Create product</span>
      </div>

      <div class="right_content">
        <ProductEditor {product} />

        <div class="form_controls">
          <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
          <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
        </div>
      </div>

    </div>
  </div>
</div>

<style>

</style>