<script lang="ts">
    import { appService } from "$lib/app-service";
    import type { AHSubscription, AppUser } from "$lib/interfaces";
    import { onMount } from "svelte";

    let currentUser: AppUser | undefined = appService.currentUser;
    let hubSubscriptions: AHSubscription[] | undefined = undefined;

    onMount(() => {
        document.addEventListener("userUpdated", () => {
            currentUser = appService?.currentUser;
            getAHSubscriptions();            
        });

        if (currentUser) getAHSubscriptions();
	});

    function getAHSubscriptions() {
        fetch("/api/bigquery?email=" + currentUser?.email, {
            method: 'GET',
            headers: {
            'content-type': 'application/json',
            },
        }).then((response) => {
            return response.json();
        }).then((data: AHSubscription[]) => {
            console.log(data);
            hubSubscriptions = data;
        });
    }

    function deleteSubscription(sub: AHSubscription) {
        appService.ShowDialog("Are you sure you want to delete this subscription dataset?", "Delete", 0).then((result) => {
            if (result === "ok") {
                fetch("/api/bigquery?email=" + appService.currentUser?.email + "&project=" + sub.project + "&dataset=" + sub.dataset, {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                }).then((response) => {
                    let newHubSubscriptions = hubSubscriptions;
                    let index = newHubSubscriptions?.indexOf(sub);
                    if (index)
                        newHubSubscriptions?.splice(index, 1);

                    hubSubscriptions = newHubSubscriptions;
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }
</script>

<div class="left_menu_page">

    <div class="left_menu_page_left">
        <div class="left_menu_page_left_header">
            <svg class="left_menu_page_left_icon" width="36px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M17 9.008l-3.363-3.363-1.883 1.883 1.48 1.48-1.48 1.48 1.883 1.882L17 9.008zM8.992 1l3.363 3.363-1.883 1.883-1.48-1.48-1.48 1.48L5.63 4.363 8.992 1zm.016 16l-3.363-3.363 1.883-1.883 1.48 1.48 1.48-1.48 1.882 1.883L9.008 17zM1 8.992l3.363 3.363 1.883-1.883-1.48-1.48 1.48-1.48L4.363 5.63 1 8.992zM9.008 7.32l1.688 1.688-1.688 1.688-1.69-1.688 1.69-1.69z" fill-rule="evenodd"></path></svg>
            <span class="left_menu_page_left_title">My subscriptions</span>
        </div>
        <div class="left_menu_page_left_list">
            <a href="/apps/api" class="side_menu_button">
                <svg class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M9.874 10H12v2h3v-2h1V8H9.874A4.002 4.002 0 0 0 2 9a4 4 0 0 0 7.874 1zM6 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill-rule="evenodd"></path></svg>
                <span class="side_menu_button_name">Credentials</span>
            </a>
            <a href="/apps/bigquery" class="side_menu_button side_menu_button_selected">
                <svg class="side_menu_button_logo side_menu_button_logo_selected" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.9 8.76L6 7.58a1.09 1.09 0 000-.26 1 1 0 10-.33.75l2 1.17a.28.28 0 00.15 0A.31.31 0 008 9.15a.29.29 0 00-.1-.39zM5 7.78a.46.46 0 010-.92.46.46 0 010 .92z"></path><path d="M6.9 14.12A5.12 5.12 0 1112 9a5.13 5.13 0 01-5.1 5.12zM6.9 5a4 4 0 104 4 4 4 0 00-4-4z"></path><path d="M14.83 11.66a1.4 1.4 0 00-.83.27L9.68 9.45a1.72 1.72 0 000-.9L14 6.07A1.39 1.39 0 1013.43 5a.68.68 0 000 .14L9.08 7.59a1.85 1.85 0 100 2.82l4.37 2.5a.68.68 0 000 .14 1.4 1.4 0 101.4-1.39z"></path></svg>            
                <span class="side_menu_button_name side_menu_button_name_selected">Analytics Hub subscriptions</span>
            </a>
            <a href="/apps/buckets" class="side_menu_button">
                <svg class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.027 11h6.978c.55 0 .995.443.995 1v1c0 .553-.456 1-.995 1H7.027v1.758L2 12.378 7.027 9v2zM11 4H3.995C3.455 4 3 4.447 3 5v1c0 .557.446 1 .995 1H11v1.79l5.027-3.396L11 2v2z" fill-rule="evenodd"></path></svg>
                <span class="side_menu_button_name">Data syncs</span>
            </a>
        </div>
    </div>

    <div class="left_menu_page_right">

        <div>
            <div class="left_menu_page_right_header">
                <span>Analytics Hub subscriptions</span><a href="/apps/bigquery/new" class="text_button right_panel_header_button">+ Create subscription</a>
            </div>

            <div class="left_menu_page_right_content">
                {#if hubSubscriptions}
                    <table class="flat_table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Creation date</th>
                                <th>Project</th>
                                <th>Dataset</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if hubSubscriptions}
                                {#each hubSubscriptions as sub}
                                        <tr>
                                            <td>{sub.product}</td>
                                            <td>{sub.createdAt}</td>
                                            <td>{sub.project}</td>
                                            <td>
                                                <a target="_blank" href={"https://console.cloud.google.com/bigquery?project=cloud32x&ws=!1m4!1m3!3m2!1s" + sub.project + "!2s" + sub.dataset}>
                                                    {sub.dataset}
                                                </a>
                                            </td>
                                            <td>
                                                {#if sub.status === "Inactive"}
                                                    <span style="color: red; font-weight: bold;" title="Your subscription could be automatically created, please register manually at the Analytics Hub product page.">{sub.status}</span>
                                                {:else}
                                                    <span style="color: green; font-weight: bold;">{sub.status}</span>
                                                {/if}
                                            </td>
                                            <td>
                                                <button on:click|stopPropagation={() => deleteSubscription(sub)}>
                                                    <svg width="18px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M6.5 3c0-.552.444-1 1-1h3c.552 0 1 .444 1 1H15v2H3V3h3.5zM4 6h10v8c0 1.105-.887 2-2 2H6c-1.105 0-2-.887-2-2V6z" fill-rule="evenodd"></path></svg>                                    
                                                </button>
                                            </td>                                        
                                        </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                {:else}
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                {/if}
            </div>
        </div>
    </div>

</div>

<style>
    .right_panel_content {
        width: 100%;
    }

    .panel_table_content {
        width: 90%;
        margin-left: 24px;
    }
</style>