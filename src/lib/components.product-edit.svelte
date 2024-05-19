<script lang="ts">
  import { DataProduct, DisplayOptions, SLA } from '$lib/interfaces';
  import InputSelect from '$lib/components.input.select.svelte';
  import TagCloud from '$lib/components.tag.cloud.svelte';
  import { generateRandomString, protocols, audiences } from '$lib/utils';
  import { JSONEditor, Mode } from 'svelte-jsoneditor';
  import { text } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import { appService } from './app-service';

  export let product: DataProduct;
  let slas: SLA[] = [];

  onMount(async () => {
    if (product.samplePayload && payloadEditor) {
      let payloadContent = {
        text: product.samplePayload
      }
      payloadEditor.set(payloadContent);
      payloadEditor.refresh();
    }

    if (product.specContents && specEditor) {
      let specContent = {
        text: product.specContents
      };
      specEditor.set(specContent);
      specEditor.refresh();
    }

    // fetch SLAs
    fetch("/api/slas")
      .then((response) => {
        if (response.status === 404) {
          console.log(response.statusText);
        } else if (response.status === 200) return response.json();
      })
      .then((slaResults: SLA[]) => {
        slas = slaResults;
        let sla = slas.find(o => o.id === product.sla.id);
        if (sla) product.sla = sla;
      });

    console.log(product);
  });

  let categoryData: string[] = [
    "ESG - Environmental", "ESG - Social", "ESG - Governance",
    "Investment - Research", "Investment - Statistics", "Investment - Management",
    "Pre-IPO - Research", "Pre-IPO - Statistics", "Pre-IPO - Management",
    "Listing - Research", "Listing - Statistics", "Listing - Management",
    "Trading - Research", "Trading - Statistics", "Trading - Classes"
  ];

  let samplePayloadData: any = {};
  if (product.samplePayload) samplePayloadData = JSON.parse(product.samplePayload);

  let payloadEditor: {set(content: any): void, refresh(): void};
  let specEditor: {set(content: any): void, refresh(): void};

  function onProtocolChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    
    if (e.target.checked) {
      if (! product.protocols.includes(name))
        product.protocols.push(name);
    }
    else {
      let index = product.protocols.indexOf(name);
      if (index >= 0)
        product.protocols.splice(index, 1);
    }

    product = product;
  }

  function onAudienceChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];

    if (e.target.checked) {
      if (! product.audiences.includes(name))
        product.audiences.push(name);
    }
    else {
      let index = product.audiences.indexOf(name);
      if (index >= 0)
        product.audiences.splice(index, 1);
    }
  }

  function addCategory(category: string) {
    if (!product.categories.includes(category)) {
      let newProductCopy = product;
      newProductCopy.categories.push(category);
      product = newProductCopy;
    }
  }

  function removeCategory(category: string) {
    if (product.categories.includes(category)) {
      let newProductCopy = product;
      let index = newProductCopy.categories.indexOf(category);
      newProductCopy.categories.splice(index, 1);
      product = newProductCopy;
    }
  }

  function refreshPayload() {
    fetch("/api/products/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    }).then((response) => {
      fetch(`/api/products/generate?entity=${product.entity}&type=${product.source}`).then((response) => {
        response.json().then((payload: any) => {
          product.samplePayload = JSON.stringify(payload);
          samplePayloadData = payload;
          let payloadContent = {
            json: payload
          }
          payloadEditor.set(payloadContent);
          payloadEditor.refresh();
        });
      });
    });
  }

  function refreshSpec() {
    if (product.samplePayload) {
      fetch("/api/products/generate/spec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      }).then((response) => {
        return response.json();
      }).then((newProduct: DataProduct) => {
        // product.specPrompt = newProduct.specPrompt;
        product.specContents = newProduct.specContents;
        let specContent = {
          text: newProduct.specContents
        }
        specEditor.set(specContent);
        specEditor.refresh();
      });
    } else {
      appService.ShowDialog("A sample payload is needed to generate an API spec. Please either load or enter a payload into the 'Payload' field.", "OK", 0);
    }
  }

  function onSpecChange(updatedContent: any) {
    if (updatedContent && updatedContent.text)
      product.specContents = updatedContent.text;
    else if (updatedContent && updatedContent.json)
      product.specContents = JSON.stringify(updatedContent.json);
  }
</script>

<div class="right_content_tip">
  Give your data product an appropriate name and description, and enter the query and data source to connect the product to.
  Finally, configure which protocols and audiences your product should be offered to.
  <a href="/home" target="_blank">Learn more <svg class="right_content_tip_learnmore" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"></path></svg></a>
</div>

