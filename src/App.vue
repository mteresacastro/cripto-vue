<script setup>
import {ref} from 'vue'

const monedas = ref([
      { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
      { codigo: 'MXN', texto: 'Peso Mexicano'},
      { codigo: 'EUR', texto: 'Euro'},
      { codigo: 'GBP', texto: 'Libra Esterlina'},
  ])

</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
  </div>
  <div class="contenido">
    <form class="formulario">
        <div class="campo">
            <label for="moneda">Moneda:</label>
            <select id="moneda">
                
            </select>

        </div>
    </form>

  </div>

</template>


