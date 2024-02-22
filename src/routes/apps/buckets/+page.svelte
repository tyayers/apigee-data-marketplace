<script lang="ts">
    import { appService } from "$lib/app-service";
    import type { AppUser, BucketSubscription } from "$lib/interfaces";
    import { onMount } from "svelte";


    let currentUser: AppUser | undefined = appService.currentUser;
    let bucketSubscriptions: BucketSubscription[] | undefined = undefined;
    let product: string = "";

	onMount(() => {
        document.addEventListener("userUpdated", () => {
            currentUser = appService?.currentUser;
            getSignedUrls();            
        });

        if (currentUser) getSignedUrls();
	});

    function getSignedUrls() {
        fetch("/api/storage?email=" + currentUser?.email, {
            method: 'GET',
            headers: {
            'content-type': 'application/json',
            },
        }).then((response) => {
            return response.json();
        }).then((data: BucketSubscription[]) => {
            console.log(data);
            bucketSubscriptions = data;
        });
    }

    // function addSignedUrl() {
    //     fetch("/api/storage?email=" + currentUser?.email + "&product=ESH%20Analytics", {
    //         method: 'POST',
    //         headers: {
    //         'content-type': 'application/json',
    //         },
    //     }).then((response) => {
    //         return response.json();
    //     }).then((data: any) => {
    //         console.log(data);
    //         signedUrls = data;
    //     });
    // }

</script>

<div class="apps">

    <div class="apps_left_panel">
        <div class="apps_left_panel_header">
            <svg class="apps_left_panel_logo" width="36px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M17 9.008l-3.363-3.363-1.883 1.883 1.48 1.48-1.48 1.48 1.883 1.882L17 9.008zM8.992 1l3.363 3.363-1.883 1.883-1.48-1.48-1.48 1.48L5.63 4.363 8.992 1zm.016 16l-3.363-3.363 1.883-1.883 1.48 1.48 1.48-1.48 1.882 1.883L9.008 17zM1 8.992l3.363 3.363 1.883-1.883-1.48-1.48 1.48-1.48L4.363 5.63 1 8.992zM9.008 7.32l1.688 1.688-1.688 1.688-1.69-1.688 1.69-1.69z" fill-rule="evenodd"></path></svg>
            <span class="apps_left_panel_title">My subscriptions</span>
        </div>
        <div class="apps_left_panel_menu">
            <a href="/apps/api" class="side_menu_button">
                <svg class="side_menu_button_logo " width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M9.874 10H12v2h3v-2h1V8H9.874A4.002 4.002 0 0 0 2 9a4 4 0 0 0 7.874 1zM6 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill-rule="evenodd"></path></svg>
                <span class="side_menu_button_name ">Credentials</span>
            </a>
            <a href="/apps/bigquery" class="side_menu_button">
                <svg class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.9 8.76L6 7.58a1.09 1.09 0 000-.26 1 1 0 10-.33.75l2 1.17a.28.28 0 00.15 0A.31.31 0 008 9.15a.29.29 0 00-.1-.39zM5 7.78a.46.46 0 010-.92.46.46 0 010 .92z"></path><path d="M6.9 14.12A5.12 5.12 0 1112 9a5.13 5.13 0 01-5.1 5.12zM6.9 5a4 4 0 104 4 4 4 0 00-4-4z"></path><path d="M14.83 11.66a1.4 1.4 0 00-.83.27L9.68 9.45a1.72 1.72 0 000-.9L14 6.07A1.39 1.39 0 1013.43 5a.68.68 0 000 .14L9.08 7.59a1.85 1.85 0 100 2.82l4.37 2.5a.68.68 0 000 .14 1.4 1.4 0 101.4-1.39z"></path></svg>            
                <span class="side_menu_button_name">Analytics Hub subscriptions</span>
            </a>
            <a href="/apps/buckets" class="side_menu_button side_menu_button_selected">
                <svg class="side_menu_button_logo side_menu_button_logo_selected" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.027 11h6.978c.55 0 .995.443.995 1v1c0 .553-.456 1-.995 1H7.027v1.758L2 12.378 7.027 9v2zM11 4H3.995C3.455 4 3 4.447 3 5v1c0 .557.446 1 .995 1H11v1.79l5.027-3.396L11 2v2z" fill-rule="evenodd"></path></svg>
                <span class="side_menu_button_name side_menu_button_name_selected">Data syncs</span>
            </a>
        </div>
    </div>

    <div class="apps_right_panel">

        <div class="right_panel_content">
            <div class="right_panel_header">
                <span>Data syncs</span><a href="/apps/buckets/new" class="text_button right_panel_header_button">+ Create sync</a>
            </div>

            <div class="panel_table_content">
                <table class="panel_table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Creation date</th>
                            <th style="max-width: 200px">Signed URL</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if bucketSubscriptions}
                            {#each bucketSubscriptions as sub}
                                <tr>
                                    <td>{sub.product}</td>
                                    <td>{sub.createdAt}</td>
                                    <td><a href={sub.url} target="_blank">{sub.url.slice(0, 100) + "..."}</a></td>
                                    <td>
                                        {#if sub.status === "Invalid"}
                                            <span style="color: red; font-weight: bold;">{sub.status}</span>
                                        {:else}
                                            <span style="color: green; font-weight: bold;">{sub.status}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    
    </div>

</div>

<style>
    .apps {
        width: 100%;
        display: flex;
    }

    .apps_left_panel {
        width: 320px;
        height: 90vh;
        border-right: solid 2px rgba(242, 242, 242, 1);
    }

    .apps_left_panel_header {
        height: 45px;
        border-bottom: solid 2px rgba(242, 242, 242, 1);
    }

    .apps_left_panel_logo {
        position: relative;
        top: 4px;
        left: 22px;
    }

    .apps_left_panel_title {
        position: relative;
        top: -8px;
        left: 30px;
        font-size: 18px;
    }

    .apps_left_panel_menu {
        margin-top: 6px;
    }

    .apps_right_panel {
        width: 100%;
    }

    .right_panel_header {
        display: flex;
        align-items: center;
        height: 45px;
        border-bottom: solid 2px rgba(242, 242, 242, 1);
    }

    .right_panel_header_button {
        margin-left: 34px;
    }

    .right_panel_header span {
        text-align: center;
        padding-left: 24px;
        font-size: 18px;
    }

    .right_panel_content {
        width: 100%;
    }

    .panel_table_content {
        width: 90%;
        margin-left: 24px;
    }

    .panel_table {
        margin-top: 44px;
       
        width: 100%;
        border-collapse: collapse; 
        margin: 25px 0;
        font-size: 13px;
        /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); */
    }

    .panel_table thead {
        background-color: #ececec;
        height: 34px;
        font-size: 14px;
        
    }

    .panel_table thead tr th {
        text-align: left;
        border-bottom: solid 1px #d1d1d1;
        padding-left: 12px;
    }

    .panel_table tbody tr:hover {
        height: 30px;
        cursor: pointer;
        border-bottom: solid 1px #d1d1d1;
        background-color: #ececec;
    }

    .panel_table tbody tr td {
        height: 30px;
        border-bottom: solid 1px #d1d1d1;
        padding-left: 14px;
    }
</style>