<template>
  <li :class="product.type.toLowerCase()">
    <h5 @click="toggel">
      {{product.name}}
      <button @click.stop="removeProduct">sold</button>
    </h5>
    <div v-if="product.isOpen" class="product-info">
      <div>description : {{product.description}}</div>
      <div>Type : {{product.type}}</div>
      <template v-if="!!Object.keys(product.info).length">
        <h6>Info</h6>
        <table>
          <tbody>
            <tr v-for="(value,key) in product.info" :key="key">
              <td>{{key}} ::</td>
              <td>{{value}}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div v-else>No information found !!</div>
    </div>
  </li>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    toggel() {
      this.$emit("closeAll", this.product.id);
    },
    removeProduct() {
      this.$emit("removeProduct", {
        id: this.product.id,
        type: this.product.type
      });
    }
  }
};
</script>
<style>
.cricket h5 {
  border-color: #1ab7f3;
}
.football h5 {
  border-color: #5dc432;
}
.tennis h5 {
  border-color: #f31a74;
}
.product-info {
  padding: 5px;
}
li h5 {
  display: flex;
  width: 20%;
  padding: 5px;
  border: 2px solid grey;
  margin: 10px 0px;
  justify-content: space-between;
  transition: 0.3s;
}
h6 {
  color: green;
  font-size: 13px;
  margin: 5px 0px;
}
li {
  list-style: none;
}
.cricket h5:hover {
  background: #1ab7f3;
}
.football h5:hover {
  background: #5dc432;
}
.tennis h5:hover {
  background: #f31a74;
}
h5:hover {
  color: white;
  border: 2px solid white;
  box-shadow: 3px 5px 5px black;
}
</style>