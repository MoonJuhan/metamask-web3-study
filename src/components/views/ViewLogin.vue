<template>
  <div class="view-login">
    <h1>Now Network : {{ networkName }}</h1>
    <h2>address : {{ address }}</h2>
    <h2>message(nonce) : {{ message }}</h2>
    <h2>signature : {{ signature }}</h2>
    <button @click="onClickGetAddress">Get Address</button>
    <button @click="onClickGetNonce">Get Nonce</button>
    <button @click="onClickLogin">Login</button>
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

    const onClickGetAddress = async () => {
      address.value = null
      signature.value = null

      try {
        address.value = (await web3.eth.requestAccounts())[0]
      } catch (error) {
        alert('ERROR')
      }
    }

    const onClickGetNonce = async () => {
      if (address.value) {
        message.value = null

        const { data } = await axios({
          method: 'post',
          url: 'https://metamask-back-test.herokuapp.com/users/nonce',
          data: {
            publicAdress: address.value,
          },
        })

        console.log(data)

        message.value = data.nonce
      } else {
        alert('No Address')
      }
    }

    const onClickLogin = async () => {
      if (message.value) {
        signature.value = null

        try {
          signature.value = await web3.eth.personal.sign(message.value, address.value)
        } catch (error) {
          alert('ERROR')
        }

        const { data } = await axios({
          method: 'post',
          url: 'https://metamask-back-test.herokuapp.com/users/login',
          data: {
            publicAdress: address.value,
            signature: signature.value,
            // signature: '',
          },
        })

        console.log(data)
      } else {
        alert('No Nonce')
      }
    }

    onMounted(() => {
      setNetworkName()
    })

    return {
      networkName,
      address,
      message,
      signature,
      onClickGetAddress,
      onClickGetNonce,
      onClickLogin,
    }
  },
}
</script>

<style lang="scss" scoped>
button {
  font-size: 20px;
  margin: 0 20px 0 0;
}
</style>
