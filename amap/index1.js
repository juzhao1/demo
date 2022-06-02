const payload = {
  center: '[121.472644,31.231706]',
  bounds: '[[121.4151050118518,31.275300593376382],[121.46086100337588,31.28084888023686],[121.54053025920604,31.285009879061807],[121.56044757316357,31.239228696198534],[121.57013707725103,31.181854984696454],[121.52707261464013,31.15917342745354],[121.4479416645926,31.15593275724141],[121.40003244993797,31.181854984696454],[121.39088125163316,31.233215360077796]]',
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
  categories: [
      '宾馆酒店', '厂园区','公众住宅','基础设施','交通枢纽','景区','汽车服务','学校',
      '商贸综合体','商务楼宇','沿街商铺','医院','政府或大型企业单位办公楼','专业市场'
  ],
};
/* new script ------------------------------------------ */
const isQA = (toolMode) => (toolMode === 'QA' || toolMode === 'QA_RW' || toolMode === 'QA_RO');
let AMap;
class MapAnnotationApp extends React.Component {
  toolName = 'map-annotation';

  map = null;

  geo = null;

  points = [];

  drawPoints = [];

  // map center
  center = [];

  // annotation bounds
  bounds = [];

  isCreate = false;

  // tool is ready
  ready = false;

  // mouse in bounds
  enableCreate = false;

  categories = [];

  selectedOverlay = undefined;

  tip_label = null;

  polyEditor = null;

  /**
   * 测量相关
   */
  horizontalLine = [];
  horizontalData = {};
  verticalLine = [];
  horizontalMouse = [];
  verticalMouse = [];
  fixedCamera = false;
  startRanging = false;

  rulerLine = null;
  
  container = null;

  constructor() {
      super();
      this.state = {
          instances: {},
          selectedId: undefined,
          selectedCategory: '',
          loading: true,
      };
  }

  componentWillMount() {
      console.log('payload==>', payload);
      console.log('{{TOOL_MODE}}', '{{JOB_ID}}');
      const { instances, center, bounds, categories } = payload;
      // 加载标注结果/预标注数据
      if (instances) {
        const instanceMap = {};
        (typeof instances === 'string' ? JSON.parse(instances) : instances).forEach(async (i) => {
          instanceMap[i.id] = i;
        });
        this.setState({ instances: instanceMap });
      }
      if (center) {
        this.center = typeof center === 'string' ? JSON.parse(center) : center;
      }
      if (bounds) {
        this.bounds = typeof bounds === 'string' ? JSON.parse(bounds) : bounds;
      }
      if (categories) {
        this.categories = typeof categories === 'string' ? JSON.parse(categories) : categories;
      }
      
      this.setState({ selectedCategory: this.categories[0] })
  }

  componentDidMount() {
      AMap = window.AMap;
      this.initMap();
      this.container = document.getElementById('map-annotation-app_{{{RECORD_ID}}}');
  }
  
  handleScreenFull = () => {
      if (this.container) {
          this.container.requestFullscreen();
          // screenfull.toggle(this.container);
      }
  };

  initMap = () => {
      if (!AMap) {
        alert('地图加载失败！');
        this.setState({ loading: false });
        return;
      }
      this.map = AMap ? new AMap.Map('map-content_{{{RECORD_ID}}}', {
        viewMode: '3D',
        resizeEnable: true,
        rotateEnable: true,
        center: this.center,
        zoom: 16,
        zooms: [6, 20],
        expandZoomRange: true,
        features: ['bg', 'road', 'point'],
        layers: [
          // 高德默认标准图层
          new AMap.TileLayer(),
          // 楼块图层
          new AMap.Buildings({
              zooms: [16, 20],
              zIndex: 10,
              heightFactor: 1
          })
        ],
      }) : undefined;
      this.geo = AMap.Geocoder ? new AMap.Geocoder() : undefined;
  
      this.loadData();
      this.initKeyEvent();
  }

