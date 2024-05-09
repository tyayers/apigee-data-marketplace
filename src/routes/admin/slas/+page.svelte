<script lang="ts">
  import { appService } from "$lib/app-service";
  import type { SLA } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";

  let slas: SLA[] = [];

  onMount(() => {
    fetch("/api/admin/slas").then((response) => {
      if (response.status === 404) {
        console.log(response.statusText);
      }
      else if (response.status === 200)
        return response.json();
    }).then((slaResults: SLA[]) => {
      slas = slaResults;
    });
  });

  function openSLA(role: string) {

  }

  function deleteSLA(role: string) {

  }


</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="slas" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>SLAs</span><a
          href="/admin/slas/new"
          class="text_button left_menu_page_right_header_button"
          style="margin-left: 18px;"
          >+ Add SLA definition</a
        >
      </div>

      <div class="left_menu_page_right_content">
        {#if slas}
          <table class="flat_table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Metric</th>
                <th>Limit</th>
                <th>Percent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each slas as sla, i}
                <tr on:click={() => openSLA(sla.id)}>
                  <td>{sla.name}</td>
                  <td>{sla.description}</td>
                  <td>{sla.metric}</td>
                  <td>{sla.limit}</td>
                  <td>{sla.percent + " %"}</td>
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
                      on:click|stopPropagation={() => deleteSLA(sla.id)}
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


<style>

</style>