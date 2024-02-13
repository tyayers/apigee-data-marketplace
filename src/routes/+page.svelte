<script lang="ts">
   
    import Header from "../lib/header.svelte";
    import { appService } from "$lib/app-service";
    
    
</script>

<Header />

<div class="signed_out_main_panel">
    <div class="signed_out_heading">
        <h1>Helping build the next generation of AI powered SaMD solutions</h1>
    </div>
    <div class="signed_out_heading">
        <div>
        Health.io is committed to helping developers and data scientists to learn,
        build and publish innovative AI powered Software as a Medical Device (SaMD) solutions.
        We’re developing technology platforms to enable faster, more secure and compliant medical software solutions.
        And we’re exploring the use of artificial intelligence to assist in recognizing diseases earlier for better health outcomes, for everyone.
        </div>
    </div>
    <div class="signed_out_heading_small">
        <span>
            <a href="/sign-in" class="rounded_button_filled">Sign In</a>
            <a href="/register" class="rounded_button_outlined">Register</a>
          </span>
    </div>
</div>

<style>
.signed_out_main_panel {
  background: var(--primary-background-color);
  position: absolute;
  left: 0px;
  top: 58px;
  width: 100%;
  bottom: 0px;
  padding: 14px;
  text-align: center;
}

.signed_out_heading {
  margin: auto;
  margin-top: 75px;
  width: 60vw;
}

.signed_out_heading_small {
  margin: auto;
  margin-top: 35px;
  width: 60vw;
}
</style>
