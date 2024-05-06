<script lang="ts">
  import { appService } from "$lib/app-service";
  import {
    UsageData,
    type User,
    type BucketSubscription,
  } from "$lib/interfaces";
  import { onMount } from "svelte";
  import MenuLeftAccount from "$lib/components-menus-left/menus-left.account.svelte";

  let currentUser: User | undefined = appService.currentUser;
  let usageData: UsageData | undefined = undefined;
  let appUsage: { [key: string]: string } | undefined = undefined;

  onMount(() => {
    document.addEventListener("userUpdated", () => {
      currentUser = appService?.currentUser;
    });

    document.addEventListener("appsUpdated", () => {});
  });
</script>

<div class="left_menu_page">
  <MenuLeftAccount selectedName="billing" />
  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
        <span>Billing (WIP)</span>
      </div>

      <div class="left_menu_page_right_content">
        <h3>Current month</h3>

        <h4>My app</h4>

        <img width="500px" src="/stoxx_rate.png" alt="rate" />

        <h4>Research app</h4>

        <img width="500px" src="/index_research_rate.png" alt="rate" />

        <h2>Total:</h2>
        <h1>$1147.89</h1>
      </div>
    </div>
  </div>
</div>

<style>
  .app_box {
    display: flex;
    margin-left: 68px;
  }

  .app_card {
    width: 100px;
    height: 100px;
    color: black;
    background-color: #fff;
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 1px 5px 0px,
      rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
    padding: 16px 20px;
    border-radius: 44px;
    margin: 12px;
  }

  .app_card:hover {
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }
</style>
