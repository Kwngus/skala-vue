<script setup>
import SlotNamedChild from './SlotNamedChild.vue';
</script>

<template>
    <div class="practice-section">
        <h2>Named Slot 주입 실습</h2>
        <SlotNamedChild>
            <template v-slot:header>
                <h3>child 주입 제목</h3>
            </template>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eisumod tmpor incididunt..."</p>
        </SlotNamedChild>
    </div>
</template>