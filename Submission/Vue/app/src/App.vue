<template>
  <div>
    <div v-if="error">Error loading application !!</div>
    <template v-else>
      <h2>Product List</h2>
      <template v-for="(item,ind) in productTypes" :key="ind">
        <input type="checkbox" :id="item.value" :value="item.value" v-model="selectedTypes" />
        <label :for="item.value">{{item.text}}</label>
      </template>
      <br />
      <ul>
        <list
          v-for="product in products"
          :key="product.id"
          v-bind:product="product"
          @closeAll="closeAll"
          @removeProduct="remove"
        />
      </ul>
      <addProduct :types="productTypes" @onAdd="onAdd" />
    </template>
  </div>
</template>

<script>
import list from "./components/list";
import addProduct from "./components/addProduct";
import { getList, removeProduct } from "./api";
export default {
  name: "App",
  data() {
    return {
      error: null,
      selectedTypes: ["Cricket", "FootBall", "Tennis"],
      productTypes: [
        { text: "Cricket", value: "Cricket" },
        { text: "FootBall", value: "FootBall" },
        { text: "Tennis", value: "Tennis" }
      ],
      products: []
    };
  },
  created() {
    getList(this.selectedTypes)
      .then(data => {
        this.products = this.transformUIData(data);
      })
      .catch(error => {
        this.error = error;
      });
  },
  components: {
    list,
    addProduct
  },
  watch: {
    selectedTypes(value) {
      getList(value).then(data => {
        this.products = this.transformUIData(data);
      });
    }
  },
  methods: {
    transformUIData(data) {
      return data.map(ele => ({
        id: ele.product_Id,
        name: ele.product_Name,
        isOpen: ele.isOpen || false,
        info: ele.info,
        description: ele.description,
        type: ele.product_Type
      }));
    },
    closeAll(id) {
      this.products = this.products.map(ele => {
        console.log(ele);
        return { ...ele, isOpen: id === ele.id ? !ele.isOpen : false };
      });
    },
    remove(payload) {
      removeProduct(payload).then(() => {
        this.products = this.products.filter(ele => ele.id !== payload.id);
      });
    },
    onAdd() {
      getList(this.selectedTypes).then(data => {
        this.products = this.transformUIData(data);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
h2 {
  margin: 5px;
}
ul {
  padding: 5px;
  margin: 0px;
}
</style>