  initKeyEvent = () => {
      document.addEventListener('keydown', (e) => {
          e.stopPropagation();
          e.preventDefault();
        const key = e.code.toLocaleLowerCase();
        if (!this.startRanging) {
          if (key === 'space') {
            this.handleCreate();
          } else if (key === 'enter') {
            this.createComplete();
          } else if (key === 'backspace' || key === 'delete') {
            this.deleteInstance()
          } else if (key === 'keyo') {
            this.handleLabel();
          } else if (key === 'keyd') {
            this.handleAddress();
          } else if (key === 'keyh') {
              this.handleHeight();
          }
        }
        if (!this.isCreate) {
          if (key === 'keym') {
            this.toggleRanging();
          }
        }
      });
      this.map.on('mousedown', this.mapMouseDown, true);
      this.map.on('mousemove', this.mapMouseMove, true);
  }

  loadData = async () => {
      const remoteBackup = document.getElementById('map_{{{RECORD_ID}}}').value;
      const localBackup = window.localStorage.getItem(`${this.toolName}_{{JOB_ID}}_{{TASK_ID}}_{{RECORD_ID}}_{{WORKER_ID}}`);
      let instanceMap;
      if (localBackup || remoteBackup !== '') {
          instanceMap = {};
          const { bounds, center, instances } = JSON.parse(localBackup || remoteBackup);
          for (let i = 0; i < instances.length; i += 1) {
            const instance = instances[i];
            let address = instance.address;
            if (address === undefined) {
              const turfPolygon = turf.polygon([[...instance.lnglats, [...instance.lnglats[0]]]]);
              const centroid = turf.centerOfMass(turfPolygon);
              if (centroid) {
                const { geometry: { coordinates } } = centroid;
                address = await this.getAddress(coordinates);
              }
            }
            instanceMap[instance.id] = {
              ...instance,
              address,
            };
          }
          this.bounds = bounds;
          this.center = center;
      }
      this.setState({
        ...instanceMap && {
          instances: instanceMap
        },
        toolMode: isQA('{{TOOL_MODE}}') ? 'QA' : 'NOT_QA',
        loading: false,
      }, () => {
        if (instanceMap) {
            this.drawShapes();
        } else {
            this.initBounds();
        }
      });
  }

  clear = () => {
    this.map.clearMap();
    this.horizontalData = {};
    this.horizontalLine = [];
    this.verticalLine = [];
    this.horizontalMouse = [];
    this.verticalMouse = [];
  }

  drawShapes = () => {
      if (!AMap) return;
        const { instances: instanceMap, selectedId } = this.state; 
        const { overlayOptions } = payload
        const instances = Object.values(instanceMap);
        this.clear();
        this.initBounds();
        for (let i = 0; i < instances.length; i++) {
          const { id, lnglats, label, category } = instances[i];
          const shapePoints = lnglats.map((point) => new AMap.LngLat(point[0], point[1]));
          const polygon = new AMap.Polygon({
            path: shapePoints,
            ...overlayOptions,
            fillOpacity: 0.1,
          });
          polygon.id = id;
          polygon.category = category;
          polygon.on('click', () => {
            if (!this.isCreate) {
              this.setSelectedId(id, category);
            }
          });
          this.map.add(polygon);
  
          if (label) {
            const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
            const centroid = turf.centerOfMass(turfPolygon);
            if (centroid) {
              const { geometry: { coordinates } } = centroid;
              this.createLabel(`${category}-${label}`, coordinates, `label_${id}`);
            }
          }

          if (id === selectedId) {
            this.handleEditPoly(polygon);
            this.setSelectedOverlay(polygon);
          }
      }
  }

  handleEditPoly(polygon, edit = true) {
    if (this.polyEditor) {
      this.polyEditor.close();
    }
    if (edit) {
      this.polyEditor = new AMap.PolyEditor(this.map, polygon);
      this.polyEditor.open();
      this.polyEditor.on('addnode', this.polyonUpdate)
      this.polyEditor.on('adjust', this.polyonUpdate)
      this.polyEditor.on('removenode', this.polyonUpdate)
    }
  }

  polyonUpdate =(e) => {
      const { instances } = this.state; 
      const { target } = e;
      if (target) {
        const { id } = target;
        const points = target.getPath().map((p) => ([p.lng, p.lat]));
        const instance = instances[id] ? {...instances[id]} : undefined;
        if (instance) {
          instance.lnglats = points;
          this.setInstance(id, instance);
        }
      }
  }

