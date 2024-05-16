<script lang="ts">
  import { SLA } from "$lib/interfaces";
  import { onMount } from "svelte";
  import MenuLeftAdmin from '$lib/components-menus-left/menus-left.admin.svelte';
  import SLAEdit from '$lib/components.sla-edit.svelte';
  import { goto } from "$app/navigation";
  import { generateRandomString } from "$lib/utils";

  let sla: SLA = new SLA(generateRandomString(4), "", "");

  onMount(() => {
    
  });

  function back() {
    goto("/admin/slas");
  }

  function submit() {
    // sla.createdAt = new Date().toString();
    sla.id = sla.name.toLowerCase().replaceAll(" ", "_").replace("%", "") + "_" + sla.id;
    //if (appService.currentUser) product.ownerEmail = appService.currentUser.email;
    
    fetch("/api/slas", {
      method: 'POST',
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
          <span>Create SLA</span>
      </div>

      <div class="right_content">
        
        <SLAEdit {sla} />

        <div class="form_controls">
          <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
          <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
        </div>
      </div>

    </div>
  </div>
</div>


