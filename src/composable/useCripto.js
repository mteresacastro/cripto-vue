import { ref, onMounted, computed } from 'vue'

export default function useCripto() {

    const criptomonedas = ref([])

    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
    ])

    onMounted(() =>{
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(({Data}) =>{
                criptomonedas.value = Data
            })
    })

    const cotizacion = ref({}) // usamos ref porque aunque sea un objeto, no sabemos qué viene de la API. Usamos reactive para informacion que controlamos.

    const cargando = ref(false)

    const obtenerCotizacion = async (cotizar) => {

        cargando.value = true
        cotizacion.value = {}

        const {moneda, criptomoneda} = cotizar
        //inyectamos el valor elegido por el usuario en la url usando template string
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
        
        const respuesta = await fetch(url)
        const data = await respuesta.json()
        //con la sintaxis de corchetes inyecta la variable
        cotizacion.value = data.DISPLAY[criptomoneda][moneda]

        cargando.value = false
    }

    const mostrarResultado = computed(() => {
        //intento comprobar si el objeto está vacío o no
        return Object.values(cotizacion.value).length > 0 ? true : false
    })

    return {
      monedas,
      criptomonedas,
      cargando,
      cotizacion,
      obtenerCotizacion,
      mostrarResultado
    }
}