<template>
  <div class="profile">
    <UserComp></UserComp>
    <UsersList v-if="isAdmin"></UsersList>
  </div>
</template>

<script>
import UserComp from '@/components/profile/User.vue';
import UsersList from '@/components/profile/UsersList.vue';

export default {
  name: 'ProfilePage',
  components: {
    UserComp,
    UsersList,
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
};

</script>