  initBounds = () => {
    if (!AMap) return;
      const shapePoints = this.bounds.map((point) => new AMap.LngLat(point[0], point[1]));
      const boundaryPolygon = new AMap.Polygon({
        path: shapePoints,
        strokeWeight: 2,
        strokeColor: '#008a45',
        fillColor: '#8250df',
        strokeStyle: 'dashed',
        fillOpacity: 0.06,
      });
      this.map.add(boundaryPolygon);
      boundaryPolygon.on('mouseout', this.mouseOut);
      boundaryPolygon.on('mousemove', this.mouseMove);
      boundaryPolygon.on('mouseover', this.mouseOver);
  }

  mouseMove = () => {
    if (!this.enableCreate) {
      this.enableCreate = true;
    }
  }
  mouseOut = () => {
    this.enableCreate = false;
  }

  mouseOver = () => {
      this.enableCreate = true;
  }

  mapMouseDown = (e) => {
    console.log(this.map.getPitch())
    const { lnglat, originEvent } = e;
    const pixelPoint = { x: originEvent.clientX, y: originEvent.clientY };
    if (!AMap) return;
    if (this.isCreate) {
      if(this.enableCreate) {
        const currentPoint = [lnglat.lng, lnglat.lat];
        this.points.push(currentPoint);
        this.drawPoints = this.points.concat([[...currentPoint]]).map((p) => new AMap.LngLat(p[0], p[1]));
        if (this.points.length === 1) {
          this.selectedOverlay = new AMap.Polygon({
            path: this.drawPoints,
            ...payload.overlayOptions
          });
          this.map.add(this.selectedOverlay);
        } else {
          this.selectedOverlay.setPath(this.drawPoints);
        }
      }
    } else if (this.startRanging && this.verticalLine.length < 2) {
      const point = new AMap.LngLat(lnglat.lng, lnglat.lat);
      const marker = new AMap.Marker({
        size: [12, 12],
        position: point,
        offset: new AMap.Pixel(-6, -5),
        content: `<div class="ruler-icon"></div>`
      });
      this.map.add(marker);
      if (this.horizontalLine.length === 0) {
        this.horizontalLine.push(point);
        this.horizontalMouse.push(pixelPoint);
      } else if (this.horizontalLine.length === 1) {
        this.horizontalLine.push(point);
        this.horizontalMouse.push(pixelPoint);
        this.verticalLine.push(point);
        this.verticalMouse.push(pixelPoint);
        this.createLine(this.horizontalLine, this.horizontalMouse, true);
        this.createRulerLine();
      } else if (this.verticalLine.length === 1) {
        this.verticalLine.push(point);
        this.verticalMouse.push(pixelPoint);
        this.createLine(this.verticalLine, this.verticalMouse);
        this.createRulerLine();
        this.clearTip();
      }

      // else if (this.verticalLine.length === 0) {
      //   this.verticalLine.push(point);
      //   this.verticalMouse.push(pixelPoint);
      // }
    }
  }

  createLine(line, mouse, fix) {
    const [p1,p2] = line;
    const [m1, m2] = mouse;
    const dis = AMap.GeometryUtil.distance([p1.lng, p1.lat], [p2.lng, p2.lat]);
    const pixel = Math.floor(Math.sqrt((m1.x-m2.x)**2 + (m1.y-m2.y)**2));
    let height = '';
    if (fix) {
      this.horizontalData = {dis,pixel};
    } else {
      height = Math.floor((pixel/this.horizontalData.pixel)*this.horizontalData.dis);
      // height = Math.floor(height / Math.sin(this.map.getPitch()));
    }
    const polyline = new AMap.Polyline({
      path: [p1, p2],
      strokeColor: '#B2CEFE', // 线条颜色
    });
    this.map.add(polyline);
    const center = new AMap.LngLat((p1.lng + p2.lng)/2, (p1.lat + p2.lat)/2);
    const tip = new AMap.Text({
      text: `lnglat: ${Math.floor(dis)} 米, pixel: ${pixel}px ${height? ', height: ' + height +' 米' : ''}`,
      clickable: false,
      position: center
    });
    tip.setStyle({ transform: 'translate(-50%, 50%)', fontSize: '12px' });
    this.map.add(tip);
    if (fix) {
      // const rotate =  Math.atan((p2.lat - p1.lat)/(p2.lng - p1.lng));
      // const { geometry: { coordinates } } = turf.midpoint(turf.point([p1.lng, p1.lat]), turf.point([p2.lng, p2.lat]));
      // this.toggleFix(new AMap.LngLat(coordinates[0]-(Math.sin(rotate) * 0.002), coordinates[1]+(Math.cos(rotate) * 0.002)), (rotate + 0.05) * 180 / Math.PI);
      this.toggleFix();
    }
  }

