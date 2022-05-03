<template>
  <div class="view-transaction">
    <h2>Now Network : {{ networkName }}</h2>
    <h2>address : {{ address }}</h2>

    <input type="text" v-model="contractAddress" placeholder="contract address" />
    <input type="text" v-model="toAddress" placeholder="recipient address" />
    <input type="text" v-model="tokenId" placeholder="tokenId" />
    <input type="text" v-model="gas" placeholder="gas" />
    <input type="file" @change="handleFileChange" />

    <button @click="onClickGetAddress">Get Address</button>
    <button @click="onClickSendTransaction" :disabled="!address">Send Transaction</button>
  </div>
</template>

<script>
import Web3 from 'web3'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const web3 = new Web3(window.ethereum)

    const networkName = ref(null)
    const address = ref(null)
    const myAddress = ref(null)
    const contractAddress = ref(null)
    const toAddress = ref(null)
    const tokenId = ref(null)
    const contractABI = ref(null)
    const gas = ref('300000')
    // const transactionValue = ref('20000000000000')

    const setNetworkName = async () => {
      const chainId = await ethereum.request({ method: 'eth_chainId' })

      const chainNames = [
        {
          chainId: '0x1',
          chainName: 'eth',
        },
        {
          chainId: '0x4',
          chainName: 'eth_rinkeby',
        },
      ]

      networkName.value = 'unknown Network'

      if (chainNames.find((el) => el.chainId === chainId))
        networkName.value = chainNames.find((el) => el.chainId === chainId).chainName
    }

    const handleFileChange = (e) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        contractABI.value = JSON.parse(e.target.result)
      }
      reader.readAsText(e.target.files[0])
    }

    const onClickGetAddress = async () => {
      address.value = null

      try {
        address.value = (await web3.eth.requestAccounts())[0]
      } catch (error) {
        alert('ERROR')
      }
    }

    onMounted(() => {
      setNetworkName()
    })

    const onClickSendTransaction = async () => {
      const web3 = new Web3(window.ethereum)

      const PabSixth = new web3.eth.Contract(contractABI.value, contractAddress.value)

      const transactionParameters = {
        gas: gas.value,
        from: address.value,
        to: contractAddress.value,
        data: PabSixth.methods.safeTransferFrom(address.value, toAddress.value, tokenId.value).encodeABI()
      }

      ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters] })
    }

    return {
      networkName,
      address,
      contractAddress,
      gas,
      handleFileChange,
      onClickGetAddress,
      onClickSendTransaction,
      myAddress,
      toAddress,
      tokenId,
      contractABI,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-transaction {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  input,
  button {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style>
