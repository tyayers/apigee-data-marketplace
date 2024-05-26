<script lang="ts">
  import { goto } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import type {
    User,
    DataProduct,
    MonetizationRatePlan, FlatTableData
  } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import FlatTable from "$lib/components.flat-table.svelte";
  import { onMount } from "svelte";

  let currentUser: User | undefined = appService.currentUser;
  let products: DataProduct[] | undefined = appService.products;

  let monetizationTableConfig: FlatTableData = {
    headers: [{
      name: "name",
      displayName: "Product name",
      sortable: true,
      searchable: true
    }, {
      name: "monetizationId",
      displayName: "Plan Id",
      sortable: true,
      searchable: true
    }, {
      name: "ownerEmail",
      displayName: "Owner",
      sortable: true,
      searchable: true
    }, {
      name: "source",
      displayName: "Data source",
      sortable: true,
      searchable: true
    }],
    data: [],
    styles: []
  };
  if (products) monetizationTableConfig.data = products;

  onMount(() => {
    document.addEventListener("productsUpdated", () => {
      if (appService.products) {
        products = appService.products;
        monetizationTableConfig.data = appService.products;
      }
    });

    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;

      if (appService.products) {
        products = appService.products;
        monetizationTableConfig.data = appService.products;
      }
    });
  });

  function onRowClick(row: DataProduct) {
    goto("/admin/monetization/" + row.id);
  }

  function onRowDelete(row: DataProduct) {
    if (row && row.id && row.monetizationId) {
      fetch(`/api/products/${row.id}/monetization/${row.monetizationId}`, {
        method: "DELETE"
      }).then((response) => {
        let tempProduct = products?.find(prod => prod.id === row.id);
        if (tempProduct) {
          tempProduct.monetizationId = "";
          fetch("/api/products/" + row.id, {
            method: "PUT",
            body: JSON.stringify(tempProduct)
          });
        }
        products = products;
      });
    }
  }
</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="monetization" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>Monetization products</span>
        <!-- <a
          href="/admin/monetization/new"
          class="text_button left_menu_page_right_header_button"
          style="margin-left: 20px;">+ Add plan</a
        > -->
      </div>

      <div class="left_menu_page_right_content">
        {#if products}
          <FlatTable data={monetizationTableConfig} {onRowClick} {onRowDelete} />
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
