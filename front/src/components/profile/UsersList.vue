<template>
<div>
  <br />
  <h3>All users:</h3>
  <b-table id="user" striped hover :items="users" :fields="fields" primary-key="id">
      <template v-slot:cell(username)="data">
        <label v-bind:id="'user-name-' + data.item.id">{{data.item.username}}</label>
      </template>
      <template v-slot:cell(email)="data">
        <label v-bind:id="'user-email-' + data.item.id">{{data.item.email}}</label>
      </template>
      <template v-slot:cell(action)="data">
        <button v-if="data.item.id !== myID" @click.prevent="deleteUser(data.item.id)"  v-bind:id="'user-delete-' + data.item.id" type="button" class="btn btn-default"
          aria-label="Delete">
          <v-icon name="times" />
        </button>
      </template>
  </b-table>
</div>
</template>
<script>
import data from '@/data';

export default {
  components: {},
  data() {
    return {
      fields: [
        {
          key: 'username',
          sortable: true,
        },
        {
          key: 'email',
          sortable: true,
        },
        {
          key: 'action',
        },
      ],
      users: [],
    };
  },
  computed: {
    myID() {
      return this.$store.state.auth.user.id;
    },
  },
  methods: {
    async deleteUser(id) {
      const userIndex = this.users.findIndex(u => u.id === id);
      await data.user.deleteUser(id);
      this.users.splice(userIndex, 1);
    },
  },
  async created() {
    // load data if admin
    const resp = await data.user.getAll();
    this.users = resp.data;
  },
};
</script>
