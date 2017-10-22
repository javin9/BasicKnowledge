<template>
	<section v-if="labels.length>0">
		<h2>未来三年估值走势</h2>
		<canvas id="myChart"></canvas>
	</section>
</template>

<style scoped>
	@import 'sassHelper/mixin';

	section{
		background: #fff;
		padding-left:px2rem(30);
		padding-bottom: px2rem(30);
	}

	h2{
		@include fsize(30)
		@include borderBottom;
		color:#686868;
		padding:px2rem(20) 0;
	}

	canvas{
		width: px2rem(640) !important;
		height:auto !important;
		margin:px2rem(30) auto;
	}
</style>

<script>
import Chart from 'chart.js'

const dpr = document.documentElement.getAttribute('data-dpr')

// Chart.defaults.global.defaultFontSize = 26/2*dpr

function drawBarValues(){
  var ctx = this.chart.ctx
  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily)
  ctx.fillStyle = '#333'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  this.data.datasets.forEach(function (dataset) {
    for (var i = 0; i < dataset.data.length; i++) {
      if(dataset.hidden === true && dataset._meta[Object.keys(dataset._meta)[0]].hidden !== false){ continue }
      var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model
      if(dataset.data[i] !== null){
        ctx.fillText(`${dataset.data[i]}万`, model.x - 1, model.y - 5)
      }
    }
  })
}

export default {
  data () {
    return {
    	labels:(window.ScrapValue? window.ScrapValue.map(value => `${value.Year}年`):[]),
    	data: (window.ScrapValue?window.ScrapValue.map(value => value.Price):[])
    }
  },

  created(){
  },

  ready(){
      if(this.labels.length>0){
          let ctx = document.getElementById("myChart");
          let myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                  showLine:false,
                  labels: this.labels,
                  datasets: [{
                      data: this.data,
                      backgroundColor: [
                          '#58D7EA',
                          '#F9B94C',
                          '#FA656B'
                      ],
                      borderWidth: 0
                  }]
              },
              options: {
                  title:{
                      display:true,
                      text:''
                  },
                  animation: {
                      onProgress: drawBarValues,
                      onComplete: drawBarValues
                  },
                  hover: { animationDuration: 0 },
                  tooltips: false,
                  responsive:false,
                  legend:{
                      display:false
                  },
                  scales: {
                      xAxes:[{
                          gridLines: {
                              display: false
                          },
                          categoryPercentage: .4
                      }],
                      yAxes: [{
                          display:false,
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                  }
              }
          })
	  }

  },

  methods: {
  }
}
</script>