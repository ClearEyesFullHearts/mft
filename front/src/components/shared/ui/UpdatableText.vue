<template>
  <div>
    <label class="cursor-pointer w-100 pt-1 mt-1 pl-2 ml-1" v-if="!active" v-bind:id="lblID"
      @click.prevent="active = !active">{{updatableText}}</label>
    <div class="d-flex flex-row" v-if="active">
      <b-form-input v-bind:id="inputID" type="text" class="mr-1" v-model="updatableText">
      </b-form-input>
      <button v-bind:id="validateID" type="button" class="btn btn-default mr-1"
        @click.prevent="validate" aria-label="Validate">
        <v-icon name="check" />
      </button>
      <button v-bind:id="cancelID" type="button" class="btn btn-default"
        @click.prevent="active = !active; updatableText = value;" aria-label="Cancel">
        <v-icon name="times" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      updatableText: this.value,
    };
  },
  props: ['value', 'id'],
  computed: {
    lblID() {
      return `${this.id}-label`;
    },
    inputID() {
      return `${this.id}-text`;
    },
    validateID() {
      return `${this.id}-ok`;
    },
    cancelID() {
      return `${this.id}-ko`;
    },
  },
  methods: {
    validate() {
      this.$emit(`validateChange-${this.id}`, this.updatableText);
      this.active = false;
    },
  },
};

</script>
<style>
    .cursor-pointer {cursor: pointer;}
</style>
