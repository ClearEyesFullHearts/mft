<template>
  <div class="profile">
    <User></User>
    <UsersList></UsersList>
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
};

</script>
