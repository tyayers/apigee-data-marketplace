<script lang="ts">
  import { appService } from "$lib/app-service";
  import MenuLeftAccount from "$lib/components-menus-left/menus-left.account.svelte";
  import type { User, BucketSubscription, IdentityConfig } from "$lib/interfaces";
  import type { Bucket } from "@google-cloud/storage";
  import { onMount } from "svelte";

  let currentUser: User | undefined = appService.currentUser;
  let bucketSubscriptions: BucketSubscription[] | undefined = undefined;
  let product: string = "";
  let identityConfig: IdentityConfig;

  onMount(() => {
    document.addEventListener("userUpdated", () => {
      currentUser = appService?.currentUser;
    });

    fetch("/api/identity").then((response) => {
      if (response.status === 404) {
        console.log(response.statusText);
      }
      else if (response.status === 200)
        return response.json();
    }).then((config: IdentityConfig) => {
      identityConfig = config;
    });
  });
</script>

<div class="left_menu_page">
  <MenuLeftAccount selectedName="profile" />

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>Profile</span>
      </div>

      <div class="left_menu_page_right_content">
        {#if currentUser}
          <div class="menu_profile">
            <img
              class="panel_profile_image"
              src={currentUser.photoUrl}
              alt="Profile"
            />
            <div class="profile_info">
              <div class="profile_info_primary">{currentUser.userName}</div>
              <div class="profile_info_secondary" title={currentUser.email}>
                {currentUser.email}
              </div>
              <div class="profile_info_secondary profile_info_divide">
                {currentUser.providerId}
              </div>
            </div>
          </div>
          <div style="margin-top: 64px;">
            <h4>Roles</h4>

            <table class="flat_table" style="max-width: 900px; color: #555;">
              <thead>
                  <tr>
                      <th>Role</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
                {#if identityConfig}
                  {#each identityConfig.roles as role}
                    <tr>
                      <td>{role}</td>
                      {#if currentUser.roles.includes(role)}
                        <td style="color: green;">Granted</td>
                      {:else}
                        <td><button>Request access</button></td>
                      {/if}
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>            
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
  .menu_profile {
    display: flex;
  }

  .profile_info {
    margin-top: 32px;
    margin-left: 18px;
  }

  .profile_info_primary {
    font-size: 16px;
    font-weight: 700;
  }

  .profile_info_secondary {
    font-size: 14px;
    font-weight: normal;
    margin-top: 2px;
    margin-left: 2px;
    width: 250px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .profile_info_divide {
    margin-top: 16px;
  }

  .panel_profile_image {
    margin-left: 20px;
    margin-top: 20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>
