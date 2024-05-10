<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct, DisplayOptions, MonetizationRatePlan, MonetizationRatePlanRate } from '$lib/interfaces';
  import MenuLeftAdmin from '$lib/components-menus-left/menus-left.admin.svelte';
  import MonetizationEditor from '$lib/components.monetization-edit.svelte';
  import { generateRandomString, protocols, audiences } from '$lib/utils';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let plan: MonetizationRatePlan;
  let products: DataProduct[] = appService.products;
  let product: DataProduct;

  onMount(async () => {
    document.addEventListener("productsUpdated", () => {
      products = appService.products;
      loadProduct();
    });

    products = appService.products;
    loadProduct();
  });

  function loadProduct() {
    if (products.length > 0 && !product) {
      let tempProduct = products.find(prod => prod.id === data.productId);
      if (tempProduct) product = tempProduct;
      
      if (product?.monetizationId) {
        // Load monetization data
        fetch("/api/monetization/" + product?.monetizationId).then((response) => {
          if (response.status == 200)
            return response.json();
        }).then((monetizationRecord: MonetizationRatePlan) => {
          plan = monetizationRecord;
        })
      }
      else {
        plan = new MonetizationRatePlan("", "");
      }
    }
  }

  function submit() {
    console.log(plan);
    plan.apiproduct = product.id;
    plan.startTime = Date.now();

    fetch("/api/monetization", {
      method: "POST",
      body: JSON.stringify(plan)
    }).then((response: Response) => {
      console.log("Monetization response: " + response.status + " " + response.statusText);
      if (response.status == 200) {
        return response.json();
      }
    }).then((result: {name: string}) => {
      // Now update product with monetization name
      product.monetizationId = result.name;
      fetch("/api/products/" + product.id, {
        method: "PUT",
        body: JSON.stringify(product)
      });
    }).catch((err) => {
      console.error(err);
    });
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
        {#if plan}
        <MonetizationEditor {plan} />

        <div class="form_controls">
          <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
          <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
        </div>
        {:else}
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        {/if}
      </div>

    </div>
  </div>
</div>

<style>

</style>