<script lang="ts">
	import { goto } from '$app/navigation';
  import { appService } from '$lib/app-service';
  import type { DataProduct } from '$lib/interfaces';

  let name: string = "";
  let description: string = "";
  let source: string = "BigQuery";
  let query: string = "";

  function submit() {
    let createdAt = new Date().toString();
    fetch("/api/products?email=" + appService.currentUser?.email + "&name=" + name + "&description=" + description + "&dataSource=" + source + "&query=" + query + "&createdAt=" + createdAt, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: DataProduct) => {
        goto("/user/account/products");
    }).catch((error) => {
      console.error(error);
    });
  }

  function back() {
    goto("/user/account/products");
  }
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
          <a href="/user/account/products" class="side_menu_button side_menu_button_selected">
            <svg class="side_menu_button_logo side_menu_button_logo_selected" width="20px"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.5276 2H7.47201C6.26919 2 5.66778 2 5.18448 2.2987C4.70117 2.5974 4.43221 3.13531 3.8943 4.21114L2.49068 7.75929C2.16639 8.57905 1.88266 9.54525 2.42854 10.2375C2.79476 10.7019 3.36244 11 3.99978 11C5.10435 11 5.99978 10.1046 5.99978 9C5.99978 10.1046 6.89522 11 7.99978 11C9.10435 11 9.99978 10.1046 9.99978 9C9.99978 10.1046 10.8952 11 11.9998 11C13.1044 11 13.9998 10.1046 13.9998 9C13.9998 10.1046 14.8952 11 15.9998 11C17.1044 11 17.9998 10.1046 17.9998 9C17.9998 10.1046 18.8952 11 19.9998 11C20.6371 11 21.2048 10.7019 21.5711 10.2375C22.117 9.54525 21.8333 8.57905 21.509 7.75929L20.1054 4.21114C19.5674 3.13531 19.2985 2.5974 18.8152 2.2987C18.3319 2 17.7305 2 16.5276 2Z"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 21.25H22C22.4142 21.25 22.75 21.5858 22.75 22C22.75 22.4142 22.4142 22.75 22 22.75H2C1.58579 22.75 1.25 22.4142 1.25 22C1.25 21.5858 1.58579 21.25 2 21.25H4L4 12.5C4.74363 12.5 5.43309 12.2681 6 11.8727C6.56692 12.2681 7.25638 12.5 8 12.5C8.74363 12.5 9.43309 12.2681 10 11.8727C10.5669 12.2681 11.2564 12.5 12 12.5C12.7436 12.5 13.4331 12.2681 14 11.8727C14.5669 12.2681 15.2564 12.5 16 12.5C16.7436 12.5 17.4331 12.2681 18 11.8727C18.5669 12.2681 19.2564 12.5 20 12.5L20 21.25ZM9.5 21.25H14.5V18.5C14.5 17.5654 14.5 17.0981 14.299 16.75C14.1674 16.522 13.978 16.3326 13.75 16.2009C13.4019 16 12.9346 16 12 16C11.0654 16 10.5981 16 10.25 16.2009C10.022 16.3326 9.83261 16.522 9.70096 16.75C9.5 17.0981 9.5 17.5654 9.5 18.5V21.25Z"></path> </g></svg>
            <span class="side_menu_button_name side_menu_button_name_selected">Published products</span>
          </a>
          <a href="/user/account/usage" class="side_menu_button">
            <!-- <svg class="side_menu_button_logo side_menu_button_logo_selected" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M7.9 8.76L6 7.58a1.09 1.09 0 000-.26 1 1 0 10-.33.75l2 1.17a.28.28 0 00.15 0A.31.31 0 008 9.15a.29.29 0 00-.1-.39zM5 7.78a.46.46 0 010-.92.46.46 0 010 .92z"></path><path d="M6.9 14.12A5.12 5.12 0 1112 9a5.13 5.13 0 01-5.1 5.12zM6.9 5a4 4 0 104 4 4 4 0 00-4-4z"></path><path d="M14.83 11.66a1.4 1.4 0 00-.83.27L9.68 9.45a1.72 1.72 0 000-.9L14 6.07A1.39 1.39 0 1013.43 5a.68.68 0 000 .14L9.08 7.59a1.85 1.85 0 100 2.82l4.37 2.5a.68.68 0 000 .14 1.4 1.4 0 101.4-1.39z"></path></svg>             -->
            <svg style="position: relative; top: -2px" class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M10.83 16.33h2.33v1.85h-2.33zM5.5 12.76L7.88 9.6a.55.55 0 01.37-.22.63.63 0 01.42.12l2.12 1.72 2.8-2.94a.54.54 0 01.4-.17.54.54 0 01.4.17l4.33 4.48H22V6a.74.74 0 00-.74-.74H2.74A.74.74 0 002 6v6.81z" opacity=".6"></path><path d="M18.48 13.87a.56.56 0 01-.4-.17L14 9.47l-2.74 2.89a.57.57 0 01-.76.05l-2.08-1.68-2.2 2.92a.56.56 0 01-.45.22H2v1.71a.75.75 0 00.74.75h18.52a.75.75 0 00.74-.75v-1.71zM9 18.18h6a.29.29 0 01.3.3.29.29 0 01-.3.3H9a.29.29 0 01-.3-.3.29.29 0 01.3-.3z" opacity=".8"></path></svg>
            <span class="side_menu_button_name">Usage</span>
          </a>
          <a href="#" class="side_menu_button">
            <svg class="side_menu_button_logo" width="20px" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M16.61 12.73a1.49 1.49 0 001.31-.73l2.85-5.1a1.49 1.49 0 00-1.31-2.23H7l-.87-1.9H3v1.5h2.21L8.76 12l-1.15 2.35A1.5 1.5 0 009 16.5h10.79V15H9l1.1-2.27zm2.85-6.6l-2.85 5.1h-6.54l-2.34-5.1z" fill="currentColor"></path><g opacity=".8" fill="currentColor"><circle cx="8.61" cy="19.4" r="1.87"></circle><circle cx="17.92" cy="19.4" r="1.87"></circle></g></svg>
            <span class="side_menu_button_name">Credits</span>
          </a>
          <a href="/user/account/billing" class="side_menu_button">
            <svg style="position: relative; top: -2px" class="side_menu_button_logo" width="20px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M3 7h9v2H3z" opacity=".4"></path><path d="M12 7h9v2h-9z" opacity=".3"></path><path d="M5 11h14v2H5z" opacity=".6"></path><path d="M4 5a1 1 0 0 0-1 1v1h9V5H4z"></path><path d="M20 5h-8v2h9V6a1 1 0 0 0-1-1z" opacity=".9"></path><path d="M12 11V9H3v9a1 1 0 0 0 1 1l8-.004V13H5v-2h7zm-4 4v2H5v-2h3z"></path><path d="M5 15h3v2H5z" opacity=".4"></path><path d="M12 9v2h7v2h-7v5.996l8-.004a1 1 0 0 0 1-1V9h-9zm3 7h-1v-1h1v1zm3 0h-1v-1h1v1z" opacity=".9"></path><path d="M14 15h1v1h-1zm3 0h1v1h-1z" opacity=".6"></path></svg>
            <span class="side_menu_button_name">Billing</span>
          </a>
      </div>
  </div>

  <div class="left_menu_page_right">
    <div>
      <div class="left_menu_page_right_header">
          <button class="back_button" on:click={back}>
            <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
          </button>            
          <span>Create product</span>
      </div>

      <div class="right_content">
        
        <div class="right_content_tip">
          Give your data product an appropriate name and description, and enter the query and data source to connect the product to.
          Finally, configure which protocols and target groups your product should be offered to.
          <a href="/home" target="_blank">Learn more <svg class="right_content_tip_learnmore" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"></path></svg></a>
        </div>

        <form method="POST">

          <div class="input_field_panel">
            <!-- svelte-ignore a11y-autofocus -->
            <input class="input_field" type="text" name="name" id="name" required bind:value={name} autocomplete="off" autofocus title="none" />
            <label for="name" class='input_field_placeholder'>
              Name
            </label>
          </div>

          <div class="input_field_panel">
            <input class="input_field" required type="text" name="description" id="description" bind:value={description} autocomplete="off" title="none" />
            <label for="description" class='input_field_placeholder'>
              Description
            </label>
          </div>

          <div class="form_list">
            <h4>Data source</h4>
            <div class="select_dropdown">
              <select name="source" id="source" bind:value={source}>
                <option value="BigQuery">BigQuery</option>
                <option value="AlloyDB">AlloyDB</option>
                <option value="CloudSpanner">Cloud Spanner</option>
                <option value="Snowflake">Snowflake</option>
                <option value="Databricks">Databricks</option>
              </select>
            </div>
          </div>

          <div class="input_field_panel">
            <textarea name="query" id="query" required class="input_field" rows="10"></textarea>
            <label for="query" class='input_field_placeholder'>
              Query
            </label>
          </div>

          <div class="form_list">
            <h4>Protocols</h4>
            <div class="form_list_line">
              <input id="protocol_api" name="protocol_api" type="checkbox" /><label for="protocol_api">API</label>
            </div>
            <div class="form_list_line">
              <input id="protocol_ah" name="protocol_ah" type="checkbox" /><label for="protocol_ah">Analytics Hub</label>
            </div>              
            <div class="form_list_line">
              <input id="protocol_sync" name="protocol_sync" type="checkbox" /><label for="protocol_sync">Data sync</label>
            </div>          
          </div>

          <div class="form_list">
            <h4>Target groups</h4>
            <div class="form_list_line">
              <input id="target_internal" name="target_internal" type="checkbox" /><label for="target_internal">Internal</label>
            </div>
            <div class="form_list_line">
              <input id="target_partners" name="target_partners" type="checkbox" /><label for="target_partners">Partners</label>
            </div>              
            <div class="form_list_line">
              <input id="target_external" name="target_external" type="checkbox" /><label for="target_external">External</label>
            </div>          
          </div>

          <div class="form_controls">
            <button type="button" on:click={submit} class="rounded_button_filled">Create</button>
            <button on:click={() => history.back()} type="button" class="rounded_button_outlined">Cancel</button>
          </div>

        </form>
      </div>

  </div>
  </div>
</div>

<style>

</style>