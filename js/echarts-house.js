// 顶部时间
let timer = setTimeout(time, 1000)
function toFix(t) {
  return t.toString().length < 2 ? `0${t}` : t
}
function time() {
  clearTimeout(timer)
  dt = new Date()
  const y = toFix(dt.getFullYear())
  const m = toFix(dt.getMonth() + 1)
  const d = toFix(dt.getDate())
  const h = toFix(dt.getHours())
  const mi = toFix(dt.getMinutes())
  const s = toFix(dt.getSeconds())
  $('.show-time').text(`当前时间：${y}-${m}-${d} ${h}: ${mi}: ${s}`)
  timer = setTimeout(time, 1000)
}
// 打乱数组
const shuffle = arr => arr.sort(() => Math.random() - 0.5)

let ori_pie, ori_bar
// 获取房屋数量
const getHouseNum = () => {
  return new Promise(resolve => {
    $.ajax({
      url: 'http://localhost:5000/rent_number',
      data: {},
      dataType: 'json',
      success: res => {
        ori_pie = shuffle(res.data.filter(item => item[0] != '北京周边'))
        resolve()
      },
    })
  })
}
function transPie(data) {
  const arr = []
  data.forEach(item => {
    arr.push({ value: item[1], name: item[0] })
  })
  return arr
}
getHouseNum().then(() => {
  const data_pie = transPie(ori_pie)
  renderPie(data_pie)
})
// 获取房屋平均价格
const getHousePrice = () => {
  return new Promise(resolve => {
    $.ajax({
      url: 'http://localhost:5000/rent_price_average',
      data: {},
      dataType: 'json',
      success: res => {
        ori_bar = shuffle(res.data.filter(item => item[0] != '北京周边'))
        const totalA = ori_bar.reduce((acc, cur) => acc + cur[3], 0)
        ori_bar.forEach(item => {
          item.push(Number(((item[3] / totalA) * 100).toFixed(2)))
        })
        resolve()
      },
    })
  })
}
function transBar(data) {
  const obj = {
    region: [],
    total: [],
    area: [],
    average: [],
    percent: [],
  }
  data.forEach(item => {
    obj['region'].push(item[0])
    obj['total'].push(item[1])
    obj['area'].push(item[2])
    obj['average'].push(item[3])
    obj['percent'].push(item[4])
  })
  return obj
}
function transMap(data) {
  const arr = []
  data.forEach(item => {
    arr.push({ name: item[0] + '区', value: item[2] })
  })
  return arr
}
getHousePrice().then(() => {
  const data_bar = transBar(ori_bar)
  const data_map = transMap(ori_bar)
  const other = [
    { name: '怀柔区', value: 38.4 },
    { name: '密云区', value: 47.9 },
    { name: '延庆区', value: 232.4 },
    { name: '平谷区', value: 42.3 },
  ]
  renderBar(data_bar)
  renderMap(data_map.concat(other))
})

const data_map = [
  { name: '怀柔区', value: 38.4 },
  { name: '密云区', value: 47.9 },
  { name: '昌平区', value: 196.3 },
  { name: '顺义区', value: 102 },
  { name: '平谷区', value: 42.3 },
  { name: '门头沟区', value: 30.8 },
  { name: '海淀区', value: 369.4 },
  { name: '石景山区', value: 65.2 },
  { name: '西城区', value: 129.8 },
  { name: '东城区', value: 90.5 },
  { name: '朝阳区', value: 395.5 },
  { name: '大兴区', value: 156.2 },
  { name: '房山区', value: 104.6 },
  { name: '丰台区', value: 232.4 },
  { name: '延庆区', value: 232.4 },
  { name: '通州区', value: 232.4 },
]

// 左侧柱状图
function renderBar(data_bar) {
  // TODO:在这里修改柱状图颜色
 
  let chartDom = document.querySelector('.bar-l .chart')
  let myChart = echarts.init(chartDom)
  let option
  
  var rent_name = []
  var rent_value = []
  var rent_pro_max = []
	for(var j = 0; j < data_bar['region'].length; j++){
  		areatemp = {}
  		rent_name.push(data_bar['region'][j])
  		rent_value.push(data_bar['average'][j])
	}
	for(var j = 0; j < data_bar['region'].length; j++){
		rent_pro_max.push(200)
	}
	
  console.log(rent_name)
  console.log(rent_value)
  var total = 300; // 数据总数
  
 option = {
    backgroundColor:"#003366",
    grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top: '2%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none'
        },
        formatter: function(params) {
            return params[0].name  + ' : ' + params[0].value
        }
    },
    xAxis: {
        show: false,
        type: 'value'
    },
    yAxis: [{
        type: 'category',
        inverse: true,
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            },
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        data: rent_name
    }, {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
            textStyle: {
                color: '#ffffff',
                fontSize: '12'
            },
        },
        data:rent_value
    }],
    series: [{
            name: '值',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
                normal: {
                    barBorderRadius: 30,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgb(57,89,255,1)'
                    }, {
                        offset: 1,
                        color: 'rgb(46,200,207,1)'
                    }]),
                },
            },
            barWidth: 20,
            data: rent_value
        },
        {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            data: 300,
            itemStyle: {
                normal: {
                    color: 'rgba(24,31,68,1)',
                    barBorderRadius: 30,
                }
            },
        },
    ]
};

  option && myChart.setOption(option);
  $(window).resize(() => myChart.resize())
}

