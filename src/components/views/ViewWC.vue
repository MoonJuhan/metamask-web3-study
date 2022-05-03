<template>
  <div class="view-wc">
    <h1 v-if="walletInfo">Account : {{ walletInfo.accounts[0] }}</h1>
    <h1 v-if="walletInfo">Chain Id : {{ walletInfo.chainId }}</h1>
    <button @click="onClickConnect()">Connect</button>
    <button @click="onClickDisconnect()">Disconnect</button>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

export default {
  setup() {
    const walletInfo = ref(null)
    const connector = ref(null)

    const onClickConnect = () => {
      connector.value = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org', // Required
        qrcodeModal: QRCodeModal,
      })

      if (!connector.value.connected) {
        connector.value.createSession()
      }

      connector.value.on('connect', (error, payload) => {
        console.log('connect')
        if (error) {
          throw error
        }

        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0]
        walletInfo.value = { accounts, chainId }
      })

      connector.value.on('session_update', (error, payload) => {
        console.log('session_update')
        if (error) {
          throw error
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0]
        console.log(accounts, chainId)
      })

      connector.value.on('disconnect', (error, payload) => {
        console.log('disconnect')
        if (error) {
          throw error
        }
      })
    }

    const onClickDisconnect = () => {
      connector.value.killSession()
      walletInfo.value = null
    }

    // const onClickSign = () => {
    //   const msgParams = [
    //     '123', // Required
    //     '0xc5B71dcC0aB972d7734D8f31e12Fed57c6628c7B', // Required
    //   ]

    //   // Sign personal message
    //   connector
    //     .signPersonalMessage(msgParams)
    //     .then((result) => {
    //       // Returns signature.
    //       console.log(result)
    //     })
    //     .catch((error) => {
    //       // Error returned when rejected
    //       console.error(error)
    //     })
    // }

    onMounted(() => {})

    return {
      walletInfo,
      onClickConnect,
      onClickDisconnect,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-wc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
