<script setup>
    import {ref, reactive, onMounted, computed} from 'vue'
    import Alerta from './components/Alerta.vue'
    import Spinner from './components/Spinner.vue'
    import useCripto from './composable/useCripto'

    const {cotizarMoneda} = useCripto()
    
    cotizarMoneda();

    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
    ])

    const criptomonedas = ref([])
    const error = ref('')

    const cotizar = reactive({
        moneda:'',
        criptomoneda:''
    })

    const cotizacion = ref({}) // usamos ref porque aunque sea un objeto, no sabemos qué viene de la API. Usamos reactive para informacion que controlamos.

    const cargando = ref(false)

    onMounted(() =>{
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(({Data}) =>{
                criptomonedas.value = Data
            })
    })

    const cotizarCripto = () => {
        //Validar que cotizar esta lleno
       if(Object.values(cotizar).includes('')) {
        error.value= 'Todos los campos son obligatorios'
        return
       }
       error.value = ''
       obtenerCotizacion()
    }

    const obtenerCotizacion = async () => {

        cargando.value = true
        cotizacion.value = {}

        //inyectamos el valor elegido por el usuario en la url usando template string
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cotizar.criptomoneda}&tsyms=${cotizar.moneda}`
        
        const respuesta = await fetch(url)
        const data = await respuesta.json()
        //con la sintaxis de corchetes inyecta la variable
        cotizacion.value = data.DISPLAY[cotizar.criptomoneda][cotizar.moneda]

        cargando.value = false
    }

    const mostrarResultado = computed(() => {
        //intento comprobar si el objeto está vacío o no
        return Object.values(cotizacion.value).length > 0 ? true : false
    })

</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
  
    <div class="contenido">
        <Alerta
            v-if="error"
        >{{ error }}</Alerta>
        <form 
            class="formulario"
            @submit.prevent="cotizarCripto"
        >
            <div class="campo">
                <label for="moneda">Moneda:</label>
                <select 
                    id="moneda"
                    v-model="cotizar.moneda"
                >
                    <option value="">-- Selecciona --</option>
                    <option 
                        v-for="moneda in monedas" 
                        :value="moneda.codigo"
                    >{{ moneda.texto }}</option>
                </select>
            </div>
            <div class="campo">
                <label for="cripto">Cripomoneda:</label>
                <select 
                    id="cripto"
                    v-model="cotizar.criptomoneda"
                >
                    <option value="">-- Selecciona --</option>
                    <option 
                        v-for="criptomoneda in criptomonedas" 
                        :value="criptomoneda.CoinInfo.Name"
                    >{{ criptomoneda.CoinInfo.FullName }}</option>
                </select>
                <input type="submit" value="Cotizar" />
            </div>
        </form>

        <Spinner 
            v-if="cargando"
        />

        <div 
            class="contenedor-resultado"
            v-if="mostrarResultado" 
        >
            <h2>Cotización</h2>
            <div class="resultado">
                <img 
                    :src="'https://cryptocompare.com/' + cotizacion.IMAGEURL" 
                    alt="imagen cripto">
                <div>
                    <p>El precio es de: <span>{{ cotizacion.PRICE }}</span></p>
                    <p>Precio más alto del día: <span>{{ cotizacion.HIGHDAY }}</span></p>
                    <p>Precio más bajo del día: <span>{{ cotizacion.LOWDAY }}</span></p>
                    <p>Variación últimas 24h: <span>{{ cotizacion.CHANGEPCT24HOUR }} %</span></p>
                    <p>Última Actualización: <span>{{ cotizacion.LASTUPDATE }}</span></p>
                </div>
            </div>

        </div>

    </div>
</div>
</template>


