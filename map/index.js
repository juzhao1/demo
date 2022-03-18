const payload = {
  center: [121.472644, 31.231706]
}

const params = {
  isCreate: false,
  points: [],
  drawPoints: [],
  boundary: [
    [121.4151050118518, 31.275300593376382],
    [121.46086100337588, 31.28084888023686],
    [121.54053025920604, 31.285009879061807],
    [121.56044757316357, 31.239228696198534],
    [121.57013707725103, 31.181854984696454],
    [121.52707261464013, 31.15917342745354],
    [121.4479416645926, 31.15593275724141],
    [121.40003244993797, 31.181854984696454],
    [121.39088125163316, 31.233215360077796],
  ],
  labelOptions: {
    background: "#FFFBCC",
    border: "1px solid #E1E1E1",
    borderRadius: "2px",
    color: "#703A04",
    fontSize: "12px",
    letterSpacing: "0",
    padding: "5px",
  },
  overlayOptions: {
    fillColor: "#5E87DB",
    fillOpacity: 0.2,
    strokeColor: "#5E87DB",
    strokeOpacity: 1,
    strokeWeight: 2,
  },
  instances: {},
  ready: false,
  isResize: false,
  enableCreate: false,
}

let selectedId;
let tip_label;
let selectedOverlay;

window.onload = function () {
  let map = new BMapGL.Map("map-toolName");
  window.map = map;
  // 创建地图实例 
  const point = new BMapGL.Point(payload.center[0], payload.center[1]);
  // 创建点坐标 
  map.centerAndZoom(point, 15);
  // 初始化地图，设置中心点坐标和地图级别
  map.setMapStyleV2({     
    styleId: '410d6cafd8e5592b7d3886ae848cfab0'
  });
  map.enableScrollWheelZoom();
  map.disableDoubleClickZoom();

  function drawShapes() {
    const instances = Object.values(params.instances);
    map.clearOverlays();
    initBoundary();
    for (let i = 0; i < instances.length; i++) {
      const { id, lnglats, label } = instances[i];
      const shapePoints = lnglats.map((point) => new BMapGL.Point(point[0], point[1]));
      const polygon = new BMapGL.Polygon(shapePoints, {...params.overlayOptions, fillOpacity: 0.1});
      polygon.id = id;
      polygon.addEventListener('click', (e) => {
        if (!params.isCreate) {
          setSelectedId(e.target.id);
        }
      })
      map.addOverlay(polygon);
      if (label) {
        const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
        const centroid = turf.centerOfMass(turfPolygon);
        if (centroid) {
          const { geometry: { coordinates } } = centroid;
          createLabel(label, coordinates, `label_${id}`);
        }
      }

      if (id === selectedId) {
        polygon.enableEditing();
        setSelectedOverlay(polygon);
      }
    }
  }

  function handleCreate() {
    if (selectedOverlay && !params.instances[selectedOverlay.id]) {
      map.removeOverlay(selectedOverlay);
    }
    setSelectedOverlay();
    initStatus();
  }

  function initStatus() {
    params.points = [];
    params.isCreate = !params.isCreate;
    map.maskLayer.style.cursor = params.isCreate ? 'crosshair' : '';
  }

  function createComplete() {
    if (params.isCreate) {
      if (params.points.length > 2 && selectedOverlay) {
        const id = uuidv4();
        setInstance(id, { id, lnglats: [...params.points] });
        setSelectedId(id);
        initStatus();
        handleLabel();
      } else {
        alert('请至少创建3个点');
      }
    }
  }

  function createLabel(label, point, className) {
    const labelPoint = new BMapGL.Point(point[0], point[1])
    const tip = new BMapGL.Label(label, {
        position: labelPoint,
        offset: new BMapGL.Size(-5, -10)
    });
    map.addOverlay(tip);
    const { clientWidth, clientHeight } = tip.domElement;
    tip.domElement.classList.add('building_label', className);
    tip.setOffset({ width: -clientWidth/2, height: -clientHeight/2 })
  }

  function overlayUpdate(e) {
    const { currentTarget } = e;
    const { id } = currentTarget;
    const points = currentTarget.getPath().slice(0, -1).map((p) => ([p.lng, p.lat]));
    const instance = params.instances[id] ? {...params.instances[id]} : undefined;
    if (instance) {
      instance.lnglats = points;
      setInstance(id, instance);
    }
  }

  function setInstance(id, instance) {
    if (instance) {
      params.instances[id] = instance;
    } else {
      delete params.instances[id];
    }
    initList();
  }

  function initList() {
    const instances = Object.values(params.instances);
    localStorage.setItem('map_instances', JSON.stringify(instances));
    let html = '';
    instances.forEach(({ id, label }) => {
      html += `<div class="side-instance ${id===selectedId?'selected':''}" id=${id}>${label || '未命名'}</div>`;
    });
    document.getElementById('side-toolName').innerHTML = html;
  }

  function deleteInstance() {
    if (!params.isCreate && selectedId) {
      setInstance(selectedId);
      setSelectedOverlay();
      drawShapes();
    }
  }

  function setSelectedId(id) {
    if (id !== selectedId) {
      selectedId = id;
      drawShapes();
      initList();
    }
  }

  function setSelectedOverlay(overlay) {
    if (selectedOverlay) {
      selectedOverlay.removeEventListener('lineupdate', overlayUpdate);
      selectedOverlay.disableEditing();
      selectedOverlay.setFillOpacity(0.1);
      selectedOverlay = undefined;
    }
    if (overlay) {
      selectedOverlay = overlay;
      selectedOverlay.setFillOpacity(params.overlayOptions.fillOpacity);
      selectedOverlay.addEventListener('lineupdate', overlayUpdate);
    }
    setSelectedId(overlay ? overlay.id : undefined);
  }

  function handleClickSide(e) {
    const { target } = e;
    if (target.className.indexOf('side-instance')===0) {
      setSelectedId(target.id);
    }
  }

  function handleLabel() {
    const selectedInstance = params.instances[selectedId];
    if (selectedInstance) {
      const { id, label, lnglats } = selectedInstance;
      const input = prompt("建筑物名称：", label || '');
      if (input !== label && input !== null) {
        const labelDom = document.getElementsByClassName(`label_${id}`)[0];
        if (labelDom) {
          labelDom.innerHTML = input;
          labelDom.style.display = !!input ? 'inline' : 'none';
        } else if (input) {
          const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
          const centroid = turf.centerOfMass(turfPolygon);
          if (centroid) {
            const { geometry: { coordinates } } = centroid;
            createLabel(input, coordinates, `label_${id}`);
          }
        }
        setInstance(id, { ...selectedInstance, label: input })
      }
    }
  }

  function mouseDown(e) {
    if (params.isCreate && params.enableCreate) {
      const points = params.points;
      const currentPoint = [e.latlng.lng, e.latlng.lat];
      points.push(currentPoint);
      params.drawPoints = points.concat([[...currentPoint]]).map((p) => new BMapGL.Point(p[0], p[1]));
      if (points.length === 1) {
        selectedOverlay = new BMapGL.Polygon(params.drawPoints, params.overlayOptions);
        map.addOverlay(selectedOverlay);
      } else {
        selectedOverlay.setPath(params.drawPoints);
      }
    }
  }

  function mouseMove(e) {
    if (params.isCreate) {
      const currentPoint = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
      if (selectedOverlay && params.enableCreate) {
        selectedOverlay.setPositionAt(params.drawPoints.length - 1, currentPoint);
      }
      if (tip_label) {
        map.removeOverlay(tip_label);
      }
      const label = params.enableCreate ?
        (params.points.length > 0 ? '单击绘制下一个点，回车完成绘制' : '单击确认起点') :
        '超出标注区域边界';
      tip_label = new BMapGL.Label(label, {
          position: currentPoint, // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(10, 10) // 设置文本偏移量
      });
      tip_label.setStyle(params.labelOptions);
      map.addOverlay(tip_label);
    }
  }

  function mouseOut() {
    params.enableCreate = false;
  }

  function mouseOver() {
    params.enableCreate = true;
  }


  function initBoundary() {
    const shapePoints = params.boundary.map((point) => new BMapGL.Point(point[0], point[1]));
    const boundaryPolygon = new BMapGL.Polygon(shapePoints, {
      strokeWeight: 2,
      strokeColor: '#008a45',
      fillColor: '#008a45',
      strokeStyle: 'dashed',
      fillOpacity: 0.05,
    });
    map.addOverlay(boundaryPolygon);
    boundaryPolygon.addEventListener('mouseout', mouseOut, true);
    boundaryPolygon.addEventListener('mouseover', mouseOver, true);
  }

  function initKeyEvent() {
    document.addEventListener('keydown', (e) => {
      const key = e.code.toLocaleLowerCase();
      if(key === 'space') {
        handleCreate();
      } else if (key === 'enter') {
        createComplete();
      } else if (key === 'backspace' || key === 'delete') {
        deleteInstance()
      } else if (key === 'keyo') {
        handleLabel();
      }
    });
    map.addEventListener('mousedown', mouseDown, true);
    map.addEventListener('mousemove', mouseMove, true);
  }

  map.addEventListener('tilesloaded', function () {
    if (params.ready === false) {
      let saveInstances = localStorage.getItem('map_instances');
      if (saveInstances) {
        const instances = {};
        JSON.parse(saveInstances).forEach((i) => {
          instances[i.id] = i;
        })
        params.instances = instances;
        drawShapes();
        initList();
      } else {
        initBoundary();
      }
      params.ready = true;
      initKeyEvent();
    }
  });
  document.getElementById('side-toolName').addEventListener('click', handleClickSide, true);
}
