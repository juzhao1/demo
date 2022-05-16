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
  ...flowData,
};

console.log(flowData)

/* new script ------------------------------------------ */
const loadReact = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/react/16.14.0/react.production.min.js';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadReact'); };
});

const loadReactDom = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/react/16.14.0/react-dom.production.min.js';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadReactDom'); };
});

const loadScreenFull = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/screenfull.js/1.0.0/screenfull.js';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadScreenFull'); };
});


const loadBmap = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://api.map.baidu.com/api?v=1.0&type=webgl&ak=mDkRItGEfLtytLT5FlNSgKzlHyBuzm1K';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadBmap'); };
});

const loadMap = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=mDkRItGEfLtytLT5FlNSgKzlHyBuzm1K&services=';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadMap'); };
});

const loadTurf = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/turf.min.js';
  document.head.appendChild(script);
  script.onload = () => { resolve('loadTurf'); };
});

// const loadAntd = new Promise((resolve, reject) => {
//   const script = document.createElement('script');
//   script.src = 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/antd/3.19.3/antd.min.js';
//   document.head.appendChild(script);
//   script.onload = () => { resolve('loadAntd'); };
// });

// const loadAntdStyle = new Promise((resolve, reject) => {
//   const link = document.createElement('link');
//   link.setAttribute('rel', 'stylesheet');
//   link.setAttribute('href', 'https://projecteng.oss-cn-shanghai.aliyuncs.com/a9_js/antd/3.19.3/antd.css');
//   document.head.appendChild(link);
//   link.onload = () => { resolve('loadAntdStyle'); };
// });

const loadWindow = new Promise((resolve, reject) => {
  resolve('loadWindow');
});

