<template>
  <div class="view-home">
    <h1>Now Network : {{ networkName }}</h1>
    <h1 v-if="accountId">Metamask Account ID : {{ accountId }}</h1>
    <h1 v-else>Metamask Account is Not Found</h1>
    <h1>Balance : {{ balance }}</h1>
    <button @click="onClickConnect">Metamask Login</button>
    <button @click="onClickGet">Get Metamask Info</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const accountId = ref(null)
    const networkName = ref(null)
    const balance = ref(null)
    const { ethereum } = window

    const onClickConnect = async () => {
      try {
        const data = await ethereum.request({ method: 'eth_requestAccounts' })

        accountId.value = data[0]
      } catch (error) {
        console.error(error)
      }
    }

    const onClickGet = async () => {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const hexNum = await ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })

      balance.value = `0.${parseInt(hexNum, 16)} ETH`
    }

    const setNetworkName = async () => {
      const chainId = await ethereum.request({ method: 'eth_chainId' })

      switch (chainId) {
        case '0x1':
          networkName.value = '이더리움 메인 네트워크(메인넷)'
          break
        case '0x3':
          networkName.value = '롭스텐 테스트 네트워크'
          break
        case '0x4':
          networkName.value = 'Rinkeby 테스트 네트워크'
          break
        case '0x5':
          networkName.value = 'Goerli 테스트 네트워크'
          break
        case '0x2a':
          networkName.value = '코반 테스트 네트워크'
          break
      }
    }

    onMounted(() => {
      setNetworkName()
    })

    return {
      accountId,
      networkName,
      balance,
      onClickConnect,
      onClickGet,
    }
  },
}
</script>
