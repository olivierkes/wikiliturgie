<template>
<text-edit :id="id"></text-edit>
</template>

<script>
import { db } from '@/main'
export default {
  props: ["id"],
}
</script>
