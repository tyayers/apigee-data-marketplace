<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { appService } from "$lib/app-service";
  import { equalTo } from "firebase/database";
  import type { PageData } from "./$types";
  import { page } from '$app/stores'
  import { onMount } from "svelte";
    import type { AHSubscription, Product } from "$lib/interfaces";

  let project: string = "";
  let datasetName: string = "";
  let product: string = "";
  let hubUrl: string = "";
  //let accessToken: string = "";
  let productData: Product | undefined = undefined;
  
  console.log($page.url);

  var urlProduct = $page.url.searchParams.get('product');
  if (urlProduct) product = urlProduct;

  onMount(() => {
    if ($page.url.hash) {
      let urlHash: string = $page.url.hash;
      var values = getParameters(urlHash);
      if (values["product"]) product = values["product"];
      if (values["access_token"]) appService.googleAccessToken = values["access_token"];
    }
  });

  function subscribeGoogle() {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=779705321594-0npc2bffujp0kggoo6bcl8l5g81vqnt8.apps.googleusercontent.com&redirect_uri=" + $page.url.origin + $page.url.pathname + "&response_type=token&scope=https://www.googleapis.com/auth/bigquery&state=product=Index%20Research";
  }

  function submit() {
    productData = appService.products.products.find(productItem => productItem.name === product);

    fetch("https://analyticshub.googleapis.com/v1beta1/projects/apigee-test38/locations/eu/dataExchanges/" + productData?.hubMarketplaceId + "/listings/" + productData?.hubListingId + ":subscribe", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + appService.googleAccessToken
      },
      body: JSON.stringify({
        "destinationDataset": {
          "datasetReference": {
            "projectId": project,
            "datasetId": datasetName
          },
          "location": "eu"
        }
      })
    }).then((response) => {
      if (response.ok && response.status === 200) {
        // Subscription was successfully created.
        const productData = appService.products.products.find(productItem => productItem.name === product);
        fetch("/api/bigquery?email=" + appService.currentUser?.email + "&project=" + project + "&dataset=" + datasetName + "&product=" + product + "&marketplaceId=" + productData?.hubMarketplaceId + "&listingId=" + productData?.hubListingId + "&createdAt=" + (new Date()).toLocaleString(), {
          method: 'POST',
          headers: {
              'content-type': 'application/json',
          },
        }).then((response) => {
            return response.json();
        }).then((data: AHSubscription) => {
          goto("/apps/bigquery");
        });
      }
      else if (response.status === 409) {
        appService.ShowDialog("The dataset already exists, so no new subscription could be created.", "OK", 0);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  function back() {
    goto("/apps/bigquery")
  }

  function getParameters(hash: string): { [key: string]: string } {
    let resultValues: { [key: string]: string } = {};

    hash = hash.substring(1);
    let hashValues = hash.split("&");
    for (let hashValue of hashValues) {
      let innerValues = hashValue.split("=");
      if (innerValues.length == 2) {
        if (innerValues[0] === "state") {
          let newInnerValues = innerValues[1].split("%3D");
          if (newInnerValues.length == 2)
            resultValues[newInnerValues[0]] = newInnerValues[1].replace("%20", " ");
        }
        else
          resultValues[innerValues[0]] = innerValues[1];
      }
    }

    return resultValues;
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
              <button class="back_button" on:click={back}>
                <svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>
              </button>
              {#if product}         
                <span>Add Analytics Hub subscription for {product}</span>
              {:else}
                <span>Add Analytics Hub subscription</span>
              {/if}
          </div>

          <div class="left_menu_page_right_content">
            
            <div class="right_content_tip">
              You can enter let Data Marketplace create your subscription here. Alternatively,
              you can you can subscribe at the <a href="https://console.cloud.google.com/bigquery/analytics-hub/exchanges;cameo=analyticshub;pageName=listing-detail;pageResource=apigee-test38.eu.marketplace_18dccea19ab.trading_data_18dccebea66" style="color: var(--primary-color)" target="_blank">Analytics Hub product page<svg class="right_content_tip_learnmore" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"></path></svg></a>
            </div>
            <br />
            <div>
              <div class="right_content_tip">
                To start click here to authorize Data Marketplace to create your subscription with Google Cloud.
                <br /><br />
                <button on:click={subscribeGoogle} class="rounded_button_outlined" disabled={appService.googleAccessToken != ""} >
                  <svg width="25" height="25" class="sobti"
                  ><g fill="none" fill-rule="evenodd"
                    ><path
                      d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z"
                      fill="#4285F4"
                    /><path
                      d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z"
                      fill="#34A853"
                    /><path
                      d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z"
                      fill="#FBBC05"
                    /><path
                      d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z"
                      fill="#EA4335"
                    /></g
                  ></svg>
                  <span style="position: relative; top: -7px">Authorize through Google</span>
                </button>
                {#if appService.googleAccessToken}
                  <span title="Authorization set."><svg style="height: 34px; width: 34px; position: relative; top: 12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" ><circle cx="32" cy="32" r="30" fill="#fff"/><path d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50  l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z" fill="#43a047"/></svg></span>
                {/if}
              </div>
            </div>
            <br />
            <br />
            <div class="right_content_tip">
              Now you can enter your Google Cloud project Id and a dataset name that will be created for the Analytics Hub subscription.
            </div>
            <form>
              <div class="input_field_panel">
                <!-- svelte-ignore a11y-autofocus -->
                <input class="input_field" type="text" name="name" id="name" required bind:value={project} autocomplete="off" title="none" />
                <label for="name" class='input_field_placeholder'>
                  Google Cloud project
                </label>
              </div>

              <div class="input_field_panel">
                <input class="input_field" type="text" name="dataset" id="dataset" required bind:value={datasetName} autocomplete="off" title="none" />
                <label for="dataset" class='input_field_placeholder'>
                  Dataset name
                </label>
              </div>
              <br />
              <br />
              <div class="right_content_tip">
                This is the Data Product that you are subscribing to. You can subscribe to a product in multiple projects and in multiple datasets.
              </div>

              <div class="form_list">
                <h4>Product subscription</h4>
                <div class="select_dropdown">
                  <select name="hubListing" id="hubListing" bind:value={product}>
                    {#each appService.products.products as product}
                      {#if product.type?.includes("ah")}
                        <option value={product.name}>{product.name}</option>
                      {/if}
                    {/each}
                  </select>
                </div>
              </div>

              <div class="form_controls">
                <button on:click={submit} type="button" class="rounded_button_filled">Create</button>
                <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
              </div>

            </form>
          </div>

      </div>
  
  </div>

</div>

<style>
    .right_content_tip {
      font-size: 14px;
      max-width: 550px;
      line-height: 18px;
    }

    .right_content_tip a:hover {
      text-decoration: underline;
    }

    .right_content_tip_learnmore {
      position: relative;
      top: 5px;
      left: -3px;
    }
</style>