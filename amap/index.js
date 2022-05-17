


const data = {
  map: undefined,
  container: undefined,
  buildings: [{"label":"焦作和平街市场和平街市场第八排71号","position":{"lng":113.2399597168,"lat":35.2395210266}},{"label":"千年网景主题式网络会所97号电脑","position":{"lng":113.2400665283,"lat":35.2398376465}},{"label":"解放区棉麻家属院8号楼西南(车站街北)车站街建材市场31-33号","position":{"lng":113.2400894165,"lat":35.2374153137}},{"label":"服务楼包子馄饨馆炒面 到了打电话","position":{"lng":113.237121582,"lat":35.2390480042}},{"label":"和平街布业百瑞商业街理发店","position":{"lng":113.2390975952,"lat":35.2399101257}},{"label":"国控大药房(站前路店)","position":{"lng":113.2401199341,"lat":35.2402305603}},{"label":"金悦茶楼2楼666","position":{"lng":113.2376480103,"lat":35.2372703552}},{"label":"河南省焦作市解放区解放中路142号河南理工大学北校区东门","position":{"lng":113.23802948,"lat":35.2406005859}},{"label":"焦作和平街市场9排","position":{"lng":113.2397003174,"lat":35.2400169373}},{"label":"建业小区(和平街)和平街建业小区外7号楼4单元","position":{"lng":113.238494873,"lat":35.2402076721}},{"label":"和平中街3号院东院(北门)五号楼一单元三楼右手边","position":{"lng":113.2383422852,"lat":35.2395935059}},{"label":"迷彩刺青3号楼18号","position":{"lng":113.2371902466,"lat":35.2385978699}},{"label":"98K影咖酒吧2楼","position":{"lng":113.2391967773,"lat":35.2403945923}},{"label":"焦作和平街市场 (西门外边门面房 小香家)@#河南省焦作市解放区民主街道焦作和平街市场","position":{"lng":113.2393493652,"lat":35.2390823364}},{"label":"河南理工大学北校区1号楼","position":{"lng":113.2371673584,"lat":35.2388648987}},{"label":"和平中街3号院东院五号楼二单元","position":{"lng":113.238822937,"lat":35.2395133972}},{"label":"河南省焦作市解放区建设街369-2号党记老汤烩面(二店)党记老汤烩面路口","position":{"lng":113.2393035889,"lat":35.2387390137}},{"label":"建业小区(和平街)南门","position":{"lng":113.2378845215,"lat":35.2398834229}},{"label":"河南省焦作市解放区解放中路142号河南理工大学北校区河南理工大学北校区北门","position":{"lng":113.2373504639,"lat":35.2389221191}},{"label":"焦南街道平光西苑小区(东北门)河南省焦作市解放区友谊路56附近9号楼","position":{"lng":113.2381781955,"lat":35.239844921}},{"label":"和平街市场东区童装区50号","position":{"lng":113.2404174805,"lat":35.238986969}},{"label":"千年网景主题式网络会所30号","position":{"lng":113.2404403687,"lat":35.2399482727}},{"label":"维尔纳斯意大利手工艺蛋糕(焦作店)对面","position":{"lng":113.2372512817,"lat":35.2382698059}},{"label":"成都红菜馆门面房","position":{"lng":113.2371368408,"lat":35.239025116}},{"label":"有猫腻猫咪生活体验馆站点","position":{"lng":113.2386474609,"lat":35.2400512695}},{"label":"千年网景主题式网络会所137号","position":{"lng":113.2401657104,"lat":35.2400016785}},{"label":"河南省焦作市解放区民生街道和平街159号建业小区(和平街)建业小区(和平街)18号楼2单元5号","position":{"lng":113.2384338379,"lat":35.2403755188}},{"label":"建业小区(和平街)老6号楼1单元3楼","position":{"lng":113.2390441895,"lat":35.2406997681}},{"label":"百瑞小区青年路步行街67号麻辣香锅","position":{"lng":113.2373308686,"lat":35.2382026202}},{"label":"祥和小区综合楼一单元10楼21号","position":{"lng":113.2416229248,"lat":35.2382049561}},{"label":"焦作和平街市场吸引力538号","position":{"lng":113.2401351929,"lat":35.2387466431}},{"label":"九月工作室2楼 九月工作室","position":{"lng":113.2407913208,"lat":35.2401351929}},{"label":"河南理工大学北校区142号","position":{"lng":113.236946106,"lat":35.2389221191}},{"label":"车站街建材市场 42号新圣鑫厨卫","position":{"lng":113.2405166626,"lat":35.2380905151}},{"label":"千年网景主题式网络会所130","position":{"lng":113.2401809692,"lat":35.2399635315}},{"label":"焦作钱柜量贩式KTV钱柜北走两个坡道中间右手边直走看见岔口右拐第二个单元楼4楼","position":{"lng":113.2376174927,"lat":35.2383346558}},{"label":"和平街和平街西门对面","position":{"lng":113.2392959595,"lat":35.2383842468}},{"label":"百瑞小区四号楼一单元五楼","position":{"lng":113.2391967773,"lat":35.2377319336}},{"label":"河南理工大学北校区河南省焦作市解放区解放中路142号东门","position":{"lng":113.2369918823,"lat":35.2396697998}},{"label":"千年网景主题式网络会所103号","position":{"lng":113.2402420044,"lat":35.2398376465}},{"label":"和平街市场(公交站)和平街市场北门 千年网景18号机","position":{"lng":113.2402114868,"lat":35.2398796082}},{"label":"河南省焦作市解放区和平街与青年路交叉口西150米河南理工大学北校区(南门)河南理工大学北校区南门","position":{"lng":113.2373199463,"lat":35.2398033142}},{"label":"河南理工大学北校区第一教学楼","position":{"lng":113.2378540039,"lat":35.2399139404}},{"label":"民主街道和平中街3号院西院16号楼16号楼 一单元 三楼西户","position":{"lng":113.2378311157,"lat":35.2395782471}},{"label":"千年网景主题式网络会所7号","position":{"lng":113.2400436401,"lat":35.240070343}},{"label":"千年网景主题式网络会所100号机","position":{"lng":113.2400588989,"lat":35.239906311}},{"label":"和平街市场东区(北门)","position":{"lng":113.2407989502,"lat":35.2404594421}},{"label":"焦作弘泰医院","position":{"lng":113.2416992188,"lat":35.2377967834}},{"label":"和平中街3号院西院11号楼一单元三楼西户","position":{"lng":113.2380447388,"lat":35.2389755249}},{"label":"千年网景主题式网络会所158号机","position":{"lng":113.2400970459,"lat":35.2399635315}},{"label":"千年网景主题式网络会所167号机","position":{"lng":113.2401809692,"lat":35.239780426}},{"label":"和平中街3号院西院3号楼二单元四楼西户","position":{"lng":113.2375717163,"lat":35.239200592}},{"label":"朋友宾馆(朋友网络店)进大门左拐的两栋居民楼 最里面那个单元六楼","position":{"lng":113.2371063232,"lat":35.2375679016}},{"label":"千年网景主题式网络会所9号机","position":{"lng":113.2402191162,"lat":35.2398376465}},{"label":"河南省焦作市解放区和平街市场449号11排449号","position":{"lng":113.239906311,"lat":35.2388801575}},{"label":"你那么美美容养生会所","position":{"lng":113.2370376587,"lat":35.238494873}},{"label":"和平街市场和平街市场西门休闲宠吧","position":{"lng":113.237197876,"lat":35.2388000488}},{"label":"河南省焦作市百瑞小区(焦作市解放区建设街369号)1号楼2单位3楼","position":{"lng":113.2389602661,"lat":35.2385597229}},{"label":"河南省焦作市解放区和平街建业小区17号楼1单元","position":{"lng":113.2382507324,"lat":35.2403373718}},{"label":"解放区建业幼儿园河南省焦作市解放区和平街与青年路商业步行街交叉口东北100米8号楼一单元三楼","position":{"lng":113.2378387451,"lat":35.2402038574}},{"label":"千年网景主题式网络会所89","position":{"lng":113.2402572632,"lat":35.2398071289}},{"label":"外经贸局住宅楼101","position":{"lng":113.2394943237,"lat":35.2380485535}},{"label":"百瑞小区1号楼一单元四楼五号","position":{"lng":113.2373199463,"lat":35.2374725342}},{"label":"百瑞小区1号楼","position":{"lng":113.2392196655,"lat":35.238155365}},{"label":"焦作中旅银行(和平街支行)和平街232号","position":{"lng":113.2368469238,"lat":35.2395744324}},{"label":"和平中街3号院西院建设街和平中街3号院东院","position":{"lng":113.2383346558,"lat":35.2393379211}},{"label":"建业小区(东1门)一号楼 五楼 北户","position":{"lng":113.2389984131,"lat":35.2407264709}},{"label":"焦作和平街市场 (西大门)@#河南省焦作市解放区民主街道焦作和平街市场","position":{"lng":113.2395706177,"lat":35.2387199402}},{"label":"车站街建材市场北门","position":{"lng":113.239440918,"lat":35.2378883362}},{"label":"和平中街三号院东院-5号楼 (五号楼二单元四楼)@#河南省焦作市解放区民主街道十七中家属院","position":{"lng":113.2388916016,"lat":35.239616394}},{"label":"千年网景主题式网络会所6号机器","position":{"lng":113.2401733398,"lat":35.240020752}},{"label":"服务楼包子馄饨馆","position":{"lng":113.237159729,"lat":35.2388687134}},{"label":"百瑞小区建设街百瑞小区2号楼2单元6号","position":{"lng":113.2393740933,"lat":35.2382393468}},{"label":"河南理工大学北校区142号南操场","position":{"lng":113.2370758057,"lat":35.2398529053}},{"label":"千年网景72号110号机","position":{"lng":113.2400741577,"lat":35.2399024963}},{"label":"建业小区-西区建设街与和平街交汇处西北侧 建业小区 十八栋A座 西边第一个单元 六楼","position":{"lng":113.23802948,"lat":35.2405509949}},{"label":"学苑社区和平中街3号院(西院)13# 252号","position":{"lng":113.2378082275,"lat":35.2395210266}},{"label":"祥和小区(车站街) (1号楼20层80号)@#河南省焦作市解放区民主街道祥和小区-2号楼","position":{"lng":113.2417831421,"lat":35.2390708923}},{"label":"蓝十字(青年路店) (蓝十字大药房)@#河南省焦作市解放区民主街道万方科技学院7号楼学生公寓","position":{"lng":113.2372436523,"lat":35.2389335632}},{"label":"建业小区(和平街)六号楼","position":{"lng":113.2378921509,"lat":35.2405204773}},{"label":"建业小区-28号楼(3单元4楼东户)","position":{"lng":113.2406463623,"lat":35.2405433655}},{"label":"盐业局家属院办公楼","position":{"lng":113.2370986938,"lat":35.2399978638}},{"label":"民生街道和平街韩国炸鸡旁边福祥宾馆308","position":{"lng":113.2393951416,"lat":35.2397918701}},{"label":"千年网景主题式网络会所70号机","position":{"lng":113.2399673462,"lat":35.23985672}},{"label":"河南省焦作市解放区民生街道和平街建业小区(和平街)和平街建业小区(和平街)和平街建业小区29号楼二单元六楼西户","position":{"lng":113.2411270142,"lat":35.2399177551}},{"label":"祥和小区(车站街)1号楼6楼","position":{"lng":113.2416152954,"lat":35.239276886}},{"label":"河南理工大学北校区-8号学生公寓楼八号学生公寓楼下","position":{"lng":113.237449646,"lat":35.2397613525}},{"label":"钱柜KTV(和平街店)焦作钱柜ktv","position":{"lng":113.2370223999,"lat":35.2378768921}},{"label":"焦作朋友宾馆朋友宾馆门口往左拐有个胡同 走到头上三楼","position":{"lng":113.2373123169,"lat":35.2374572754}},{"label":"千年网景主题式网络会所48号机","position":{"lng":113.2399673462,"lat":35.2397384644}},{"label":"不动产院2单元3层4号","position":{"lng":113.2411727905,"lat":35.2375183105}},{"label":"棉花糖童品0","position":{"lng":113.2393112183,"lat":35.2390174866}},{"label":"和平中街3号院东院9号楼二单元5楼东户","position":{"lng":113.2381286621,"lat":35.2397994995}},{"label":"再生资源住宅楼4号楼河南省焦作市解放区再生资源住宅楼4号楼4单元","position":{"lng":113.241317749,"lat":35.2374458313}},{"label":"和平街和平街市场服装区565","position":{"lng":113.2401123047,"lat":35.2387161255}},{"label":"祥和小区(车站街)3号楼18楼69号","position":{"lng":113.2417449951,"lat":35.2386550903}}],
  positions: {default: { visible: true, list: [] }},
  markers: {},
  default: '#666666',
  selectedColor: '#f5871f',
  polygon: undefined,
  tip_label: undefined,
  points: [],
  drawPoints: [],
  isCreatePolyon: false,
  clusterId: undefined,
  colorContainer: undefined,
  showLabel: true,
  hoverId: undefined
}

