<template>
  <div class="container flex text-black">
    <!-- Sidebar -->
    <aside class="w-64 fixed top-0 left-0 h-full bg-black text-white p-4">
      <a href="/"><h2 class="text-2xl font-semibold mb-4">History</h2></a>
      <nav>
        <div class="mb-4">
          <a
            href="#"
            class="flex items-center space-x-2 hover:text-gray-300"
            @click="setFilter('booking')"
          >
            <i class="bx bx-history text-2xl"></i>
            <span>Booking</span>
          </a>
        </div>
        <div class="mb-4">
          <a
            href="#"
            class="flex items-center space-x-2 hover:text-gray-300"
            @click="setFilter('order')"
          >
            <i class="bx bx-cart text-2xl"></i>
            <span>Order</span>
          </a>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 p-4 flex-1">
      <h1 class="text-5 font-bold text-center flex items-center justify-center m-3">
        About History
      </h1>

      <div class="booking m-5" v-if="filter === 'booking'">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Today - Saturday, June 29, 2024</h3>
          <div class="custom-date-input">
            <input
              type="date"
              class="border border-gray-300 rounded-lg p-2 custom-input"
              placeholder="Search by date"
            />
            <i class="icon bx bx-search custom-icon"></i>
          </div>
        </div>
        <div class="label flex justify-between">
          <span class="text-gray-500">Date</span>
          <span class="text-gray-400">Field Name</span>
          <span class="text-gray-400">Start Time</span>
          <span class="text-gray-400">End Time</span>
          <span class="text-gray-400">Status</span>
          <span class="text-gray-400">Payment Status</span>
          <span class="text-gray-400">Action</span>
        </div>
        <hr />
        <ul class="overflow-y-auto h-70 mb-5">
          <router-link 
            :to="{
              path: `/field/detail/${booking.field_id}`,
              query: { customer: userId }
            }"
            v-for="(booking, index) in bookings"
            :key="index"
            class="flex items-center space-x-4 mb-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <input type="checkbox" />
            <p class="text-gray-500">{{ booking.created_at }}</p>
            <div class="flex-1">
              <p class="text-base font-medium">{{ booking.field_name }}</p>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">{{ booking.start_time }}</p>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">{{ booking.end_time }}</p>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">{{ booking.status }}</p>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">{{ booking.payment_status }}</p>
            </div>

            <div class="relative">
              <button @click="toggleDropdown(index)" class="text-gray-500 hover:text-gray-700">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div
                v-if="dropdownIndex === index"
                class="absolute right-0 mr-5 w-48 bg-white border rounded-lg shadow-xl"
              >
                <a
                  @click="deleteHistoryBooking(booking.id)"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >Remove history</a
                >
              </div>
            </div>
          </router-link>
        </ul>
      </div>

      <div class="orders" v-if="filter === 'order'">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Today - Saturday, June 29, 2024</h3>
          <div class="custom-date-input">
            <input
              type="date"
              class="border border-gray-300 rounded-lg p-2 custom-input"
              placeholder="Search by date"
            />
            <i class="icon bx bx-search custom-icon"></i>
          </div>
        </div>
        <div class="label flex justify-between">
          <span class="text-gray-500">Date</span>
          <span class="text-gray-400">Product Name</span>
          <span class="text-gray-400">Quantity</span>
          <span class="text-gray-400">Price</span>
          <span class="text-gray-400">Total</span>
          <span class="text-gray-400">Order</span>
          <span class="text-gray-400">Action</span>
        </div>
        <hr />
        <ul class="overflow-y-auto h-80">
          <router-link
           :to="{
              path: `/product/detail/${order.products[0].id}`,
              query: { customer: userId }
            }"
            v-for="(order, index) in orders"
            :key="order.id"
            class="flex items-center space-x-4 mb-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <input type="checkbox" />
            <p class="text-gray-500">{{ order.created_at }}</p>
            <div class="order flex items-center space-x-4 mb-2 p-2 hover:bg-gray-100 rounded-lg">
              <div class="flex-1">
                <p class="text-base font-medium">{{ order.products[0].name }}</p>
              </div>
              <div class="flex-1">
                <p class="text-base font-medium">{{ order.products[0].qty }}</p>
              </div>
              <div class="flex-1">
                <p class="text-base font-medium">{{ order.products[0].price }}</p>
              </div>
              <div class="flex-1">
                <p class="text-base font-medium">{{ order.products[0].total }}</p>
              </div>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">{{ order.order_date }}</p>
            </div>
            <div class="relative">
              <button @click="toggleDropdown(index)" class="text-gray-400 hover:text-gray-700">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div
                v-if="dropdownIndex === index"
                class="absolute right-0 mr-4 w-45 bg-white border rounded-lg shadow-xl"
              >
                <a class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Remove history</a>
              </div>
            </div>
          </router-link>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
  // ======================= Import Necessary Files and Libraries =======================
  import { ref, computed, onMounted } from 'vue'
  import axiosInstance from '@/plugins/axios'
  import { useRoute } from 'vue-router'
  import router from '@/router'

  // ======================= State and Variables =======================
  const route = useRoute()
  const bookings = ref([])
  const orders = ref([])
  const userId = computed(() => route.params.id)
  const filter = ref('booking') // Initialize filter to 'booking'
  const dropdownIndex = ref(null)

  // ======================= Lifecycle Hooks =======================
  onMounted(() => {
    fetchBookingByUserId()
    fetchOrdersByUserId()
  })

  // ======================= Fetch Data Methods =======================
  const fetchBookingByUserId = async () => {
    try {
      const response = await axiosInstance.get(`/customer/bookings/${userId.value}`)
      bookings.value = response.data
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchOrdersByUserId = async () => {
    try {
      const response = await axiosInstance.get(`/customer/orders/${userId.value}`)
      orders.value = response.data
      console.log(orders.value)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  // ======================= Action Methods =======================
  const deleteHistoryBooking = async (id) => {
    try {
      const response = await axiosInstance.delete(`/customer/bookings/delete/${id}`)
      console.log('Deleted successfully')
      bookings.value = bookings.value.filter((booking) => booking.id !== id)
      dropdownIndex.value = null
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      const response = await axiosInstance.delete(`/customer/orders/delete/${orderId}`)
      console.log('Delete response:', response.data)
      orders.value = orders.value.filter((order) => order.id !== orderId)
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  // ======================= UI Interaction Methods =======================
  const toggleDropdown = (index) => {
    dropdownIndex.value = dropdownIndex.value === index ? null : index
  }

  const setFilter = (type) => {
    filter.value = type
  }
</script>







<style scoped>
  .container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  .main-content {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #eaeaea;
  }
  li:last-child {
    border-bottom: none;
  }
  button {
    border: none;
    background: none;
    cursor: pointer;
  }
  button:hover {
    color: #007bff;
  }
  .group-container {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .group-container h4 {
    margin-bottom: 0.5rem;
  }
  .order {
    width: 66%;
    text-align: center;
  }
  .custom-date-input {
    display: flex;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 20px;
    padding: 5px;
  }

  .custom-input {
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    outline: none;
    border: none;
    background-color: transparent;
    width: 150px;
  }

  .custom-icon {
    font-size: 20px;
    margin-left: 10px;
    color: #555;
  }
</style>