<script lang="ts">
  import { goto } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import type { User, DataProduct } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import { onMount } from "svelte";

  let currentUser: User | undefined = appService.currentUser;
  let products: DataProduct[] | undefined = appService.products;

  onMount(() => {
    document.addEventListener("productsUpdated", () => {
      products = appService.products;
    });

    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;
      products = appService.products;
    });
  });

  function openProduct(productId: string) {
    goto("/admin/products/" + productId);
  }

  function deleteProduct(productId: string) {
    appService
      .ShowDialog(
        "Are you sure you want to delete this product?",
        "Delete",
        0
      )
      .then((result) => {
        if (result === "ok") {
          fetch("/api/products/" + productId, {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
          }).then((response) => {
            let index = appService.products.findIndex((x) => x.id == productId);
            appService.products.splice(index, 1);
            products = appService.products;
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
          <table class="flat_table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Data source</th>
                <th>Creation date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.values(products) as prod, i}
                <tr on:click={() => openProduct(prod.id)}>
                  <td>{prod.name}</td>
                  <td>{prod.ownerEmail}</td>
                  <td>{prod.source}</td>
                  {#if prod.createdAt}
                    <td>{prod.createdAt}</td>
                  {:else}
                    <td></td>
                  {/if}
                  <td>
                    {#if prod.status == "Draft"}
                      <span style="color: orange; font-weight: bold;"
                        >Draft</span
                      >
                    {:else}
                      <span style="color: green; font-weight: bold;"
                        >Published</span
                      >
                    {/if}
                  </td>
                  <td style="white-space: pre;">
                    <button>
                      <svg
                        width="18px"
                        viewBox="0 0 18 18"
                        preserveAspectRatio="xMidYMid meet"
                        focusable="false"
                        ><path
                          d="M2 13.12l8.49-8.488 2.878 2.878L4.878 16H2v-2.88zm13.776-8.017L14.37 6.507 11.494 3.63l1.404-1.406c.3-.3.783-.3 1.083 0l1.8 1.796c.3.3.3.784 0 1.083z"
                          fill-rule="evenodd"
                        ></path></svg
                      >
                    </button>
                    <button
                      on:click|stopPropagation={() => deleteProduct(prod.id)}
                    >
                      <svg
                        width="18px"
                        viewBox="0 0 18 18"
                        preserveAspectRatio="xMidYMid meet"
                        focusable="false"
                        ><path
                          d="M6.5 3c0-.552.444-1 1-1h3c.552 0 1 .444 1 1H15v2H3V3h3.5zM4 6h10v8c0 1.105-.887 2-2 2H6c-1.105 0-2-.887-2-2V6z"
                          fill-rule="evenodd"
                        ></path></svg
                      >
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
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