let BMapGL;
Promise.all([loadReact, loadReactDom, loadBmap, loadMap, loadTurf, loadScreenFull, loadWindow]).then((result) => {
  const isQA = (toolMode) => (toolMode === 'QA' || toolMode === 'QA_RW' || toolMode === 'QA_RO');

  class MapAnnotationApp extends React.Component {
    toolName = 'map-annotation';

    map = null;

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

    constructor() {
      super();
      this.state = {
        instances: {},
        selectedId: undefined,
        selectedCategory: '',
      };
    }

    componentWillMount() {
      console.log('payload==>', payload);
      console.log('{{TOOL_MODE}}', '{{JOB_ID}}');
      const { instances, center, bounds, categories } = payload;
      // 加载标注结果/预标注数据
      if (instances) {
        const instanceMap = {};
        (typeof instances === 'string' ? JSON.parse(instances) : instances).forEach(i => {
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
      BMapGL = window.BMapGL;
      this.initMap();
    }

    initMap = () => {
      if (!BMapGL) return;
      this.map = new BMapGL.Map("map-content_{{{RECORD_ID}}}");
      // 创建地图实例 
      const point = new BMapGL.Point(this.center[0], this.center[1]);
      // 创建点坐标 
      this.map.centerAndZoom(point, 15);
      // 初始化地图，设置中心点坐标和地图级别
    //   this.map.setMapStyleV2({     
    //       styleId: '410d6cafd8e5592b7d3886ae848cfab0'
    //   });
      this.map.enableScrollWheelZoom();
      this.map.disableDoubleClickZoom();
      this.map.addEventListener('tilesloaded', () => {
          if (this.ready === false) {
            this.ready = true;
            this.loadData();
            this.initKeyEvent();
          }
      });
    }
    
    initKeyEvent = () => {
        document.addEventListener('keydown', (e) => {
            e.stopPropagation();
            e.preventDefault();
          const key = e.code.toLocaleLowerCase();
          if(key === 'space') {
            this.handleCreate();
          } else if (key === 'enter') {
            this.createComplete();
          } else if (key === 'backspace' || key === 'delete') {
            this.deleteInstance()
          } else if (key === 'keyo') {
            this.handleLabel();
          }
          
        });
        this.map.addEventListener('mousedown', this.mapMouseDown, true);
        this.map.addEventListener('mousemove', this.mapMouseMove, true);
    }
    
    loadData = () => {
        const remoteBackup = document.getElementById('map_{{{RECORD_ID}}}').value;
        const localBackup = window.localStorage.getItem(`${this.toolName}_{{JOB_ID}}_{{TASK_ID}}_{{RECORD_ID}}_{{WORKER_ID}}`);
        let instanceMap;
        if (localBackup || remoteBackup !== '') {
            instanceMap = {};
            const { bounds, center, instances } = JSON.parse(localBackup || remoteBackup);
            instances.forEach(i => {
                instanceMap[i.id] = i;
            });
            this.bounds = bounds;
            this.center = center;
        }
        this.setState({
            ...instanceMap && {
              instances: instanceMap
            },
            toolMode: isQA('{{TOOL_MODE}}') ? 'QA' : 'NOT_QA',
        }, () => {
            if (instanceMap) {
                this.drawShapes();
            } else {
                this.initBounds();
            }
        });
    }
    
    drawShapes = () => {
      if (!BMapGL) return;
        const { instances: instanceMap, selectedId } = this.state; 
        const { overlayOptions } = payload
        const instances = Object.values(instanceMap);
        this.map.clearOverlays();
        this.initBounds();
        for (let i = 0; i < instances.length; i++) {
          const { id, lnglats, label, category } = instances[i];
          const shapePoints = lnglats.map((point) => new BMapGL.Point(point[0], point[1]));
          const polygon = new BMapGL.Polygon(shapePoints, {...overlayOptions, fillOpacity: 0.1});
          polygon.id = id;
          polygon.category = category;
          polygon.addEventListener('click', (e) => {
            if (!this.isCreate) {
              this.setSelectedId(id, category);
            }
          })
          this.map.addOverlay(polygon);
          if (label) {
            const turfPolygon = turf.polygon([[...lnglats, [...lnglats[0]]]]);
            const centroid = turf.centerOfMass(turfPolygon);
            if (centroid) {
              const { geometry: { coordinates } } = centroid;
              this.createLabel(`${category}-${label}`, coordinates, `label_${id}`);
            }
          }

          if (id === selectedId) {
            polygon.enableEditing();
            this.setSelectedOverlay(polygon);
          }
        }
    }
    
    initBounds = () => {
      if (!BMapGL) return;
        const shapePoints = this.bounds.map((point) => new BMapGL.Point(point[0], point[1]));
        const boundaryPolygon = new BMapGL.Polygon(shapePoints, {
          strokeWeight: 2,
          strokeColor: '#008a45',
          fillColor: '#008a45',
          strokeStyle: 'dashed',
          fillOpacity: 0.05,
        });
        this.map.addOverlay(boundaryPolygon);
        console.log('initBounds==>');
        boundaryPolygon.addEventListener('mouseout', this.mouseOut, true);
        boundaryPolygon.addEventListener('mouseover', this.mouseOver, true);
    }
    
    mouseOut = () => {
      console.log('out');
      this.enableCreate = false;
    }
    
    mouseOver = () => {
      console.log('over');
      this.enableCreate = true;
    }
    
    mapMouseDown = (e) => {
      if (!BMapGL) return;
        if (this.isCreate && this.enableCreate) {
          const currentPoint = [e.latlng.lng, e.latlng.lat];
          this.points.push(currentPoint);
          this.drawPoints = this.points.concat([[...currentPoint]]).map((p) => new BMapGL.Point(p[0], p[1]));
          if (this.points.length === 1) {
            this.selectedOverlay = new BMapGL.Polygon(this.drawPoints, payload.overlayOptions);
            this.map.addOverlay(this.selectedOverlay);
          } else {
            this.selectedOverlay.setPath(this.drawPoints);
          }
        }
    }

    mapMouseMove = (e) => {
      if (!BMapGL) return;
        if (this.isCreate) {
          const currentPoint = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
          if (this.selectedOverlay && this.enableCreate) {
            this.selectedOverlay.setPositionAt(this.drawPoints.length - 1, currentPoint);
          }
          if (this.tip_label) {
            this.map.removeOverlay(this.tip_label);
          }
          const label = this.enableCreate ?
            (this.points.length > 0 ? '单击绘制下一个点，回车完成绘制' : '单击确认起点') :
            '超出标注区域边界';
          this.tip_label = new BMapGL.Label(label, {
              position: currentPoint, // 指定文本标注所在的地理位置
              offset: new BMapGL.Size(10, 10) // 设置文本偏移量
          });
          this.tip_label.setStyle(payload.labelOptions);
          this.map.addOverlay(this.tip_label);
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
        this.selectedOverlay.removeEventListener('lineupdate', this.overlayUpdate);
        this.selectedOverlay.disableEditing();
        this.selectedOverlay.setFillOpacity(0.1);
        this.selectedOverlay = undefined;
      }
      if (overlay) {
        overlay.setFillOpacity(payload.overlayOptions.fillOpacity);
        overlay.addEventListener('lineupdate', this.overlayUpdate);
        this.selectedOverlay = overlay;
      }
      this.setSelectedId(overlay?.id, overlay?.category || this.state.selectedCategory);
    }
    
    createLabel = (label, point, className) => {
        const labelPoint = new BMapGL.Point(point[0], point[1])
        const tip = new BMapGL.Label(label, {
            position: labelPoint,
            offset: new BMapGL.Size(-5, -10)
        });
        this.map.addOverlay(tip);
        const { clientWidth, clientHeight } = tip.domElement;
        tip.domElement.classList.add('building_label', className);
        tip.setOffset({ width: -clientWidth/2, height: -clientHeight/2 })
    }

    overlayUpdate = (e) => {
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
        const { instances } = this.state;
        if (this.selectedOverlay && !instances[this.selectedOverlay.id]) {
          this.map.removeOverlay(this.selectedOverlay);
        }
        this.setSelectedOverlay();
        this.initStatus();
    }

    initStatus = () => {
      this.points = [];
      this.isCreate = !this.isCreate;
      this.map.maskLayer.style.cursor = this.isCreate ? 'crosshair' : '';
    }

    createComplete = () => {
        const { isCreate, points, selectedOverlay } = this;
        const { selectedCategory } = this.state;
        if (isCreate) {
          if (points.length > 2 && selectedOverlay) {
            const id = `${new Date().valueOf()}`;
            this.setInstance(id, { id, lnglats: [...points], category: selectedCategory });
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

    saveData = (type) => {
      const { instances } = this.state;
      const data = {
        instances: Object.values(instances),
        center: this.center,
        bounds: this.bounds,
      };
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
                    `${v.label || '未命名'}`
                 ))
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
          {
            className: 'save-btn',
            onClick: () => { this.saveData('save'); }
          },
          '保存'
        ),
        React.createElement(
          'div',
          {
            className: 'map-tip',
          },
          'Space: 开始新建；Enter：新建完成；Delete/BackSpace：删除；o：编辑名称'
        )
      );
    }
  }

  ReactDOM.render(React.createElement(MapAnnotationApp, { payload }), document.getElementById('map-annotation-app_{{{RECORD_ID}}}'));
}).catch((error) => {
  console.log(error);
});