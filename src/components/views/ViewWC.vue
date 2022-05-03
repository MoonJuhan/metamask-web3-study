<template>
  <div class="view-wc">
    <h1 v-if="walletInfo">Account : {{ walletInfo.accounts[0] }}</h1>
    <h1 v-if="walletInfo">Chain Id : {{ walletInfo.chainId }}</h1>
    <h2 v-if="signature">Signature : {{ signature }}</h2>
    <button @click="onClickConnect()">Connect</button>

    <button @click="onClickSign()" :disabled="!walletInfo">Sign</button>

    <button @click="onClickDisconnect()" :disabled="!walletInfo">Disconnect</button>
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
    const signature = ref(null)

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
      signature.value = null
    }

    const onClickSign = () => {
      const msgParams = [
        'Hello World', // Required
        walletInfo.value.accounts[0],
      ]

      // Sign personal message
      connector.value
        .signPersonalMessage(msgParams)
        .then((result) => {
          // Returns signature.
          signature.value = result
          console.log(result)
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error)
        })
    }

    onMounted(() => {})

    return {
      walletInfo,
      signature,
      onClickConnect,
      onClickSign,
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

  button {
    margin-bottom: 10px;
  }
}
</style>