const randomColor = () => `#${Math.random().toString(16).substr(2, 6)}`;
let colorPicker;

function getCenter() {
  data.positions.default = {
    visible: true,
    list: data.buildings.map(({ label, position }) => ({
      id: uuidv4(),
      label,
      lnglat: [position.lng, position.lat]
    }))
  }
  const lnglats = data.positions.default.list.map(({ lnglat }) => lnglat);
  const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
  const centroid = turf.centerOfMass(turfPolygon);
  if (centroid) {
    const { geometry: { coordinates } } = centroid;
    return coordinates;
  }
  return undefined
}

function init () {
  const center = getCenter();
  data.map = AMap ? new AMap.Map('map-toolName', {
    resizeEnable: true,
    center: center,
    zoom: 16,
    expandZoomRange: true
  }) : undefined;
  data.container = document.getElementById('map-toolName');
  data.colorContainer = document.getElementById('picker_layer');
  if(data.map) {
    data.map.on('mousedown', mapMousedown);
    data.map.on('mousemove', mapMousemove);
    data.map.on('keydown', mapKeydown);
    window.addEventListener('keydown', mapKeydown);
    document.getElementsByClassName('color_sure')[0].onclick = function () {
      if (data.selectClusterColor) {
        finishPolyonColorPicker();
      }
    };
    drawList();
  }
  initColorPicker();
}