  createRulerLine(p1,p2) {
    if (p1 && p2) {
      if (this.rulerLine) {
        this.rulerLine.setPath([p1, p2])
      } else {
        this.rulerLine = new AMap.Polyline({
          path: [p1, p2],
          strokeColor: '#B2CEFE', // 线条颜色
        });
        this.map.add(this.rulerLine);
      }
    } else if (this.rulerLine) {
      this.map.remove(this.rulerLine);
      this.rulerLine = null;
    }
  }

  mapMouseMove = (e) => {
    if (!AMap) return;
    if (this.isCreate) {
      const currentPoint = new AMap.LngLat(e.lnglat.lng, e.lnglat.lat);
      if (this.selectedOverlay && this.enableCreate) {
        const drawPoints = [...this.points.map((p) => new AMap.LngLat(p[0], p[1])), currentPoint];
        this.selectedOverlay.setPath(drawPoints);
      }
      this.showTip(
        currentPoint,
        this.enableCreate ?
          (this.points.length > 0 ? '单击绘制下一个点，回车完成绘制' : '单击确认起点') :
          '超出标注区域边界'
      )
    } else if (this.startRanging && this.verticalLine.length < 2) {
      const currentPoint = new AMap.LngLat(e.lnglat.lng, e.lnglat.lat);
      if (this.horizontalLine.length === 1) {
        this.createRulerLine(this.horizontalLine[0], currentPoint);
      } else if (this.verticalLine.length === 1) {
        this.createRulerLine(this.verticalLine[0], currentPoint);
      }

      this.showTip(
        currentPoint,
        this.horizontalLine.length < 2 ? '绘制建筑水平线' : '绘制建筑高度线'
      )
    }
  }

