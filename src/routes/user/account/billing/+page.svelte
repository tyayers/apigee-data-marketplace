<script lang="ts">
    import { appService } from "$lib/app-service";
    import { UsageData, type User, type BucketSubscription } from "$lib/interfaces";
    import { onMount } from "svelte";

    let currentUser: User | undefined = appService.currentUser;
    let usageData: UsageData | undefined = undefined;
    let appUsage: {[key: string]: string} | undefined = undefined;

	onMount(() => {
        document.addEventListener("userUpdated", () => {
            currentUser = appService?.currentUser;
        });

        document.addEventListener("appsUpdated", () => {

        });

	});
</script>

<div class="left_menu_page">
    <div class="left_menu_page_left">
        <div class="left_menu_page_left_header">
            <svg class="left_menu_page_left_icon" width="36px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M17 9.008l-3.363-3.363-1.883 1.883 1.48 1.48-1.48 1.48 1.883 1.882L17 9.008zM8.992 1l3.363 3.363-1.883 1.883-1.48-1.48-1.48 1.48L5.63 4.363 8.992 1zm.016 16l-3.363-3.363 1.883-1.883 1.48 1.48 1.48-1.48 1.882 1.883L9.008 17zM1 8.992l3.363 3.363 1.883-1.883-1.48-1.48 1.48-1.48L4.363 5.63 1 8.992zM9.008 7.32l1.688 1.688-1.688 1.688-1.69-1.688 1.69-1.69z" fill-rule="evenodd"></path></svg>
            <span class="left_menu_page_left_title">My account</span>
        </div>
        <div class="left_menu_page_left_list">
            <a href="/user/account" class="side_menu_button">
                <svg class="side_menu_button_logo" width="20px" fill-rule="evenodd" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2.084V5.44a2.56 2.56 0 0 1 0 5.12V12c1.335 0 4 .824 4 2.46v1.265c-.065.094-.126.19-.195.283A7.433 7.433 0 0 1 12 18.738v2.827a11.062 11.062 0 0 0 8-10.667v-5.48l-8-3.334z" opacity=".8"></path><path d="M12 2.084V5.44a2.56 2.56 0 0 0 0 5.12V12c-1.335 0-4 .824-4 2.46v1.265c.065.094.126.19.195.283A7.433 7.433 0 0 0 12 18.738v2.827a11.062 11.062 0 0 1-8-10.667v-5.48l8-3.334z"></path></svg>
                <span class="side_menu_button_name">My profile</span>
            </a>
            <a href="/user/account/products" class="side_menu_button">
              <svg class="side_menu_button_logo" width="20px"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.5276 2H7.47201C6.26919 2 5.66778 2 5.18448 2.2987C4.70117 2.5974 4.43221 3.13531 3.8943 4.21114L2.49068 7.75929C2.16639 8.57905 1.88266 9.54525 2.42854 10.2375C2.79476 10.7019 3.36244 11 3.99978 11C5.10435 11 5.99978 10.1046 5.99978 9C5.99978 10.1046 6.89522 11 7.99978 11C9.10435 11 9.99978 10.1046 9.99978 9C9.99978 10.1046 10.8952 11 11.9998 11C13.1044 11 13.9998 10.1046 13.9998 9C13.9998 10.1046 14.8952 11 15.9998 11C17.1044 11 17.9998 10.1046 17.9998 9C17.9998 10.1046 18.8952 11 19.9998 11C20.6371 11 21.2048 10.7019 21.5711 10.2375C22.117 9.54525 21.8333 8.57905 21.509 7.75929L20.1054 4.21114C19.5674 3.13531 19.2985 2.5974 18.8152 2.2987C18.3319 2 17.7305 2 16.5276 2Z"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 21.25H22C22.4142 21.25 22.75 21.5858 22.75 22C22.75 22.4142 22.4142 22.75 22 22.75H2C1.58579 22.75 1.25 22.4142 1.25 22C1.25 21.5858 1.58579 21.25 2 21.25H4L4 12.5C4.74363 12.5 5.43309 12.2681 6 11.8727C6.56692 12.2681 7.25638 12.5 8 12.5C8.74363 12.5 9.43309 12.2681 10 11.8727C10.5669 12.2681 11.2564 12.5 12 12.5C12.7436 12.5 13.4331 12.2681 14 11.8727C14.5669 12.2681 15.2564 12.5 16 12.5C16.7436 12.5 17.4331 12.2681 18 11.8727C18.5669 12.2681 19.2564 12.5 20 12.5L20 21.25ZM9.5 21.25H14.5V18.5C14.5 17.5654 14.5 17.0981 14.299 16.75C14.1674 16.522 13.978 16.3326 13.75 16.2009C13.4019 16 12.9346 16 12 16C11.0654 16 10.5981 16 10.25 16.2009C10.022 16.3326 9.83261 16.522 9.70096 16.75C9.5 17.0981 9.5 17.5654 9.5 18.5V21.25Z"></path> </g></svg>
              <span class="side_menu_button_name">Published products</span>
            </a>
            <a href="/user/account/usage" class="side_menu_button">
              <svg style="position: relative; top: -2px" class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M10.83 16.33h2.33v1.85h-2.33zM5.5 12.76L7.88 9.6a.55.55 0 01.37-.22.63.63 0 01.42.12l2.12 1.72 2.8-2.94a.54.54 0 01.4-.17.54.54 0 01.4.17l4.33 4.48H22V6a.74.74 0 00-.74-.74H2.74A.74.74 0 002 6v6.81z" opacity=".6"></path><path d="M18.48 13.87a.56.56 0 01-.4-.17L14 9.47l-2.74 2.89a.57.57 0 01-.76.05l-2.08-1.68-2.2 2.92a.56.56 0 01-.45.22H2v1.71a.75.75 0 00.74.75h18.52a.75.75 0 00.74-.75v-1.71zM9 18.18h6a.29.29 0 01.3.3.29.29 0 01-.3.3H9a.29.29 0 01-.3-.3.29.29 0 01.3-.3z" opacity=".8"></path></svg>
              <span class="side_menu_button_name">Usage</span>
            </a>
            <a href="#" class="side_menu_button">
                <svg class="side_menu_button_logo" width="20px" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M16.61 12.73a1.49 1.49 0 001.31-.73l2.85-5.1a1.49 1.49 0 00-1.31-2.23H7l-.87-1.9H3v1.5h2.21L8.76 12l-1.15 2.35A1.5 1.5 0 009 16.5h10.79V15H9l1.1-2.27zm2.85-6.6l-2.85 5.1h-6.54l-2.34-5.1z" fill="currentColor"></path><g opacity=".8" fill="currentColor"><circle cx="8.61" cy="19.4" r="1.87"></circle><circle cx="17.92" cy="19.4" r="1.87"></circle></g></svg>
                <span class="side_menu_button_name">Credits</span>
            </a>
            <a href="/user/account/billing" class="side_menu_button side_menu_button_selected">
                <svg style="position: relative; top: -2px" class="side_menu_button_logo side_menu_button_logo_selected" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M3 7h9v2H3z" opacity=".4"></path><path d="M12 7h9v2h-9z" opacity=".3"></path><path d="M5 11h14v2H5z" opacity=".6"></path><path d="M4 5a1 1 0 0 0-1 1v1h9V5H4z"></path><path d="M20 5h-8v2h9V6a1 1 0 0 0-1-1z" opacity=".9"></path><path d="M12 11V9H3v9a1 1 0 0 0 1 1l8-.004V13H5v-2h7zm-4 4v2H5v-2h3z"></path><path d="M5 15h3v2H5z" opacity=".4"></path><path d="M12 9v2h7v2h-7v5.996l8-.004a1 1 0 0 0 1-1V9h-9zm3 7h-1v-1h1v1zm3 0h-1v-1h1v1z" opacity=".9"></path><path d="M14 15h1v1h-1zm3 0h1v1h-1z" opacity=".6"></path></svg>
                <span class="side_menu_button_name side_menu_button_name_selected">Billing</span>
            </a>
        </div>
    </div>

    <div class="left_menu_page_right">

        <div>
            <div class="left_menu_page_right_header">
                <span>Billing (WIP)</span>
            </div>

            <div class="left_menu_page_right_content">
                <h3>Current month</h3>

                <h4>My app</h4>

                <img width="500px" src="/stoxx_rate.png" alt="rate"/>

                <h4>Research app</h4>

                <img width="500px" src="/index_research_rate.png" alt="rate"/>

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
        box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
        padding: 16px 20px;
        border-radius: 44px;
        margin: 12px;
    }

    .app_card:hover {
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
        cursor: pointer;
    }
</style>