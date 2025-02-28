<template>
  <div class="container flex justify-center" style="padding: 0px 100px 0px 100px">
    <div
      class="left w-50 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm text-center flex justify-center align-center flex-column gap-2"
      style="padding: 50px"
    >
      <div class="top">
        <p class="text-white text-2xl">You are paying</p>
        <hr />
        <h1 class="text-5xl text-white text-bold p-3" style="font-weight: bold">
          ${{ total_price }}
        </h1>
        <hr />
        <p class="text-white text-2xl">Cambodia</p>
      </div>
    </div>
    <div
      class="right bg-white w-50"
      style="display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <div class="info">
        <h1
          class="font-bold text-center text-4xl text-yellow-500 mt-3"
          style="font-family: fantasy"
        >
          S<span class="text-dark">vahab</span>
        </h1>
      </div>
      <div class="w-full max-w-sm p-4 rounded-lg dark:bg-gray-800 dark-gray-700">
        <div
          class="flex justify-center rounded-md flex-column text-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm text-center p-2"
        >
          <img class="px-2 rounded-md" :src="image" alt="QR image" />
          <p class="text-bold text-white">Owner Name QR</p>
        </div>
      </div>
      <div
        class="px-5 pb-5 gap-3"
        style="display: flex; justify-content: center; flex-direction: column; align-items: center"
      >
        <div class="flex flex-column justify-center text-center w-full">
          <h1 class="w-100" style="font-weight: bold; font-size: 15px">
            Scan this QR now to get your order successfully
          </h1>
          <h1 class="w-100" style="font-size: 12px">
            Before you click confirm please scan QR above
          </h1>
        </div>
        <button
          @click="submitPayment"
          type="button"
          class="text-white w-50 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-md text-sm px-8 py-2.5 text-center me-2 mb-2"
        >
          Confirm Paying
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Swal from 'sweetalert2'

  export default {
    data() {
      return {
        isPaid: false, // Payment status
        bookingId: null, // Booking ID from query
        total_price: '00.00', // Total price of booking or order
        userId: null, // User ID
        ownerId: null, // Owner ID of the field or product
        paymentDate: null, // Payment date
        field_id: null, // Field ID
        product_id: null, // Product ID
        token: null, // Authentication token
        qr: null, // QR code identifier
        image: null // URL of the QR code image
      }
    },
    async mounted() {
      // ======================= Component Mounted Lifecycle =======================
      this.bookingId = this.$route.query.booking // Get booking ID from route query
      this.orderId = localStorage.getItem('orderId') // Get order ID from localStorage
      this.userId = this.$route.params.id // Get user ID from route params
      this.paymentDate = new Date().toISOString().split('T')[0] // Set payment date to current date

      // Fetch necessary data based on available IDs
      if (this.bookingId) await this.fetchBooking()
      if (this.field_id) await this.fetchFieldOwner()
      if (this.orderId) await this.fetchOrder()
      if (this.product_id) await this.fetchProductOwner()
      if (this.ownerId) await this.fetchOwner()
      if (this.qr) await this.getImageUrl()
    },
    methods: {
      // ======================= Generate Random Code =======================
      generateRandomCode(length) {
        const min = Math.pow(10, length - 1)
        const max = Math.pow(10, length) - 1
        return Math.floor(Math.random() * (max - min + 1)) + min
      },

      // ======================= Submit Payment =======================
      async submitPayment() {
        console.log(this.total_price)
        try {
          const { data } = await axios.post('http://127.0.0.1:8000/api/payment/create', {
            user_id: this.userId,
            owner_id: this.ownerId,
            amount: this.total_price,
            method: 'QR',
            currency: 'USD',
            code: this.generateRandomCode(9),
            payment_date: this.paymentDate
          })

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'You have confirmed payment successfully.',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.isPaid = true
              this.updatePaymentStatus()
            }
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Something went wrong. Please try again.',
            confirmButtonText: 'OK'
          })
          console.error('Error creating payment:', error)
        }
      },

      // ======================= Update Payment Status =======================
      async updatePaymentStatus() {
        if (this.isPaid) {
          try {
            if (this.bookingId) {
              await axios.put(`http://127.0.0.1:8000/api/update/payment/booking/${this.bookingId}`)
            } else if (this.orderId) {
              await axios.put(`http://127.0.0.1:8000/api/update/payment/order/${this.orderId}`)
              localStorage.removeItem('orderId')
            }
            this.$router.push({ path: '/' }) // Redirect to home page after successful payment
          } catch (error) {
            console.error('Error updating payment status:', error)
          }
        }
      },

      // ======================= Fetch Booking Details =======================
      async fetchBooking() {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/booking/show/${this.bookingId}`)
          this.total_price = data.data.total_price
          this.field_id = data.data.field_id
        } catch (error) {
          console.error('Error fetching booking data:', error)
        }
      },

      // ======================= Fetch Field Owner =======================
      async fetchFieldOwner() {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/field/show/${this.field_id}`)
          this.ownerId = data.data.owner_id
        } catch (error) {
          console.error('Error fetching owner data:', error)
        }
      },

      // ======================= Fetch Order Details =======================
      async fetchOrder() {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/order/show/${this.orderId}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
          this.total_price = data.data.total_amount
          this.product_id = data.data.products[0].id
        } catch (error) {
          console.error('Error fetching order data:', error)
        }
      },

      // ======================= Fetch Product Owner =======================
      async fetchProductOwner() {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/product/show/${this.product_id}`)
          this.ownerId = data.data.owner_id
        } catch (error) {
          console.error('Error fetching product owner data:', error)
        }
      },

      // ======================= Fetch Owner Details =======================
      async fetchOwner() {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/owner/show/${this.ownerId}`)
          this.qr = data.data.qr
        } catch (error) {
          console.error('Error fetching owner data:', error)
        }
      },

      // ======================= Get QR Code Image URL =======================
      async getImageUrl() {
        this.image = `http://127.0.0.1:8000/storage/${this.qr}`
      }
    }
  }
</script>


<style scoped>
</style>
