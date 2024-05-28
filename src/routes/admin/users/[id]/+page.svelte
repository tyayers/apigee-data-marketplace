<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import { DataProduct, User } from '$lib/interfaces';
  import MenuLeftAdmin from '$lib/components-menus-left/menus-left.admin.svelte';
  import ProductEditor from '$lib/components.product-edit.svelte';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  export let data: PageData;
  let userData: User;
  
  onMount(async () => {
    fetch("/api/users/" + data.userId).then((response) => {
      return response.json();
    }).then((data: User) => {
      userData = data;
    }).catch((err) => {
      console.error("Error loading user data in admin user management.");
      console.error(err);
    });
  });

  function submit() {
    
  }

  function back() {
    goto("/admin/users");
  }

</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="users" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
          <button class="back_button" on:click={back}>
            <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
          </button>            
          <span>Edit user</span>
      </div>

      <div class="right_content">
        {#if userData}
          <div>{JSON.stringify(userData)}</div>
          <div class="form_controls">
            <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
            <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
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