// 右侧饼状图
function renderPie(data_pie) {
  let chartDom = document.querySelector('.pie-r .chart')
  let myChart = echarts.init(chartDom)
  let option
  option = {
      title: {
          text: '租房数量比例',
          left: 'left',
		  textStyle: {
			   fontSize: 17,
			      fontWeight: 'bolder',
			      color: '#ffffff'
		  }
      },
	  color:['#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#0055ff', '#6173d6', '#914ce5', '#42b1cc', '#0055ff', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#0000ff', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', ],
  	legend: {
  	  bottom: '0%',
  	  itemWidth: 10,
  	  itemHeight: 10,
  	  textStyle: {
  	    color: 'rgba(114, 128, 255, 0.5)',
  	    fontSize: '12',
  	  },
	  y: '290'
  	},
	grid: {
  		left: 80,
  		top: 0, // 设置条形图的边距
  		right: 150,
  		bottom: 10,
  	},
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
          {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: data_pie,
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };

  option && myChart.setOption(option);
  $(window).resize(() => myChart.resize())
}

// 中间地图
function renderMap(data_map) {
  console.log(data_map)
  let chartDom = document.querySelector('.map .chart')
  let myChart = echarts.init(chartDom)
  let option
  option = {
    tooltip: {
      trigger: 'item',
      // TODO:触碰显示文字信息
      formatter: function (val) {
        return val.data.name + '<br>租房数量: ' + val.data.value + '个'
      },
    },
    // TODO:修改各区域颜色显示（热力图）
    /* visualMap: {
      type: 'continuous',
      show: true,
      min: 0,
      max: 400,
      textStyle: {
        fontSize: 15,
        color: '#fff',
      },
      realtime: false,
      calculable: true,
      inRange: {
        // 图元的颜色
        color: ['#9fb5ea', '#e6ac53', '#74e2ca', '#85daef', '#9feaa5', '#5475f5'],
      },
    }, */
    series: [
      {
        type: 'map',
        map: '北京',
        mapType: 'province',
        // 缩放倍数
        zoom: 0.9,
        // 开启缩放或者平移
        roam: true,
        // 区域名显示/隐藏
        label: {
          emphasis: {
            show: true,
            color: '#fff',
          },
        },
        // 如果设置了visualMap, 地图区域颜色不起作用
        itemStyle: {
          // 默认状态颜色
          normal: {
            areaColor: 'rgba(20, 41, 87, 0.6)',
            borderColor: '#195BB9',
            borderWidth: 1,
            borderType: 'solid',
          },
          // 高亮状态颜色
          emphasis: {
            areaColor: '#2B91B7',
          },
        },
        data: data_map,
      },
    ],
  }

  option && myChart.setOption(option)
  $(window).resize(() => myChart.resize())
}


// 租房形式比例
function get_rentform(){
	var rentform_num;
	$.ajax({
		url:"http://localhost:5000/rent_form",
		data:{"homestyle":"整租"},
		dataType:"json",
		Type:'GET',
		success: function(data){
		      rentform_num = data['合租']
			  console.log(rentform_num)
			  renderForm(rentform_num)
		}
	})
}

get_rentform()

// 租房形式饼图
function renderForm(rentform_num){
	
	
	console.log(rentform_num)
	
	let chartDom = document.querySelector('.pie-r2 .chart2')
	let myChart = echarts.init(chartDom)
	let option
	
	var data = rentform_num
	option = {
		title: {
			text: '租房方式比例',
			left: 'left',
			textStyle: {
						   fontSize: 17,
						   fontWeight: 'bolder',
						   color: '#ffffff'
			}
		},
		grid: {
			left: 80,
			top: 20, // 设置条形图的边距
			right: 1400,
			bottom: 20,
		},
	    "series": [{
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["60%", "80%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: false
	            },
	            "data": [{
	                    "name": "",
	                    "value": data > 100 ? 100 : data,
	                    "label": {
	                        "show": true,
	                        "position": "center",
	                        "formatter": function(o) {
	                            return ['{a|' + data + '}{b|%}',
	                                '{c|合租占比}'
	                            ].join('\n')
	                        },
	                        rich: {
	                            a: {
	                                color: '#1e50f3',
	                                fontSize: 16,
	                                // fontWeight: 'bold',
	                                fontFamily: 'mission'
	                            },
	                            b: {
	                                color: '#5841F3',
	                                fontSize: 12,
	                                // fontWeight: 'bold'
	                            },
	                            c: {
	                                color: '#263039',
	                                fontSize: 12
	                            }
	                        }
	                    },
	                    itemStyle: {
	                        color: '#6810ff '
	                    },
	
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": "",
	                    itemStyle: {
	                        color: 'rgb(0 2 69)'
	                    },
	                }
	            ]
	        },
	        {
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["60%", "95%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: true
	            },
	            itemStyle: {
	                color: 'rgba(0,0,0,0)'
	            },
	            emphasis: {
	                label: {
	                    // color: "rgb(0 2 69);" ,
	                    borderColor: 'rgb(0 2 69)'
	
	                }
	            },
	            data: [{
	                    name: '',
	                    value: data / 2,
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": 0,
	                    itemStyle: {
	                        color: '#2f2f2f'
	                    },
	                    "label": {
							show: 'true',
	                        position: 'inside',
	                        formatter: function() {
	                            return '{a|合租}'
	                        },
	                        rich: {
	                            a: {
	                                color: '#fff',
	                                fontSize: 14,
	                                width: 42,
	                                height: 42,
	                                borderRadius: 21,
	                                borderWidth: 4,
	                                borderColor: 'rgb(0 2 69)',
	                                fontWeight: 100,
	                                // lineHeight:100,
	                                backgroundColor: '#0077FF',
	                            }
	                        }
	                    },
	
	                },
	                { //画剩余的刻度圆环
	                    "name": "",
	                    "value": 100 - data / 2,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                    "label": {
	                        show: true
	                    }
	                }
	            ]
	        },
	        //支de 半圆的线
	        {
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["55%", "85%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: false
	            },
	            data: [{
	                    name: '',
	                    value: data * 1,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                {
	                    name: '',
	                    value: (100 - data) * .5,
	                    itemStyle: {
	                        color: '#00FFF6'
	                    },
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": 0,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                { //画剩余的刻度圆环
	                    "name": "",
	                    "value": 100 - data - (100 - data) * .5,
	                    itemStyle: {
	                        color: '#00FFF6'
	                    },
	                    "label": {
	                        show: false
	                    }
	                }
	            ]
	        },
	        //整租的中心圆
	        {
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["80%", "90%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: false
	            },
	            data: [{
	                    name: '',
	                    value: data,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                {
	                    name: '',
	                    value: (100 - data) * .5,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": 0,
	                    itemStyle: {
	                        color: '#fff'
	                    },
	                    "label": {
	                        position: 'inside',
	                        fontWeight: 'normal',
	                        formatter: function() {
	                            return '{a|整租}'
	                        },
	                        rich: {
	                            a: {
	                                color: '#212121',
	                                fontSize: 15,
	                                width: 42,
	                                height: 42,
	                                borderRadius: 21,
	                                fontWeight: 100,
	                                borderWidth: 2,
	                                borderColor: 'rgb(0 2 69)',
	                                fontFamily: 'Microsoft YaHei',
	                                // lineHeight:100,
	                                backgroundColor: '#00FFF6',
	                            }
	                        }
	                    }
	                },
	                { //画剩余的刻度圆环
	                    "name": "",
	                    "value": 100 - data - (100 - data) * .5,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                    "label": {
	                        show: false
	                    }
	                }
	            ]
	        },
	        //支的label线
	        {
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["90%", "90%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: true
	            },
	            data: [{
	                    name: '',
	                    value: data,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                {
	                    name: '',
	                    value: (100 - data) * .5,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": 0,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                    "label": {
	                        // position: 'inside',
	                        fontWeight: 'normal',
	                        color: '#fff',
	                        formatter: function() {
	                            return (100 - data) + '%'
	                        }
	                    },
	                    labelLine: {
	                        show: true,
	                        length: 0,
	                        length2: 40,
	                        lineStyle: {
	                            color: '#46b8b1'
	                        }
	                    }
	                },
	                { //画剩余的刻度圆环
	                    "name": "",
	                    "value": 100 - data - (100 - data) * .5,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                    "label": {
	                        show: false
	                    }
	                }
	            ]
	        },
	        //合租的label线
	        {
	            type: 'pie',
	            "center": ["50%", "50%"],
	            "radius": ["90%", "90%"],
	            "hoverAnimation": false,
	            startAngle: -180,
	            clockwise: false,
	            labelLine: {
	                show: false
	            },
	            itemStyle: {
	                color: 'rgba(0,0,0,0)'
	            },
	            emphasis: {
	                label: {
	                    // color: "rgb(0 2 69);" ,
	                    borderColor: 'rgb(0 2 69)'
	
	                }
	            },
	            data: [{
	                    name: '',
	                    value: data / 2,
	                },
	                { //画中间的图标
	                    "name": "",
	                    "value": 0,
	                    itemStyle: {
	                        color: '#fff'
	                    },
	                    "label": {
	                        // position: 'inside',
	                        fontWeight: 'normal',
	                        color: '#fff',
	                        formatter: function() {
	                            return (data) + '%'
	                        }
	                    },
	                    labelLine: {
	                        show: true,
	                        length: 0,
	                        length2: 40,
	                        lineStyle: {
	                            color: '#576766'
	                        }
	                    }
	
	                },
	                { //画剩余的刻度圆环
	                    "name": "",
	                    "value": 100 - data / 2,
	                    itemStyle: {
	                        color: 'rgba(0,0,0,0)'
	                    },
	                    "label": {
	                        show: false
	                    }
	                }
	            ]
	        },
	    ]
	}
		
		option && myChart.setOption(option);
}






