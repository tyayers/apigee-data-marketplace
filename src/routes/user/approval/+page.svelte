<script lang="ts">
    import { goto } from "$app/navigation";
    import { appService } from "$lib/app-service";
  import type { Developer } from "$lib/interfaces";
    import { onMount } from "svelte";

	onMount(() => {
    setInterval(() => {
      if (appService.currentUser) {
        fetch("/api/developers?email=" + appService.currentUser.email, {
          method: 'GET',
          headers: {
              'content-type': 'application/json',
          },
        }).then((response) => {
            return response.json();
        }).then((data: Developer) => {
          if (data && appService.currentUser && data.email == appService.currentUser.email) {
            appService.reloadFlag = true;
            goto("/home");
          }
        });
        // appService.GetDeveloper(appService.currentUser.email).then((result) => {
        //   if (result && appService.currentUser && result.email == appService.currentUser.email) {
        //     appService.reloadFlag = true;
        //     goto("/home");
        //   }
        // })
      }
    }, 5000);
  });
</script>

<div class="approval">
  <div class="approval_message">
    Thank you for registering, you will be notified by email when your registration is approved, and you can sign-in to the Data Marketplace. 
  </div>
</div>

<style>
  .approval {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 100%;
    width: 100%;
    z-index: 2;
    background: white;
  }

  .approval_message {
    text-align: center;
    padding-top: 240px;
    font-size: 24px;
    padding-left: 20%;
    padding-right: 20%;
  }
</style>