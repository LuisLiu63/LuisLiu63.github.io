/**
 * Author: luisliu
 * Description: 
 * Time: 2021-05-02 21:43:11
 * Contact: lc63msn@Hotmail.com
 */

let Tool = {
    resetEvent(viewer){
        
        let handler = viewer.screenSpaceEventHandler;

        
        for (const type in window.Cemap.Cesium.ScreenSpaceEventType) {

            handler.removeInputAction(window.Cemap.Cesium.ScreenSpaceEventType[type]);
        }

    },
    ToPoint(p){
        return window.Cemap.Cesium.Cartesian3.fromDegrees(p.jd, p.wd)
    },
    ToPoints(p){

        p = p.map((item) => {
            return Number(item)
        })

        return window.Cemap.Cesium.Cartesian3.fromDegreesArray(p);
    },
    GetAngle( p1, p2 ){

        return window.Cemap.Cesium.Cartesian3.angleBetween(this.ToPoint(p1), this.ToPoint(p2))
    },
    calculateRadians (positions) {
        //弧度
        var hxRadian = 0;
        //角度
        var hxAngle = 0;
        var x = positions[1][0] - positions[0][0];
        var y = positions[1][1] - positions[0][1];
        if (!(x === 0 && y === 0)) {
            if (y >= 0) {
                hxRadian = Math.asin(x / Math.sqrt((x * x + y * y)));
                hxAngle = - hxRadian * 180 / Math.PI;
            } else if (x !== 0) {
                hxRadian = Math.asin(x / Math.sqrt((x * x + y * y)));
                hxAngle = hxRadian * 180 / Math.PI - 180;
            } else {
                hxRadian = Math.acos(y / Math.sqrt((x * x + y * y)));
                hxAngle = hxRadian * 180 / Math.PI + 90 * hxRadian / Math.abs(hxRadian);
            }
        }
        return hxAngle;
    }
};


