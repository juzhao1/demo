

const data = {
  container: undefined,
  rangingBtn: undefined,
  startRanging: false,
  isDraw: false,
  rule: undefined,
  horizontalLine: [],
  verticalLine: [],
  fixedCamera: false,
  event: undefined,
  tip_label: undefined,
}

function init() {
  data.map = AMap ? new AMap.Map('map-toolName', {
    viewMode: '3D',
    zoom: 20,
    showFog: false,
    resizeEnable: true,
    expandZoomRange: true,
    rotateEnable: true,
    pitchEnable: true,
  }) : undefined;
  data.container = document.getElementById('map-toolName');
  data.rangingBtn = document.getElementById('ranging');
  if(data.map) {
    data.rule = new AMap.RangingTool(data.map);
    data.map.on('mousedown', mapMousedown);
    data.map.on('click', mapClick);
    data.map.on('mousemove', mapMousemove);
    window.addEventListener('keydown', mapKeydown);
    data.rangingBtn.onclick = toggleRanging;
    window.gd = data.map;
    window.rule = data.rule;
  }
}

function toggleRanging() {
  data.startRanging = !data.startRanging;
  data.isDraw = data.startRanging;
  data.rangingBtn.innerHTML = data.startRanging ? '关闭测量' : '测量高度';
  if (data.startRanging) {
    data.rule.turnOn();
  } else {
    data.rule.turnOff();
    clearRule();
  }
}

function clearRule() {
  data.horizontalLine = [];
  data.verticalLine = [];
  data.map.clearMap();
  toggleFix();
}

function mapMousedown(e) {
  console.log('down==>', e.lnglat);
}

let restart = false;

function mapClick(e) {
  if (data.startRanging) {
    if (data.horizontalLine.length === 2) {
      data.verticalLine.push(e.lnglat);
    } else {
      data.horizontalLine.push(e.lnglat);
    }
    if ((data.horizontalLine.length === 2 && data.verticalLine.length === 0) || data.verticalLine.length === 2) {
      restart = true;
    }
  }
}

function mapMousemove(e) {
  if (restart) {
    restart = false;
    triggerKeyboardEvent(document, 27);
    if (data.horizontalLine.length === 2 && data.verticalLine.length === 0) {
      const [start, end] = data.horizontalLine;
      const { geometry: { coordinates } } = turf.midpoint(turf.point([start.lng, start.lat]), turf.point([end.lng, end.lat]));
      const rotate = Math.atan((end.lat - start.lat)/(end.lng - start.lng));
      toggleFix(new AMap.LngLat(coordinates[0]-(Math.sin(rotate) * 0.0016), coordinates[1]+(Math.cos(rotate) * 0.0016)), rotate * 180 / Math.PI);
      // toggleFix(new AMap.LngLat(coordinates[0], coordinates[1]), rotate * 180 / Math.PI);
    } else if (data.verticalLine.length === 2) {
      data.rangingBtn.innerHTML = '清除测量';
      data.rule.turnOff();
      data.isDraw = false;
      if (data.tip_label ) {
        data.map.remove(data.tip_label);
        data.tip_label = undefined;
      }
    }
  }
  if (data.verticalLine.length < 2 && data.isDraw) {
    const point = new AMap.LngLat(e.lnglat.lng, e.lnglat.lat);
    showTip(point, data.horizontalLine.length < 2 ? '绘制水平线' : '绘制高度线');
  }
}

function showTip(point, tip) {
  if (data.tip_label) {
    data.tip_label.setPosition(point);
    data.tip_label.setText(tip);
  } else {
    data.tip_label = new AMap.Text({
      text: tip,
      style:{
        "margin-bottom": '20px',
        'background-color': "#FFFBCC",
        'border': "1px solid #E1E1E1",
        'border-radius': "2px",
        'color': "#703A04",
        'font-size': "12px",
        'letter-spacing': "0",
        'padding': "2px 5px",
      },
      offset: new AMap.Pixel(50, -20),
      position: point
    });
    data.map.add(data.tip_label)
  }
}

function mapKeydown(e) {
  console.log('key', e);
}

//模拟键盘触发事件方法
function triggerKeyboardEvent(el, keyCode) {
  var eventObj = document.createEventObject ?
      document.createEventObject() : document.createEvent("Events");

  if (eventObj.initEvent) {
      eventObj.initEvent("keydown", true, true);
  }

  eventObj.keyCode = keyCode;
  eventObj.which = keyCode;

  el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);
}

function toggleFix(center, rotate) {
  data.fixedCamera = !data.fixedCamera;
  if (data.map) {
    if (data.fixedCamera && center) {
      data.map.setRotation(rotate);
      data.map.setCenter(center);
      data.map.setPitch(35);
      data.map.setZoom(18);
    }
    data.map.set('zoomEnable', !data.fixedCamera);
    data.map.set('pitchEnable', !data.fixedCamera);
    data.map.set('rotateEnable', !data.fixedCamera);
    data.map.set('dragEnable', !data.fixedCamera);
  }
}

if (AMap) {
  init()
} else {
  window.onload = init;
}