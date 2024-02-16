<script lang="ts">
  import Header from "$lib/header.svelte";
  import ModalDialog from "$lib/modal-dialog.svelte";
  import { appService } from "$lib/app-service";
  import "../app.css"
  import { onMount } from "svelte";

  let modalDialogVisible = false;
  let modalDialogMessage = "";
  let modalDialogType = 0;
  let modalPromise: Promise<string> | undefined = undefined;

  onMount(async () => {
    document.addEventListener("cancelEvent", () => {
      modalDialogVisible = false;
    });
  });

  appService.RegisterModalDialogHandler = modalDialog;

  function modalDialog(message: string, type: number): Promise<string> {
    modalPromise = new Promise((resolve, reject) => {
      modalDialogMessage = message;
      modalDialogType = type;
      modalDialogVisible = true;
    });

    return modalPromise;
  }

  function modalResult(result: string): void {
    modalDialogVisible = false;
  }

  function sendCancel() {
      //First, we initialize our event
      const event = new Event('cancelEvent');
      // Next, we dispatch the event.
      document.dispatchEvent(event);
  }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={sendCancel} on:keyup={sendCancel}>
  <Header />

  {#if modalDialogVisible}
    <ModalDialog message={modalDialogMessage} type={modalDialogType} submit={modalResult}></ModalDialog>
  {/if}
  <slot />
</div>