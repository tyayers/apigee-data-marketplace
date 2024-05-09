<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct, DisplayOptions, MonetizationRatePlan, MonetizationRatePlanRate } from '$lib/interfaces';
  import MenuLeftAdmin from '$lib/components-menus-left/menus-left.admin.svelte';
  import MonetizationEditor from '$lib/components.monetization-edit.svelte';
  import { generateRandomString, protocols, audiences } from '$lib/utils';

  let plan: MonetizationRatePlan = new MonetizationRatePlan("", "");
  plan.consumptionPricingRates.push(new MonetizationRatePlanRate());

  function submit() {
    console.log(plan);
    // product.createdAt = new Date().toString();
    // product.id = product.name.toLowerCase().replaceAll(" ", "_") + "_" + product.id;
    // if (appService.currentUser) product.ownerEmail = appService.currentUser.email;
        
    // let newProduct: DataProduct = product;
    // if (newProduct.categories.length == 0) newProduct.categories.push("Uncategorized");

    // fetch("/api/products", {
    //   method: 'POST',
    //   body: JSON.stringify(newProduct),
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    // }).then((response) => {
    //     return response.json();
    // }).then((data: DataProduct) => {
    //   appService.products.push(data);
    //   goto("/admin/products");
    // }).catch((error) => {
    //   console.error(error);
    // });
  }

  function back() {
    goto("/admin/monetization");
  }
</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="monetization" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
          <button class="back_button" on:click={back}>
            <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
          </button>            
          <span>Create monetization plan</span>
      </div>

      <div class="right_content">
        <MonetizationEditor {plan} />

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