  showTip(point, tip) {
    if (this.tip_label) {
      this.map.add(this.tip_label)
      this.tip_label.setPosition(point);
      this.tip_label.setText(tip);
    } else {
      this.tip_label = new AMap.Text({
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
      this.map.add(this.tip_label)
    }
  }

  clearTip() {
    if (this.tip_label) {
      this.map.remove(this.tip_label);
      this.tip_label = null;
      this.map.setDefaultCursor('grab');
    }
  }

  setSelectedId = (id, c) => {
    this.setSelectedCategory(c);
    if (id !== this.state.selectedId) {
        this.setState({
            selectedId: id,
        }, () => {
            this.drawShapes();
        })
    }
  }

  setSelectedCategory = (c) => {
      if (c !== this.state.selectedCategory) {
          this.setState({
              selectedCategory: c,
          })
      }
  }

  setSelectedOverlay = (overlay) => {
    if (this.selectedOverlay) {
      this.handleEditPoly(this.selectedOverlay, false);
      this.selectedOverlay.setOptions({
        fillOpacity: 0.1
      })
      this.selectedOverlay = undefined;
    }
    if (overlay) {
      overlay.setOptions({
        fillOpacity: payload.overlayOptions.fillOpacity
      })
      this.handleEditPoly(overlay);
      this.selectedOverlay = overlay;
    }
    this.setSelectedId(overlay?.id, overlay?.category || this.state.selectedCategory);
  }

  createLabel = (label, point, className) => {
    const labelPoint = new AMap.LngLat(point[0], point[1])
    const tip = new AMap.Text({
      text: label,
      clickable: false,
      offset: new AMap.Pixel(50, -20),
      position: labelPoint
    });
    this.map.add(tip);
    let timer = setTimeout(() => {
      tip.De.content.classList.add('building_label', className);
      clearTimeout(timer);
    }, 100);
    tip.setStyle({ transform: 'translate(-50%, 50%)' })
  }

  overlayUpdate = async (e) => {
      const { instances } = this.state; 
      const { currentTarget } = e;
      const { id } = currentTarget;
      const points = currentTarget.getPath().slice(0, -1).map((p) => ([p.lng, p.lat]));
      const instance = instances[id] ? {...instances[id]} : undefined;
      if (instance) {
        instance.lnglats = points;
        this.setInstance(id, instance);
      }
  }

  setInstance = (id, instance) => {
      const instances = { ...this.state.instances };
      if (instance) {
        instances[id] = instance;
      } else {
        delete instances[id];
      }
      this.setState({ instances });
  }

  deleteInstance() {
      const { selectedId } = this.state;
      if (!this.isCreate && selectedId) {
        this.setInstance(selectedId);
        this.setSelectedOverlay();
        this.drawShapes();
      }
  }

  handleCreate = () => {
    if (!this.startRanging) {
      const { instances } = this.state;
      if (this.selectedOverlay && !instances[this.selectedOverlay.id]) {
        this.map.remove(this.selectedOverlay);
      }
      if (this.tip_label) {
        this.map.remove(this.tip_label);
      }
      this.setSelectedOverlay();
      this.initStatus();
    }
  }

  initStatus = () => {
    this.points = [];
    this.isCreate = !this.isCreate;
    this.map.setDefaultCursor(this.isCreate ? 'crosshair' : 'grab');
  }

  createComplete = async () => {
      const { isCreate, points, selectedOverlay } = this;
      const { selectedCategory } = this.state;
      if (isCreate) {
        if (points.length > 2 && selectedOverlay) {
          const turfPolygon = turf.polygon([[...points, [...points[0]]]]);
          const centroid = turf.centerOfMass(turfPolygon);
          let address = '';
          if (centroid) {
            const { geometry: { coordinates } } = centroid;
            address = await this.getAddress(coordinates)
          }
          const id = `${new Date().valueOf()}`;
          this.setInstance(id, { id, lnglats: [...points], category: selectedCategory, address });
          this.setSelectedId(id, selectedCategory);
          this.initStatus();
          this.handleLabel();
        } else {
          alert('请至少创建3个点');
        }
      }
  }

  handleLabel = () => {
      const { instances, selectedId } = this.state;
      const selectedInstance = instances[selectedId];
      if (selectedInstance) {
        const { id, label, lnglats, category } = selectedInstance;
        const input = prompt("建筑物名称：", label || '');
        if (input !== label && input !== null) {
          const newLabel = `${category}-${input}`;
          const labelDom = document.getElementsByClassName(`label_${id}`)[0];
          if (labelDom) {
            labelDom.innerHTML = newLabel;
            labelDom.style.display = !!newLabel ? 'inline' : 'none';
          } else if (newLabel) {
            const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
            const centroid = turf.centerOfMass(turfPolygon);
            if (centroid) {
              const { geometry: { coordinates } } = centroid;
              this.createLabel(newLabel, coordinates, `label_${id}`);
            }
          }
          this.setInstance(id, { ...selectedInstance, label: input })
        }
      }
  }
  
  handleHeight = () => {
    const { instances, selectedId } = this.state;
    const selectedInstance = instances[selectedId];
    if (selectedInstance) {
      const { id, label, height } = selectedInstance;
      const input = prompt(`${label} 高度：`, height || 0);
      if (input !== height && input !== null) {
        this.setInstance(id, { ...selectedInstance, height: input })
      }
    }
  }

  handleAddress = () => {
    const { instances, selectedId } = this.state;
      const selectedInstance = instances[selectedId];
      if (selectedInstance) {
        const { id, address } = selectedInstance;
        const input = prompt("建筑物地址：", address || '');
        if (input !== address && input !== null) {
          this.setInstance(id, { ...selectedInstance, address: input })
        }
      }
  }

  getAddress = (lnglat) => {
    return new Promise((resolve, reject) => {
      if (!this.geo) resolve('未知');
      this.geo.getAddress(lnglat, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          const { addressComponent: { province, city, district, street, streetNumber, building } } = result.regeocode;
          resolve(`${city || province}${district}${street}${streetNumber}${building}`);
        } else {
          resolve('未知');
        }
      })
    })
  }


