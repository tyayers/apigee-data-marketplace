<script lang="ts">
  import { appService } from "$lib/app-service";
  import type { User, DataProduct, IdentityConfig } from "$lib/interfaces";
  import MenuLeftAdmin from "$lib/components-menus-left/menus-left.admin.svelte";
  import { onMount } from "svelte";

  let users: User[] | undefined = undefined;

  onMount(() => {
    fetch("/api/identity/users").then((response) => {
      if (response.status === 404) {
        console.log(response.statusText);
      }
      else if (response.status === 200)
        return response.json();
    }).then((data: User[]) => {
      users = data;
    });
  });

  function openUser(role: string) {

  }

  function deleteUser(role: string) {

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
          <table class="flat_table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th> 
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each users as user, i}
                <tr on:click={() => openUser(user.email)}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.join(", ")}</td>
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
                      on:click|stopPropagation={() => deleteUser(user.email)}
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