function initColorPicker() {
  colorPicker = AColorPicker.from('.picker');
  colorPicker.on('change', (picker, color) => {
    colorPicker.color = color;
  });
  data.colorContainer.classList.toggle('hide');
}

function drawList() {
  clearList();
  Object.keys(data.positions).forEach((key) => {
    data.markers[key] = [];
    const { visible = true, list = [], color } = data.positions[key];
    list.forEach(({ id, label, lnglat, isCreate }) => {
      if ((!visible && isCreate) || visible) {
        const marker = new AMap.Marker({
          id,
          groupId: key,
          map: data.map,
          size: [14, 14],
          isCreate,
          position: new AMap.LngLat(lnglat[0], lnglat[1]),
          label: {
            content: label,
            direction: 'center',
          },
          offset: new AMap.Pixel(-7, -7),
          content: `<div class="amap-icon ${data.clusterId === id ? 'selected' : ''} ${isCreate ? 'cluster' : ''}" style="background-color: ${color || data.default}"></div>`
        });
        marker.on('rightclick', clusterMark);
        marker.on('mouseout', onMarkMouseout);
        marker.on('mouseover', onMarkMouseover);
        data.markers[key].push(marker);
      }
    })
  })
}

function clusterMark(e) {
  const { id, groupId, isCreate } = e.target.w;
  if (data.clusterId && !data.isCreatePolyon && !isCreate) {
    const defaults = [...data.positions.default.list];
    const { list, color } = data.positions[data.clusterId];
    const clusters = [...list];
    if (groupId === 'default') {
      const index = defaults.findIndex((p) => p.id === id);
      if (index >= 0) {
        const move = defaults.splice(index, 1);
        clusters.push({...move[0]});
        e.target.w.groupId = data.clusterId;
        e.target.setContent(`<div class="amap-icon" style="background-color: ${color}"></div>`);
      }
    } else if (groupId === data.clusterId) {
      const index = clusters.findIndex((p) => p.id === id);
      if (index >= 0) {
        const move = clusters.splice(index, 1);
        defaults.push({...move[0]});
        e.target.w.groupId = 'default';
        e.target.setContent(`<div class="amap-icon" style="background-color: ${data.default}"></div>`);
      }
    }
    data.positions.default.list = defaults;
    data.positions[data.clusterId].list = clusters;
  } else if (isCreate) {
    data.clusterId = groupId;
  }
}

