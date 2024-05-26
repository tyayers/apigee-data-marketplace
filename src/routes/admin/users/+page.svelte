<script lang="ts">
  import type { User, DataProduct, IdentityConfig, FlatTableData } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import FlatTable from "$lib/components.flat-table.svelte";
  import { onMount } from "svelte";
  import { appService } from "$lib/app-service";

  let users: User[] | undefined = undefined;

  let usersTableConfig: FlatTableData = {
    headers: [{
      name: "userName",
      displayName: "Username",
      sortable: true,
      searchable: true
    }, {
      name: "email",
      displayName: "Email",
      sortable: true,
      searchable: true
    }, {
      name: "roles",
      displayName: "Roles",
      sortable: true,
      searchable: true,
    }],
    data: [],
    styles: []
  };

  onMount(() => {
    fetch("/api/identity/users").then((response) => {
      if (response.status === 404) {
      }
      else if (response.status === 200)
        return response.json();
    }).then((data: User[]) => {
      users = data;
      usersTableConfig.data = users;
    });
  });

  function onRowClick(user: User) {
    
  }

  function onRowDelete(user: User) {

  }


</script>

<div class="left_menu_page">
  <MenuLeftAdmin selectedName="users" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>Users</span><a
          href="/admin/products/new"
          class="text_button left_menu_page_right_header_button"
          >+ Add role</a
        >
      </div>

      <div class="left_menu_page_right_content">
        {#if users}
          <FlatTable data={usersTableConfig} {onRowClick} {onRowDelete} />
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