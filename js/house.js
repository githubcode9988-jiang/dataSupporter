let defaultData, jsonData, totalPage
let limit = 150
let page = 1
// 获取房屋数据
const getList = params => {
  $.ajax({
    url: 'http://localhost:5000/rentinfo',
    data: JSON.stringify(params),
    type: 'post',
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    success: res => {
      jsonData = res
      defaultData = JSON.parse(JSON.stringify(res))
      totalPage = Math.ceil(jsonData.length / limit)
      initData(jsonData)
      sortLinks()
      pageRender()
    },
  })
}
const defaultParams = {
  homestyle: '', // 整租/合租
  subway: '', // 有无地铁
  price: '', // xxx-xxx
  orientation: '', // 朝南/朝东/朝西/朝北/南北/东南/西北/东西
  locate: '', // 无区域
}
getList(defaultParams)

// 渲染房屋数据
function initData(data) {
  const renderData = data.slice((page - 1) * limit, page * limit)
  let str = ``
  renderData.forEach(item => {
    str += `<div class="i-box">
      <div class="p-box">
          <a href="javascript:;">
              <img src="${item[4]}">
          </a>
      </div>
      <div class="info">
          <h5 class="title">
            ${item[7]}
          </h5>
          <div class="info-desc">
              <div class="desc">
                ${item[3]}
              </div>
              <div class="price">
                  ￥<span>${item[5]}</span>
              </div>
          </div>
          <div class="phone">联系人：<span>${item[6]}</span></div>
          <div class="address">地址：<span>${item[2]}</span></div>
          <div class="area">面积：<span>${item[8]}</span></div>
      </div>
    </div>`
  })
  $('.pic-house').html(str)
}
// 排序规则 默认/价格/面积
function sortLinks() {
  // 给排序加active
  const $links = $('.sort-house span')
  $links.each((i, item) => {
    // -1：降序 1：正序
    item.flag = -1
    item.onclick = function () {
      // 清除之前的排序规则
      $links.each((i, sort) => {
        if (sort != this) {
          sort.flag = -1
        }
      })
      // 保证只有一个标签是亮的
      $(this).addClass('active').siblings().removeClass('active')
      // 改变升序降序
      this.flag *= -1
      const $arrow = $(this).children('.glyphicon')
      if ($arrow.length) {
        $arrow.css('transform', '')
      }
      // 降序
      if (this.flag != 1) {
        if ($arrow.length) {
          $arrow.css('transform', 'rotate(180deg)')
        }
      }
      // 根据对应规则进行排序
      const sortFlag = $(this).attr('sortFlag')
      switch (sortFlag) {
        case 'price':
          jsonData.sort((a, b) => (a[5] - b[5]) * this.flag)
          break
        case 'default':
          jsonData = JSON.parse(JSON.stringify(defaultData))
          break
        case 'area':
          jsonData.sort((a, b) => (parseInt(a[8]) - parseInt(b[8])) * this.flag)
          break
      }
      initData(jsonData)
    }
  })
}
// 渲染分页符
function pageRender() {
  let arr = new Array(totalPage).fill(0)
  let str = `<ul class="pagination">
      <li>
        <span aria-label="Previous">«</span>
      </li>
      ${arr.map((item, i) => `<li class="${i + 1 === page ? 'active' : ''}"><span>${i + 1}</span></li>`).join('')}
      <li>
        <span aria-label="Next">»</span>
      </li>
  </ul>`
  $('.navPage').html(str)
  $('.navPage').click(debounce(e => pageClick(e), 300))
}
// 点击分页符回到顶部/切换数据
function pageClick(e) {
  let listT = $('.main-house').offset().top - 50
  const t = $(e.target).text()
  if (t === '«') {
    page > 1 ? page-- : (page = 1)
  } else if (t === '»') {
    page < totalPage - 1 ? page++ : (page = totalPage)
  } else {
    page = Number(t)
  }
  initData(jsonData)
  // 更改active样式
  $('.navPage span').eq(page).parent().addClass('active').siblings().removeClass('active')
  // 回到开始找房那里
  $(document).scrollTop(listT)
}
// 下拉框找房
function selectHouse() {
  const params = JSON.parse(JSON.stringify(defaultParams))
  // 使用与选择器和非选择器获取已经选中的值
  $('.dropdown-toggle.btn-default:not(".bs-placeholder")').each((i, item) => {
    const sf = $(item).prev().attr('selectFlag')
    const t = $(item).attr('title')
    if (sf in params) {
		console.log(sf)
      if (sf === 'subway') {
        if (t.includes('有')) {
          params[sf] = '线'
        } else {
          params[sf] = '无'
        }
      } else if (sf === 'price') {
        params[sf] = t.slice(0, -1)
      } else {
        params[sf] = t
      }
    }
  })
  console.log(params)
  getList(params)
}
$('#search-house').click(debounce(e => selectHouse(e), 300))

// 防抖
function debounce(fn, wait) {
  let timer = null,
    result
  return function (...params) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      result = fn.call(this, ...params)
    }, wait)
    return result
  }
}

var flag=true;
$(".footerBox").click(function(){
		     
if(flag == true){;
$(".animate-bounce-down1").css("display","inline-block");
$(".animate-bounce-down").css("display","none");
	flag=false;
}else{
	$(".animate-bounce-down").css("display","inline-block");
	$(".animate-bounce-down1").css("display","none");
	flag=true;
}
	 $(this).find(".footer_content").stop().slideToggle(500);
});

//top导航 鼠标触碰事件
function change_background_color(x){
   x.style.backgroundColor='#59f042';
}
function normal_background_color(x){
   x.style.backgroundColor='#1a1a1a';
}