(function () {
    window.MapObj = Cemap.create('map-container', {

        onBeforeInit() {

        },
        onInit() {

        },
        onDestroy() {

        },
        Customs: {
            backgroundColor: '',
            shortcutKey: true,
            light: true,
            mode: '3D',
        }
    });

    let viewer = window.MapObj.viewer,
        Cesium = window.Cemap.Cesium;

    let _timestamp = new Date().getTime();

    initLayers();

    initEvent();

    initStaticLayer();

    function initLayers() {
        var token = '50a995b60146fac2947a7a72d995f0c9';
        // 服务域名
        var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
        // 服务负载子域
        var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];


        // 叠加影像服务
        var imgMap = new Cesium.UrlTemplateImageryProvider({
            url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        });
        viewer.imageryLayers.addImageryProvider(imgMap);

        // 叠加国界服务
        var iboMap = new Cesium.UrlTemplateImageryProvider({
            url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 10
        });
        viewer.imageryLayers.addImageryProvider(iboMap);
        
        // 叠加地名服务
        // var nameMap = new Cesium.WebMapTileServiceImageryProvider({
        //     url: tdtUrl + 'cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' + token,
        //     layer: "tdtAnnoLayer",
        //     style: "default",
        //     format: "image/jpeg",
        //     tileMatrixSetID: "GoogleMapsCompatible",
        //     show: false
        // });
        // viewer.imageryLayers.addImageryProvider(nameMap);

        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + token,
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible"
        }));


        // 将三维球定位到中国
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(85, 40, 2785000),
            // orientation: {
            //     heading: Cesium.Math.toRadians(348.4202942851978),
            //     pitch: Cesium.Math.toRadians(-89.74026687972041),
            //     roll: Cesium.Math.toRadians(0)
            // },
            complete: function callback() {
                // 定位完成之后的回调函数
            }
        });

    }

    function initStaticLayer(){

        [
            { jd: 76, wd: 40, icon: 'camera2.png', name: '阿克苏1号探头' },
            { jd: 77, wd: 39, icon: 'camera2.png', name: '阿克苏2号探头' },
            { jd: 76, wd: 37, icon: 'camera2.png', name: '阿克苏3号探头' },
            { jd: 75, wd: 39, icon: 'camera2.png', name: '阿克苏4号探头' },
            { jd: 77, wd: 36, icon: 'radar.png', name: '和田1号探空雷达' },
            { jd: 77.5, wd: 35.8, icon: 'radar.png', name: '柴达木1号气象雷达' },
            { jd: 78.5, wd: 35, icon: 'radar.png', name: '边境167号防空雷达' },
        ].forEach(item => {
            drawPointTarget(item);
        })
    }

    function initEvent(){
        Tool.resetEvent(viewer);

        // 左键单击
        viewer.screenSpaceEventHandler.setInputAction(function(movement){

            let pickedFeature = viewer.scene.pick(movement.position);
        

            if (Cesium.defined(pickedFeature)) {
                console.log({pickedFeature});
                showPopover(pickedFeature.id.data, movement.position);
            }else{
                hidePopover()
            }
            
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        viewer.screenSpaceEventHandler.setInputAction(function(movement){
            let nowstamp = new Date().getTime();

            if((nowstamp - _timestamp) < 500){
                return;
            }else{
                _timestamp = nowstamp;
            }

            let pickedFeature = viewer.scene.pick(movement.endPosition);

            if (Cesium.defined(pickedFeature)) {
                viewer.cesiumWidget._element.style.cursor = "pointer";

            }else{
                viewer.cesiumWidget._element.style.cursor = "default"
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    function showPopover(target, position){
        
        let _html = `
            <h2>${target.name}</h2>
            <div class="popover-content">
                <img src="./image/${target.icon}"/>

                <ul>
                    <li>名称：${target.name}</li>
                    <li>地点：阿勒泰地区</li>
                    <li>经纬度：${target.jd}/${target.wd}</li>
                </ul>
            </div>
        `;
        let _popoverContainer = document.querySelector('#detail-container');

        _popoverContainer.innerHTML = _html;

        _popoverContainer.style.top = `${position.y}px`;
        _popoverContainer.style.left = `${position.x}px`;
        _popoverContainer.style.display = 'inline-block';
    }

    function hidePopover(){
        let _popoverContainer = document.querySelector('#detail-container');
        _popoverContainer.style.display = 'none';
    }



    let plane = moveTarget({
        name: '训练机',
        icon: 'plane.png',
        path: [
            {jd: 80, wd: 40},
            {jd: 81, wd: 40},
            {jd: 82, wd: 39},
            {jd: 83, wd: 39},
            {jd: 84, wd: 41},
            {jd: 85, wd: 41},
            {jd: 86, wd: 43},
            {jd: 87, wd: 43},
            {jd: 88, wd: 42},
            {jd: 89, wd: 42},
            {jd: 90, wd: 40},
            {jd: 91, wd: 40},
            {jd: 92, wd: 38},
            {jd: 93, wd: 38},
            {jd: 94, wd: 40},
        ]
    })

    console.log(plane);
    let animationElements = [plane]
    function animation(){

        setTimeout(() => {
            
            animationElements.forEach(item => {
                item.move();
            })
            window.requestAnimationFrame(animation)
        }, 750);
    }
    animation()



    function moveTarget(target){
        let _p = target.path[0];
        target.jd = _p.jd;
        target.wd = _p.wd;

        return {
            entity: drawPointTarget(target),
            current: 0,
            path: target.path,
            pathLine: drawLine(),
            move(){
                ++this.current;
                if(!this.path[this.current]){
                    this.current = 0;
                };

                let _stepPoint = this.path[this.current];
                this._setPosition(_stepPoint)
            },
            _setPosition(point){
                
                let _path = [];

                this.path.filter((p, i) => {
                    return i <= this.current
                }).forEach(item => {
                    _path.push(item.jd, item.wd);
                });

                let _prev = this.path[this.current - 1];
                if(_prev){

                    let _p1 = [_prev.jd, _prev.wd, 0],
                        _p2 = [point.jd, point.wd, 0]
                    this.entity.billboard.rotation = Tool.calculateRadians([_p1, _p2]);
                }

                this.entity.position.setValue(Tool.ToPoint(point));
                this.pathLine.polyline.positions = Tool.ToPoints(_path);
            }
        }
    }

    
    function drawPointTarget(target) {
        return viewer.entities.add({
            position: Tool.ToPoint(target),
            billboard: {
                image: `./image/${target.icon}`,
                width: 30,
                height: 30,
                color: Cesium.Color.RED
            },
            data: target
        });
    }

    function drawLine(positions){
        return viewer.entities.add({
            polyline: {
                positions: positions ? Tool.ToPoints(positions) : undefined,
                width: 3,
                material: Cesium.Color.GOLD
            }
        });
    }
})()

