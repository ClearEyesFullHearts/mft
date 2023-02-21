<template>
  <div class="profile">
    <User></User>
    <UsersList v-if="isAdmin"></UsersList>
  </div>
</template>

<script>
import User from '@/components/profile/User.vue';
import UsersList from '@/components/profile/UsersList.vue';

export default {
  name: 'profile',
  components: {
    User,
    UsersList,
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
};

</script>
