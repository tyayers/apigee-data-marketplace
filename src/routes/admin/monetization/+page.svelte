<script lang="ts">
  import { goto } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import type {
    User,
    DataProduct,
    MonetizationRatePlan,
  } from "$lib/interfaces";
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
    goto("/admin/monetization/" + productId);
  }

  function deleteProduct(productId: string, monetizationName: string) {
    if (productId && monetizationName) {
      fetch(`/api/products/${productId}/monetization/${monetizationName}`, {
        method: "DELETE"
      }).then((response) => {
        let tempProduct = products?.find(prod => prod.id === productId);
        if (tempProduct) {
          tempProduct.monetizationId = "";
          fetch("/api/products/" + productId, {
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
          <table class="flat_table">
            <thead>
              <tr>
                <th>Product name</th>
                <th>Monetization active</th>
                <th>Plan Id</th>
                <th>Owner</th>
                <th>Data source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.values(products) as prod, i}
                <tr on:click={() => openProduct(prod.id)}>
                  <td>{prod.name}</td>
                  {#if prod.monetizationId}
                    <td>
                      <span style="color: green; font-weight: bold;">Yes</span>
                    </td>
                  {:else}
                    <td>
                      <span style="color: orange; font-weight: bold;">No</span>
                    </td>
                  {/if}
                  {#if prod.monetizationId}
                    <td>{prod.monetizationId}</td>
                  {:else}
                    <td></td>
                  {/if}
                  <td>{prod.ownerEmail}</td>
                  <td>{prod.source}</td>
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
                      on:click|stopPropagation={() => deleteProduct(prod.id, prod.monetizationId)}
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
