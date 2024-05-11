<script lang="ts">
  import { SLA } from "$lib/interfaces";
  import { onMount } from "svelte";
  import MenuLeftAdmin from '$lib/components-menus-left/menus-left.admin.svelte';
  import SLAEdit from '$lib/components.sla-edit.svelte';
  import { goto } from "$app/navigation";
  import { generateRandomString } from "$lib/utils";
  import type { PageData } from "./$types";
  
  export let data: PageData;

  let sla: SLA;

  onMount(() => {
    fetch("/api/slas/" + data.slaId).then((response) => {
      if (response.status === 404) {
        console.log(response.statusText);
      }
      else if (response.status === 200)
        return response.json();
    }).then((slaResult: SLA) => {
      sla = slaResult;
    });
  });

  function back() {
    goto("/admin/slas");
  }

  function submit() {
    fetch("/api/slas", {
      method: 'PUT',
      body: JSON.stringify(sla),
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: SLA) => {
      goto("/admin/slas");
    }).catch((error) => {
      console.error(error);
    });

  }
</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="slas" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
          <button class="back_button" on:click={back}>
            <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
          </button>            
          <span>Edit SLA</span>
      </div>

      <div class="right_content">
        {#if sla}
          <SLAEdit {sla} />

          <div class="form_controls">
            <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
            <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
          </div>
        {/if}
      </div>

    </div>
  </div>
</div>