function onMarkMouseover({ lnglat, target }) {
  if (!data.showLabel && !data.isCreatePolyon) {
    showTip(new AMap.LngLat(lnglat.lng, lnglat.lat), target.getLabel().content);
    data.hoverId = target.w.id;
  }
}

function onMarkMouseout({target}) {
  if (!data.showLabel && !data.isCreatePolyon && data.tip_label ) {
    data.map.remove(data.tip_label);
    data.tip_label = undefined;
  }
}

function clearList() {
  Object.keys(data.positions).forEach((key) => {
    if (data.markers[key]?.length) data.map.remove(data.markers[key]);
  })
}

function mapMousemove(e) {
  const { lnglat } = e;
  if (data.isCreatePolyon) {
    drawPolyon(lnglat)
  }
}

function mapMousedown(e) {
  const { originEvent, lnglat } = e;
  if (originEvent.button === 0) { // left click
    if (data.isCreatePolyon) {
      addPolyonPoint(lnglat);
    }
  } else if (originEvent.button === 2) { // right click
    // console.log('right click')
  }
}

function mapKeydown(e) {
  if (!data.colorContainer.classList.contains('hide')) return;
  const key = e.code.toLocaleLowerCase();
  switch (key) {
    case 'space':
      handleCreatePolyon();
      break;
    case 'keyl':
      handleVisibleLabel();
      break;
    case 'keyv':
      handleVisibleGroup();
      break;
    case 'keyo':
      handleEditLabel();
      break;
    case 'enter':
      handleFinish();
      break;
    case 'backspace':
    case 'delete':
      deleteInstance();
      break;
    default:
      break;
  }
}

