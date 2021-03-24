<template>
  <div :class="['add-product',productType.toLowerCase()]">
    <button v-if="!isOpen" @click="addProduct">Add new Product</button>
    <div v-else class="add-space">
      <div>
        <div class="group">
          Product Type :
          <select v-model="productType">
            <option disabled value>Please select one</option>
            <option
              v-for="option in types"
              :value="option.value"
              :key="option.value"
            >{{ option.text }}</option>
          </select>
        </div>
        <div class="group">
          Name :
          <input v-model="name" />
        </div>
        <div class="group">
          Product Description :
          <textarea v-model="description" placeholder="Product description"></textarea>
        </div>
        <div>
          <button @click="addInfo">Add Info</button>
        </div>
        <div>
          <table v-if="info.length">
            <tbody>
              <tr>
                <td>Property</td>
                <td>:: Value</td>
              </tr>
              <tr v-for="(item,ind) in info" :key="ind">
                <td>
                  <input v-model="item.key" />
                </td>
                <td>
                  ::
                  <input v-model="item.value" />
                </td>
                <button @click="removeInfo(ind)">remove</button>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="buttons">
        <button @click="closeAdd">cancel</button>
        <button type="submit" @click="save">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveProduct } from "../api";
export default {
  name: "addProduct",
  props: {
    types: []
  },
  data() {
    return {
      isOpen: false,
      name: "",
      description: "",
      productType: "",
      info: []
    };
  },
  methods: {
    addProduct() {
      this.isOpen = true;
    },
    closeAdd() {
      this.isOpen = false;
      this.name = "";
      this.description = "";
      this.info = [];
      this.productType = "";
    },
    addInfo() {
      this.info.push({ key: "", value: "" });
    },
    removeInfo(ind) {
      this.info.splice(ind, 1);
    },
    save() {
      var newProduct = {
        product_Type: this.productType.toLowerCase(),
        product_Name: this.name,
        description: this.description,
        info: this.info.reduce((res, ele) => {
          const item = ele.key && ele.value ? { [ele.key]: ele.value } : {};
          return {
            ...res,
            ...item
          };
        }, {})
      };
      if (!newProduct.product_Type || !newProduct.product_Name) {
        alert("Product type and Name are mandatory");
        return;
      }
      saveProduct(newProduct).then(() => {
        this.closeAdd();
        this.$emit("onAdd");
      });
    }
  }
};
</script>
    
<style>
.group {
  display: flex;
  justify-content: space-between;
  margin: 5px 0px;
}
.buttons {
  margin: 5px 0px;
  text-align: right;
}
.cricket .add-space {
  border-color: #1ab7f3;
}
.football .add-space {
  border-color: #5dc432;
}
.tennis .add-space {
  border-color: #f31a74;
}
.add-space {
  transition: 0.8s;
  border: 2px solid grey;
  width: 30%;
  padding: 5px;
}

button + button {
  margin: 10px;
}
</style>