  toggleRanging() {
    if (!this.isCreate) {
      this.startRanging = !this.startRanging;
      this.map.setDefaultCursor(this.startRanging ? 'pointer' : 'grab');
      if (!this.startRanging) {
        this.drawShapes();
        if (this.fixedCamera) this.toggleFix();
      }
    }
  }

  toggleFix(center, rotate) {
    this.fixedCamera = !this.fixedCamera;
    if (this.map) {
      // if (this.fixedCamera && center) {
      //   this.map.setRotation(rotate);
      //   this.map.setCenter(center);
      //   this.map.setPitch(60);
      //   this.map.setZoom(18);
      // }
      this.map.set('zoomEnable', !this.fixedCamera);
      this.map.set('pitchEnable', !this.fixedCamera);
      this.map.set('rotateEnable', !this.fixedCamera);
      this.map.set('dragEnable', !this.fixedCamera);
    }
  }


  saveData = (type) => {
    const { instances } = this.state;
    const data = {
      instances: Object.values(instances),
      center: this.center,
      bounds: this.bounds,
    };
    console.log('data==>', data)
    document.getElementById('map_{{{RECORD_ID}}}').value = JSON.stringify(data);
    window.localStorage.setItem(`${this.toolName}_{{JOB_ID}}_{{TASK_ID}}_{{RECORD_ID}}_{{WORKER_ID}}`, JSON.stringify(data));
    alert(type === 'save'?'保存成功！' : '提交成功！');
  };

  render() {
    const { instances, selectedId, selectedCategory } = this.state;
    const categoryInstanceMap = {};
    Object.values(instances).forEach((i) => {
        if (categoryInstanceMap[i.category]) {
            categoryInstanceMap[i.category].push(i);
        } else {
          categoryInstanceMap[i.category] = [i];
        }
    });
    return React.createElement(
      'div',
      { className: 'map-wrapper' },
      React.createElement(
        'div',
        { className: 'map-side' },
        this.categories.map((c, m) => React.createElement(
          'div',
          {
            key: `${c}-${m}`,
            className: 'side-category'
          },
          React.createElement(
              'div',
              {
                  className: `label ${c===selectedCategory?'selected':''}`,
                  onClick: () => { this.setSelectedId(undefined, c); }
              },
              `${c || ''} ${categoryInstanceMap[c]?.length || 0}`,
          ),
          c===selectedCategory && React.createElement(
              'div',
              {
                  className: 'instances',
              },
              categoryInstanceMap[c]?.map((v) => React.createElement(
                  'div',
                  {
                    key: v.id,
                    className: `side-instance ${v.id===selectedId?'selected':''}`,
                    onClick: () => { this.setSelectedId(v.id, v.category); }
                  },
                  `${v.label || '未命名'}`,
                  React.createElement('div', {}, v.address),
                  v.height && React.createElement('div', {}, `高：${v.height}`)
                )
              )
          ),
        ))
      ),
      React.createElement(
        'div',
        {
          id: 'map-content_{{{RECORD_ID}}}',
          className: 'map-content'
        },
      ),
      React.createElement(
        'div',
        { className: 'tool_box' },
        React.createElement(
            'div',
            {
              className: 'save-btn btn',
              onClick: () => { this.saveData('save'); }
            },
            '保存'
        ),
        React.createElement(
            'div',
            {
              className: 'screenfull-btn btn',
              onClick: this.handleScreenFull
            },
            '进入全屏(esc 退出)'
        ),
      ),
      React.createElement(
        'div',
        {
          className: 'map-tip',
        },
        'Space: 开始新建；Enter：新建完成；Delete/BackSpace：删除；o：编辑名称；d：编辑地址；m：进入/退出测量；h：编辑高度属性；'
      ),
      this.state.loading && React.createElement('div', {
        className: 'loading'
      }, '加载中...')
    );
  }
}


window.onload = () => {
  ReactDOM.render(React.createElement(MapAnnotationApp, { payload }), document.getElementById('map-annotation-app_{{{RECORD_ID}}}'));
}