function handleCreateInstance() {

}

function handleCreatePolyon() {
  const action = !data.polygon;
  clearPolyon();
  initPolyonStatus(action);
}

function drawPolyon(lnglat) {
  if (!data.clusterId || !data.isCreatePolyon) return;
  const point = new AMap.LngLat(lnglat.lng, lnglat.lat);
  data.drawPoints = [...data.points, point];
  if (data.polygon) {
    data.polygon.setPath(data.drawPoints)
  } else {
    data.polygon = new AMap.Polygon({
      path: data.drawPoints,
      fillOpacity: 0.1,
      fillColor: '#1791fc',
      borderWeight: 0.5, // 线条宽度，默认为 1
      strokeColor: '#C8E49E', // 线条颜色
    });
    data.map.add(data.polygon);

    data.polygon.on('click', handlePolyonClick);
  }

  showTip(point, data.points.length > 0 ? '单击绘制下一个点，回车完成绘制' : '单击确认起点')
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

function handlePolyonClick({ lnglat }) {
  if (!data.isCreatePolyon) {
    const label = prompt("标签名称：", '') || '未知';
    const { color } = data.positions[data.clusterId];
    const marker = new AMap.Marker({
      id: data.clusterId,
      groupId: data.clusterId,
      map: data.map,
      size: [14, 14],
      isCreate: true,
      position: new AMap.LngLat(lnglat.lng, lnglat.lat),
      label: {
        content: label,
        direction: 'center',
      },
      offset: new AMap.Pixel(-7, -7),
      content: `<div class="amap-icon" style="background-color: ${color || data.default}"></div>`
    });
    marker.on('rightclick', clusterMark);
    data.positions[data.clusterId].list.unshift({
      id: data.clusterId,
      label,
      lnglat: [lnglat.lng, lnglat.lat],
      isCreate: true,
    })
    data.markers[data.clusterId].push(marker);
    clearPolyon(false);
  }
}

function addPolyonPoint(lnglat) {
  data.points = [...data.points,new AMap.LngLat(lnglat.lng, lnglat.lat)];
}

function initPolyonStatus(action = true) {
  if (action) {
    data.isCreatePolyon = !data.isCreatePolyon;
    if (data.isCreatePolyon) {
      data.clusterId = uuidv4();
    }
    data.map.setDefaultCursor(data.isCreatePolyon ? 'crosshair' : 'grab');
  }
}

function finishPolyon() {
  data.points = [...data.drawPoints];
  data.drawPoints = [];
  if (data.points.length < 3) {
    alert('请至少创建3个点');
    data.points = [];
    data.clusterId = undefined;
    if (data.polygon) {
      data.polygon.off('click', handlePolyonClick);
      data.map.remove(data.polygon);
    }
  } else {
    showColorPicker('selectClusterColor');
  }
  initPolyonStatus();
  data.map.remove(data.tip_label);
}

function showColorPicker(type) {
  data[type] = data[type]===undefined? !data[type] : true;
  data.colorContainer.classList.toggle('hide');
  colorPicker.color = randomColor();
}

function finishPolyonColorPicker() {
  const color = colorPicker.color;
  // data.polyEditor = new AMap.PolyEditor(data.map, data.polygon);
  // data.polyEditor.open();
  const contains = [];
  const rests = [];

  // const poly = turf.polygon([[...data.points.map(p => ([p.lng, p.lat])), [data.points[0].lng, data.points[0].lat]]]);
  data.positions.default.list.forEach((p) => {
    // const point = turf.point(p.lnglat);
    // if (turf.booleanPointInPolygon(point, poly)) {
    //   p.groupId = data.clusterId;
    //   contains.push(p);
    // } else {
    //   rests.push(p);
    // }
    if (data.polygon.contains(new AMap.LngLat(p.lnglat[0], p.lnglat[1]))) {
      p.groupId = data.clusterId;
      contains.push(p);
    } else {
      rests.push(p);
    }
  })
  data.positions[data.clusterId] = {
    visible: true,
    list: contains,
    color,
  }
  data.positions.default.list = rests;
  showColorPicker('selectClusterColor');
  drawList();
}

function clearPolyon(destory = true) {
  if (data.polygon) {
    if (destory) {
      data.clusterId = undefined;
      data.positions.default.list = [...(data.positions[data.clusterId]?.list || []).map((p) => ({...p, groupId: 'default'})), ...data.positions.default.list];
      delete data.positions[data.clusterId];
    }
    data.map.remove(data.polygon);
    data.polygon = undefined;
    data.drawPoints = [];
    data.points = [];
    drawList();
  }
}

function handleFinish() {
  if (data.isCreatePolyon) {
    finishPolyon();
  }
}

function deleteInstance() {

}

function handleEditLabel() {

}

function handleVisibleLabel() {
  data.showLabel = !data.showLabel;
  data.container.classList.toggle('no_label');
}

function handleVisibleGroup() {
  if (data.clusterId) {
    data.positions[data.clusterId].visible = !data.positions[data.clusterId].visible;
    drawList();
  }
}









if (AMap) {
  init()
} else {
  window.onload = init;
}
