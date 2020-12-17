<template>
  <div>
    <button @click="exit">退出登录</button>
  </div>
</template>

<script>
export default {
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push("login")
    },
  },
}
</script>

<style lang="">
</style>