<div class="product_box">
  <div class="product_left_details">
    <div class="input_field_panel">
      <!-- svelte-ignore a11y-autofocus -->
      <input class="input_field" type="text" name="name" id="name" required bind:value={product.name} autocomplete="off" autofocus title="none" />
      <label for="name" class='input_field_placeholder'>
        Name
      </label>
    </div>

    <div class="input_field_panel">
      <input class="input_field" required type="text" name="description" id="description" bind:value={product.description} autocomplete="off" title="none" />
      <label for="description" class='input_field_placeholder'>
        Description
      </label>
    </div>

    <div class="input_field_panel">
      <input class="input_field" required type="text" name="entity" id="entity" bind:value={product.entity} autocomplete="off" title="none" />
      <label for="entity" class='input_field_placeholder'>
        Entity name
      </label>
    </div>

    <div class="form_list">
      <h4>Data source</h4>
      <div class="select_dropdown">
        <select name="source" id="source" bind:value={product.source}>
          <option value="BigQuery">BigQuery</option>
          <option value="API">API</option>
          <option value="AlloyDB">AlloyDB</option>
          <option value="Cloud Spanner">Cloud Spanner</option>
          <option value="Snowflake">Snowflake</option>
          <option value="Databricks">Databricks</option>
        </select>
      </div>
    </div>

    <div class="input_field_panel">
      <textarea name="query" id="query" required class="input_field" bind:value={product.query} rows="10"></textarea>
      <label for="query" class='input_field_placeholder'>
        Query, table or backend URL
      </label>
    </div>

    <div class="form_list">
      <h4>Categories</h4>

      <TagCloud data={product.categories} onRemove={removeCategory} />

      <InputSelect data={categoryData} label="Add category - subcategory" onSelect={addCategory} />

    </div>

    <div class="form_list">
      <h4>Protocols</h4>
      {#each protocols as protocol}
        <div class="form_list_line">
          <input id={protocol.name} name={protocol.name} disabled={!protocol.active} checked={product.protocols.includes(protocol.name)} on:change={onProtocolChange} type="checkbox" /><label for={protocol.name}>{protocol.displayName}</label>
        </div>
      {/each}
    </div>

    {#if product.protocols.includes("Analytics Hub")}
      <div class="form_list">
        <h4>Analytics Hub configuration</h4>
        <div class="input_field_panel">
          <input class="input_field" required type="text" name="analyticsHubMarketplaceId" id="analyticsHubMarketplaceId" bind:value={product.analyticsHubMarketplaceId} autocomplete="off" title="none" />
          <label for="analyticsHubMarketplaceId" class='input_field_placeholder'>
            Marketplace Id
          </label>
        </div>
        <div class="input_field_panel">
          <input class="input_field" required type="text" name="analyticsHubListingId" id="analyticsHubListingId" bind:value={product.analyticsHubListingId} autocomplete="off" title="none" />
          <label for="analyticsHubListingId" class='input_field_placeholder'>
            Listing Id
          </label>
        </div>        
      </div>
    {/if}

    <div class="form_list">
      <h4>Audiences</h4>
      {#each audiences as aud}
        <div class="form_list_line">
          <input id={aud.name} name={aud.name} disabled={!aud.active} checked={product.audiences.includes(aud.name)} on:change={onAudienceChange} type="checkbox" /><label for={aud.name}>{aud.displayName}</label>
        </div>
      {/each}      
    </div>

    <div class="form_list">
      <h4 on:click={() => {console.log(product.sla)}}>SLA</h4>
      <div class="select_dropdown">
        <select name="sla" id="sla" bind:value={product.sla}>
          {#each slas as sla}
            <option value={sla}>{sla.name}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="form_list">
      <h4>Status</h4>
      <div class="select_dropdown">
        <select name="status" id="status" bind:value={product.status}>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>
    </div>
  </div>

  <div class="product_payload">
    <h4 style="margin-block-end: 0px;">Payload</h4>
    <button on:click={refreshPayload} style="position: relative; top: -20px; left: 76px;">Reload</button>
    <div style="overflow-y: auto; height: 90%;">
      <!-- <andypf-json-viewer expanded="3" show-copy="true" show-toolbar="true" data={samplePayloadData}></andypf-json-viewer> -->
      <JSONEditor bind:this={payloadEditor} />
    </div>
  </div>

  <div class="product_payload">
    <h4 style="margin-block-end: 0px;">API Spec</h4>
    <button on:click|stopPropagation={refreshSpec} style="position: relative; top: -20px; left: 82px;">Regenerate</button>
    <div style="overflow-y: auto; height: 90%;">
      <!-- <textarea style="width: 97%; height: 96%;">
        {product.specContents}
      </textarea> -->
      <JSONEditor bind:this={specEditor} mode={Mode.text} onChange="{onSpecChange}" />
    </div>
  </div>

</div>
<style>

.product_box {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: flex-start;
  margin-top: 34px;
}

.product_left_details {
  width: 572px;
}

.product_payload {
  border: 1px solid lightgray;
  width: 600px;
  margin-right: 40px;
  min-height: 600px;
  max-height: 800px;
  padding-left: 10px;
}

</style>