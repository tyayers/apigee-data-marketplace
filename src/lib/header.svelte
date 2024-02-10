<script lang="ts">
  import { onMount } from 'svelte';
  import { AppUser } from './interfaces';
  import { appService } from './app-service';
	import { goto } from '$app/navigation';

  let currentUser: AppUser | undefined = appService.currentUser;
  
  let menuVisible: boolean = false;

  onMount(async () => {
    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;
    });
  });

  function signOut() {
    appService.SignOut();
    goto("/");
  }

</script>

<div class="header">
  <span class="header-left-panel1">
    Data Marketplace
  </span>

  <span class="header-right-panel1">
    
    {#if currentUser}
      <button
        on:click={() => { menuVisible = !menuVisible; }}
        on:keydown={() => { menuVisible = !menuVisible; }}
        class="profile_button"
      >
        <img class="profile_button_image" src={currentUser.PhotoURL} alt="The user's profile." />
      </button>

      {#if menuVisible}
        <div class="menuPanel">
          <div class="arrow" />
          <div class="menu">
            <div class="panel">
              <button class="result">Account</button>
              <button class="result" on:click={signOut}>Sign Out</button>
            </div>
          </div>
        </div>
      {/if}

    {:else}
      <span>
        <a href="/sign-in" class="rounded_button_filled">Sign In</a>
        <a href="/sign-in" class="rounded_button_outlined">Register</a>
      </span>
    {/if}
  </span>
</div>

<style>
  .header {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: flex-start;

    height: 57px;
    background-color: rgba(255, 255, 255, 1);
    width: 100vw;
    border-bottom: solid 3px rgba(242, 242, 242, 1);

    font-weight: 560;
    color: #333;
    font-size: 20px;

    padding: 0px;
    margin: 0px;

    position: sticky;
    top: 0;
  }

  .header-left-panel1 {
    margin-top: 16px;
    margin-left: 24px;
    cursor: pointer;
  }

  .header-right-panel1 {
    margin-top: 7px;
    margin-right: 24px;
    
  }

  .profile_button {
    position: relative;
    top: 2px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }

  .profile_button_image {
    position: relative;
    top: -3px;
    left: -7px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .menuPanel {
    position: absolute;
    top: 50px;
    right: 10px;
  }

  .menu {
    position: relative;
    left: -4px;
    top: -1px;
    max-height: 200px;
    width: 140px;
    overflow-y: auto;
    border-radius: 3px;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
    border: 1px solid rgb(242, 242, 242);
    border-radius: 4px;
  }

  .panel {
    position: relative;
    background: rgb(255, 255, 255);
    width: 100%;
    height: 100%;
    z-index: 2;
    padding-top: 20px;
    /* padding-bottom: 20px; */
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .arrow {
    position: relative;
    top: -15px;
    left: 100px;
    z-index: 1;
    border: 1px solid rgb(242, 242, 242);
    box-shadow: rgba(0, 0, 0, 0.15) -1px -1px 1px -1px;
    transform: rotate(45deg) translate(16px, 16px);
    background: rgb(255, 255, 255);
    height: 14px;
    width: 14px;
    display: block;
    content: "";
    pointer-events: none;
  }
  
  .result {
    display: block;
    padding-top: 5px;
    padding-bottom: 8px;
    padding-left: 10px;
    color: black;
    /* border-bottom: 1px dashed rgb(242, 242, 242); */
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    font-weight: 200;
    background-color: transparent;
    border-width: 0px;
  }
</style>