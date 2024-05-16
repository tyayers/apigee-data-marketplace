<script lang="ts">
  import { MonetizationRatePlan, MonetizationRatePlanRate } from "./interfaces";
  import MoneyEdit from '$lib/components.money-edit.svelte';

  export let plan: MonetizationRatePlan;

  function addBand() {
    console.log("hello");
    let rates = plan.consumptionPricingRates;
    rates.push(new MonetizationRatePlanRate());
    plan.consumptionPricingRates = rates;
  }
</script>

<div style="position: relative; top: -10px;">
  {#each plan.consumptionPricingRates as band, i}
    <div>
      <span class="band_input input_field_panel">
        <input class="input_field" type="text" name={i + "_start"} id={i + "_start"} required bind:value={band.start} autocomplete="off" title="none" />
        <label for={i + "_start"} class='input_field_placeholder'>
          Start
        </label>
      </span>

      <span class="band_input input_field_panel">
        <input class="input_field" type="text" name={i + "_end"} id={i + "_end"} required bind:value={band.end} autocomplete="off" title="none" />
        <label for={i + "_end"} class='input_field_placeholder'>
          End
        </label>
      </span>

      <MoneyEdit amount={band.fee} label="Unit fee" small={true}/>

      {#if i > 0}
        delete
      {/if}
    </div>
  {/each}
</div>

<button style="margin-top: 20px; font-size: 16px" on:click={addBand}>+ Add band</button>

<style>
  .band_input {
    width: 100px;
    display: inline-block;
    margin-right: 24px;
  }
</style>