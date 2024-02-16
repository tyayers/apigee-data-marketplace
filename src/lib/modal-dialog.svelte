<script lang="ts">

  export let message = "";
  export let type = 0;

  export let submit: (result: string) => void

  function onClick() {
    
  }

  function onOk() {
    if (submit) submit("ok");
  }

  function onCancel() {
    if (submit) submit("cancel");
  }
</script>

<div class="modal_background">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal_dialog" on:click|stopPropagation={onClick}>
    <div class="modal_message">
      {message}
    </div>
    <div class="modal_controls">
      <button class="rounded_button_filled" on:click={onOk}>Ok</button>
      <button class="rounded_button_outlined" on:click={onCancel}>Cancel</button>
    </div>
  </div>
</div>

<style>
  .modal_background {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.75);
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vw;
    animation: 300ms cubic-bezier(0.25, 0.1, 0.25, 1) 0s 1 normal forwards
      running k3;
    transform-origin: center bottom;
    align-items: center;
    justify-content: center;
    z-index: 3000;
  }

  .modal_dialog {
    width: 420px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: flex;
    /* flex: 1 0 auto; */
    position: relative;

    animation: 300ms cubic-bezier(0.25, 0.1, 0.25, 1) 0s 1 normal forwards
      running k3;

    padding: 44px 56px;
    background: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 15%) 0px 2px 10px;
    border-radius: 44px;
    display: block;
    
    height: 260px;
    flex-direction: row;

    margin: 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 24px;
  }

  .modal_message {
    margin-top: 70px;

  }

  .modal_controls {
    position: absolute;
    bottom: 40px;
    left: 60px;
  }
</style>