<template>
  <div class="view-login">
    <h1>Now Network : {{ networkName }}</h1>
    <h2>address : {{ address }}</h2>
    <h2>signature : {{ signature }}</h2>
    <button @click="onClickLogin">Login</button>
  </div>
</template>

<script>
import Web3 from 'web3'
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const web3 = new Web3(window.ethereum)

    const networkName = ref(null)

    const setNetworkName = async () => {
      const chainId = await web3.eth.getChainId()
      networkName.value = 'unknown Network'

      switch (chainId) {
        case 1:
          networkName.value = '이더리움 메인 네트워크(메인넷)'
          break
        case 3:
          networkName.value = '롭스텐 테스트 네트워크'
          break
      }
    }

    const address = ref(null)
    const signature = ref(null)

    const onClickLogin = async () => {
      address.value = null
      signature.value = null
      const message = ['Test Sign', 'Please sign me in!'].join('\n')

      try {
        address.value = (await web3.eth.requestAccounts())[0]
        signature.value = await web3.eth.personal.sign(message, address.value)
      } catch (error) {
        alert('ERROR')
      }
    }

    onMounted(() => {
      setNetworkName()
    })

    return {
      networkName,
      address,
      signature,
      onClickLogin,
    }
  },
}
</script>
