<script lang="ts">
  import { goto } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import type { User, DataProduct, FlatTableData } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import FlatTable from "$lib/components.flat-table.svelte";

  import { onMount } from "svelte";

  let currentUser: User | undefined = appService.currentUser;
  let products: DataProduct[] | undefined = appService.products;
  let productsTableConfig: FlatTableData = {
    headers: [
      {
        name: "name",
        displayName: "Name",
        searchable: true,
        sortable: true
      },{
        name: "ownerEmail",
        displayName: "Owner",
        searchable: true,
        sortable: true
      },{
        name: "source",
        displayName: "Data source",
        searchable: true,
        sortable: true
      },{
        name: "createdAt",
        displayName: "Creation date",
        searchable: true,
        sortable: true
      },{
        name: "status",
        displayName: "Status",
        searchable: true,
        sortable: true
      }
    ],
    data: [],
    styles: []
  };
  if (products)
    productsTableConfig.data = products;


  let sortName: boolean = false;

  onMount(() => {
    document.addEventListener("productsUpdated", () => {
      products = appService.products;
      if (products)
        productsTableConfig.data = products;
    });

    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;
      products = appService.products;
      if (products)
        productsTableConfig.data = products;
    });
  });

  function onRowClick(row: DataProduct) {
    goto("/admin/products/" + row.id);
  }

  function onRowDelete(row: DataProduct) {
    appService
      .ShowDialog(
        "Are you sure you want to delete this product?",
        "Delete",
        0
      )
      .then((result) => {
        if (result === "ok") {
          fetch("/api/products/" + row.id, {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
          }).then((response) => {
            if (appService && appService.products) {
              let index = appService.products.findIndex((x) => x.id == row.id);
              appService.products.splice(index, 1);
              products = appService.products;
            }
          });
        }
      });
  }

</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="products" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>Products</span><a
          href="/admin/products/new"
          class="text_button left_menu_page_right_header_button"
          >+ Add product</a
        >
      </div>

      <div class="left_menu_page_right_content">
        {#if products}
          <FlatTable data={productsTableConfig} {onRowClick} {onRowDelete} />
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
