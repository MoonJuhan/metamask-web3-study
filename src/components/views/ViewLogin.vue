<template>
  <div class="view-login">
    <h1>Now Network : {{ networkName }}</h1>
    <h2>address : {{ address }}</h2>
    <h2>message : {{ message }}</h2>
    <h2>signature : {{ signature }}</h2>
    <button @click="onClickLogin">Login</button>
    <button @click="onClickConnect">Connect</button>
  </div>
</template>

<script>
import Web3 from 'web3'
import { ref, onMounted } from 'vue'
import axios from 'axios'
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
    const message = ref(null)
    const signature = ref(null)

    const onClickLogin = async () => {
      address.value = null
      signature.value = null

      try {
        address.value = (await web3.eth.requestAccounts())[0]
      } catch (error) {
        alert('ERROR')
      }
    }

    const onClickConnect = async () => {
      console.log('Connect')

      const { data } = await axios({
        method: 'post',
        url: 'https://metamask-back-test.herokuapp.com/users/nonce',
        data: {
          publicAdress: address.value,
        },
      })

      console.log(data)

      message.value = data.nonce

      try {
        signature.value = await web3.eth.personal.sign(data.nonce, address.value)
      } catch (error) {
        alert('ERROR')
      }

      const d = await axios({
        method: 'post',
        url: 'https://metamask-back-test.herokuapp.com/users/login',
        data: {
          publicAdress: address.value,
          // signature: signature.value,
          signature: '',
        },
      })

      console.log(d)
    }

    onMounted(() => {
      setNetworkName()
    })

    return {
      networkName,
      address,
      message,
      signature,
      onClickLogin,
      onClickConnect,
    }
  },
}
</script>
