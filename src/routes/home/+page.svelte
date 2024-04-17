<script lang="ts">
  import type { PageServerData } from './$types';

  import ProductCard from '$lib/components.product-card.svelte';
  import type { AppUser, Product, Products } from '$lib/interfaces';
  import { onMount } from 'svelte';
  import { appService } from '$lib/app-service';
  import { goto } from '$app/navigation';

  let currentUser: AppUser | undefined = appService.currentUser;
  let products: Products = appService.products;
  let productsByName: {[key: string]: Product} = {};
  let catProducts: {[key: string]: string[]} = {};
  let catSubProducts: {[key: string]: string[]} = {};
  let category_filter: string = "";
  let categories: { [key: string]: string[] } = {};
  let types: string[] = [];
  let catChecked: string[] = [];
  let typesChecked: string[] = [];
  let userGroups: string[] = [];
  let searchText: string = "";

  if (currentUser) loadUserGroups(currentUser);

	onMount(() => {
    document.addEventListener("userUpdated", () => {
      if (appService.currentUser) {
        currentUser = appService.currentUser;
        loadUserGroups(currentUser);
        refreshProductList();
      }
    });

    if (appService.reloadFlag) {
      appService.reloadFlag = false;
      location.reload();
    }

    if (!appService.currentUser && appService.currentUserLoaded) {
      // This means no user is signed in, go to landing page
      goto("/");
    }
  });

  if (products) {
    for (let prod of products.products) {
      productsByName[prod.name] = prod;
      prod.attrArray = [];
      prod.groupArray = [];
      prod.typeArray = prod.type?.split(",");
      if (prod.typeArray && prod.typeArray.length > 0) {
        for (let type of prod.typeArray) {
          if (!types.includes(type)) types.push(type);
        }
      }

      if (prod.attributes) {
        for (let tagData of prod.attributes){
          if (tagData.name === "tags") {
            let tags = tagData.value.split(", ");

            for (let tag of tags) {
              prod.attrArray.push(tag);
              let pieces = tag.split("/");
              if (! prod.attrArray.includes(pieces[0])) prod.attrArray.push(pieces[0]);
              if (! catProducts[pieces[0]]) catProducts[pieces[0]] = [];
              if (! catProducts[pieces[0]].includes(prod.name)) catProducts[pieces[0]].push(prod.name);
              if (! catSubProducts[tag]) catSubProducts[tag] = [];
              catSubProducts[tag].push(prod.name);

              if (! categories[pieces[0]])
                categories[pieces[0]] = [];

              if (!categories[pieces[0]].includes(tag)) {
                categories[pieces[0]].push(tag)
              }
            }
          }
          else if (tagData.name === "groups") {
            prod.groupArray = tagData.value.split(", ");
          }
        }
      }
    }

    refreshProductList();
  }

  function loadUserGroups(newUser: AppUser) {
    if (newUser.developerData?.attributes) {
      for (let tag of newUser.developerData?.attributes) {
        if (tag.name == "Groups") {
          userGroups = tag.value.split(", ");
        }
      }
    }

    // TODO remove later, workaround to set group
    if (newUser.email.endsWith("gmail.com")) {
      userGroups.push("Internal");
    }
  }

  function onTypeChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let tempTypesChecked = typesChecked;

    if (e.target.checked) {
      
      if (!tempTypesChecked.includes(name)){
        tempTypesChecked.push(name);
      }
    }
    else {

      if (tempTypesChecked.includes(name)) {
        let index = catChecked.indexOf(name);
        tempTypesChecked.splice(index, 1);
      }
    }

    typesChecked = tempTypesChecked;
    refreshProductList();
  }

  function onCatChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let category: string = name.split("/")[0];

    let tempChecked = catChecked;
    if (e.target.checked) {
      
      if (!tempChecked.includes(name)){
        tempChecked.push(name);
      }
    }
    else {

      if (tempChecked.includes(name)) {
        let index = catChecked.indexOf(name);
        tempChecked.splice(index, 1);
      }
    }

    catChecked = tempChecked;
    refreshProductList();
  }

  function refreshProductList() {
    let tempCatProducts: {[key: string]: string[]} = {};
    for (let subCatSel of catChecked) {
      let cat = subCatSel.split("/")[0];
      if (! tempCatProducts[cat]) tempCatProducts[cat] = [];

      for (let prodName of catSubProducts[subCatSel]) {
        let prod = productsByName[prodName];
        if (!tempCatProducts[cat].includes(prodName) &&
            (typesChecked.length === 0 || prod.typeArray?.some(item => typesChecked.includes(item))) &&
            (prod.groupArray?.length === 0 || userGroups.some(item => prod.groupArray?.includes(item)))) {
          tempCatProducts[cat].push(prodName);
        }
      }
    }

    if (catChecked.length === 0) {
      for (let subCat of Object.keys(catSubProducts)) {
        let cat: string = subCat.split("/")[0];
        for (let prodName of catSubProducts[subCat]) {
          let prod = productsByName[prodName];
          if (!tempCatProducts[cat]) tempCatProducts[cat] = [];
          if (!tempCatProducts[cat].includes(prodName) &&
            (typesChecked.length === 0 || prod.typeArray?.some(item => typesChecked.includes(item))) &&
            (prod.groupArray?.length === 0 || userGroups.some(item => prod.groupArray?.includes(item)))) {
            tempCatProducts[cat].push(prodName);
          }
        }
      }
    }

    catProducts = tempCatProducts;
  }

  function getTypeName(type: string): string {
    let result = type;

    if (type === "ah")
      result = "Analytics hub";
    else if (type === "sync")
      result = "Data sync";
    else if (type === "api")
      result = "API";
    
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
</script>

<div class="header_tabs">
</div>

<div class="header_tabs_box">
  <div class="header_tab_button header_tab_button_selected">
    Catalog
  </div>
  <a href="/mission" class="header_tab_button">
    Our mission
  </a>
  <a href="/pricing" class="header_tab_button">
    Pricing
  </a>
  <a href="/partners" class="header_tab_button">
    Partners
  </a>
  <a href="/privacy" class="header_tab_button">
    Privacy
  </a>
</div>

{#if currentUser && currentUser.developerData}
<div class="home_content">
  <div class="banner">
    <div class="banner_title">{"Welcome to " + appService.siteName}
      <div class="banner_subtitle">
        {"The " + appService.siteName + " has all data products, APIs and service ecosystem access."}
      </div>

      <div class="banner_search">
        <svg class="banner_search_icon" width="4%" height="100%" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.18 9.747l4.502 4.503-1.414 1.414-4.5-4.5a5 5 0 1 1 1.41-1.418zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill-rule="evenodd"></path></svg>
        <input class="banner_search_input" bind:value={searchText} placeholder="Search for data & API products" />
      </div>
    </div>
  </div>

  <div class="product_showcase">
    
    <div class="product_filter">
      <div class="product_filter_box">
        <div class="product_filter_search">
          <svg class="product_filter_search_icon" data-icon-name="filterIcon" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M2 4h14v2H2V4zm2 4h10v2H4V8zm2 4h6v2H6v-2z"></path></svg>
          <input class="product_filter_search_input" bind:value={category_filter} placeholder="Filter categories" />
        </div>
        <div class="product_filter_header">
          <h4>Type</h4>
        </div>
        {#each types as type}
          <div class="product_filter_checkbox">
            <input type="checkbox" id={type} name={type} on:change={onTypeChange} /><label for={type}>{getTypeName(type)}</label>
          </div>
        {/each}
        {#each Object.keys(categories) as cat}
          <div class="product_filter_header">
            <h4>{cat}</h4>
          </div>
          {#each categories[cat] as subcat}
            {#if category_filter == "" || subcat.toLowerCase().includes(category_filter.toLowerCase())}
              <div class="product_filter_checkbox">
                <input type="checkbox" id={subcat} name={subcat} on:change={onCatChange} /><label for={subcat}>{subcat.replace(cat + "/", "")}</label>
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
    <div class="product_list">
      {#each Object.keys(catProducts) as catName}
        {#if catProducts[catName].length > 0}
          <div class="product_list_header">
            {#if searchText === "" || catName.toLowerCase().includes(searchText)}
              <h3>{catName} products</h3>
            {/if}
          </div>
          {#each catProducts[catName] as prodName, i}
            {#if searchText === "" || prodName.toLowerCase().includes(searchText)}
              <ProductCard data={productsByName[prodName]} />
            {/if}
          {/each}
        {/if}
      {/each}
    </div>

  </div>
</div>
{:else}
<div class="ring_lower lds-ring"><div></div><div></div><div></div><div></div></div>
{/if}

<style>

  .home_content {
    /* position: absolute; */
    top: 112px;
  }

  .banner {
    background-image: url('https://www.gstatic.com/pantheon/images/marketplace/cameo_banner-1x.png');
    background-size: cover;
    width: 100%;
    height: 300px;
    margin: 0px;
    padding: 0px;
    padding-top: 145px;
  }

  .banner_title {
    text-align: left;
    width: 580px;
    margin-left: auto;
    margin-right: auto;
    font-size: 24px;
  }

  .banner_subtitle {
    margin-top: 16px;
    font-size: 14px;
  }

  .banner_search {
    width: 100%;
    height: 44px;
    margin-top: 28px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .banner_search_icon {
    margin-left: 9px;
  }

  .banner_search_input {
    width: 90%;
    margin-top: 4px;
    border-width: 0px;
    font-size: 14px;
    border: none;
    background-color: #fafafa;
    position: relative;
    top: -18px;
  }

  .banner_search_input:focus {
    outline: none;
  }

  .product_showcase {
    width: 100%;
    display: flex;
  }

  .product_filter {
    width: 240px;
    height: 700px;
  }

  .product_filter_box {
    padding-bottom: 100px;
  }

  .product_filter_header {
    margin-left: 18px;
  }

  .product_filter_checkbox {
    margin-left: 18px;
    margin-top: 8px;
    color: #333;
    font-size: 16px;
    user-select: none;
  }

  .product_filter_checkbox label {
    margin-left: 6px;
  }

  .product_list {
    margin-top: 10px;
    width: calc(100% - 240px);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-bottom: 100px;
  }

  .product_list_header {
    width: 100%;
    margin-left: 14px;
  }

  .product_filter_search {
    width: 240px;
    height: 44px;
    margin-top: 28px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .product_filter_search_input {
    border-width: 0px;
    font-size: 14px;
    border: none;
    background-color: #fafafa;
    position: relative;
    top: -3px;
    width: 80%;
  }

  .product_filter_search_input:focus {
    outline: none;
  }

  .product_filter_search_icon {
    margin-left: 9px;
    margin-top: 9px;
  }

  .ring_lower div {
    position: absolute;
    top: 11vh;
    margin-left: 45vw;
  }

</style>
