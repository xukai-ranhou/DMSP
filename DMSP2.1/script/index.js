var dmspApp=angular.module("app",["ng","ngRoute","ui.sortable",'monospaced.qrcode'])
dmspApp.config(function($routeProvider){
    $routeProvider
        .when('/main',{
            templateUrl:'tpl/main.html'
        })
        .when('/Drug',{
            templateUrl:'tpl/catalogManager/drug.html'
        })
        .when('/Consumable',{
            templateUrl:'tpl/catalogManager/consumable.html'
        })
        .when('/Institution',{
            templateUrl:'tpl/catalogManager/institution.html'
        })
        .when('/InstitutionCatalog',{
            templateUrl:'tpl/catalogManager/institutionCatalog.html'
        })
        .otherwise({redirectTo:'main'})
})
dmspApp.factory("changeStatus",function ($location) {
    return {
        inOrDedent:true,
        messagesTotalNumbers:0,
        unreadedNumbers:0,
        condition:'请选择',
        showUp:false,
        showTriangle:true,
        jump:function(arg){
            $location.path(arg);
        },
        sliderX:function(){
            $(".paging-container").toggleClass("paging-x");
            this.inOrdedent=!this.inOrdedent;
            // 图标模式下，所有的二级菜单收起,
            // 完整模式下，则展开被选中的菜单项
            if(this.inOrdedent){
                $(".x-profile.active ul").slideDown("fast")
                $(".slider-bar>ul>li.active span:nth-child(3)").removeClass("fa-plus-square-o")
            }else{
                $(".x-profile.active ul").slideUp("fast")
            }
        },
        sliderBarCollapse:function($event){
            var li=$($event.target).parent("li").length===0?$($event.target).parent().parent():$($event.target).parent("li");
            //一级菜单的切换
            li.addClass("active")
                .siblings("li.active").removeClass("active")
            //选中此时的一级菜单其他二级菜单的被选取消
            li.siblings("li").children("ul").children("li.active").removeClass("active")

            //二级菜单收缩释放显示+和—
            li.children("a").children("span:nth-child(3)").toggleClass("fa-plus-square-o")
            li.siblings("li.x-profile").children("a").children("span:last-child").addClass("fa-plus-square-o")
            //二级菜单收缩释放
            if($(".paging-container.paging-x").length===0){
                li.children("ul").slideToggle("normal")
                li.siblings("li").children("ul").slideUp("normal")
            }else{
                //图标模式下，选中二级选项，一级选项切换
                if(li.hasClass("active")){
                    li.parent().parent("li").addClass("active")
                        .siblings("li.active").removeClass("active")
                    li.parent().parent("li").children().children("li.active")
                        .removeClass("active")
                }
            }
            //当选中的子li，将a的html以及href push到数组
            if(li.children().children("b").length!==0 ||li.children().children("span:last-child").html()=="主页"){
                // console.log(li.children().children("i").attr("class"))
                for(var j=0;j<this.breadCrumbLists.length;j++){
                    this.breadCrumbLists[j].status="notActive"
                }
                for (var i = 0; i<this.breadCrumbLists.length; i++){

                    if (this.breadCrumbLists[i].htmlContent === li.children().children("b").html() || this.breadCrumbLists[i].htmlContent === li.children().children("span:last-child").html()){
                        this.breadCrumbLists[i].status="notActive active"
                        break;
                    }
                    if(i==this.breadCrumbLists.length-1){
                        if(this.breadCrumbLists.length<=10){
                            this.breadCrumbLists.push(
                                {
                                    "link": li.children().attr("href"),
                                    "htmlContent": li.children().children("b").text(),
                                    "status":"notActive active",
                                    "closeSign":"fa fa-close",
                                    "sign":li.children().children("i").attr("class")
                                }
                            )
                        }else{
                            alert("为保证系统效率，只允许同时运行10个功能窗口，请关闭一些窗口重试")
                        }
                    }
                }
            }
        },
        changeBreadcrumb:function($event,$index){
            for(var i=0;i<this.breadCrumbLists.length;i++){
                this.breadCrumbLists[i].status="notActive"
            }
            this.breadCrumbLists[$index].status="notActive active";
            //关闭面包屑
            if($event.target.nodeName==="SPAN"){
                if(this.breadCrumbLists[$index].status==="notActive active"){
                    if(this.breadCrumbLists[$index+1]){
                        this.breadCrumbLists[$index+1].status="notActive active"
                        $location.path('/'+this.breadCrumbLists[$index+1].link.slice(1))
                    }else{
                        this.breadCrumbLists[$index-1].status="notActive active"
                        $location.path('/'+this.breadCrumbLists[$index-1].link.slice(1))
                    }
                }
                this.breadCrumbLists.splice($index,1);
            }
        },
        toggleMessage:function(){
            $(".message-content").slideToggle("fast");
            $(".message").toggleClass("active")
                .siblings(".active").removeClass("active")
        },
        updateReaded:function($index){
            this.messagesLists[$index].messageStatus="已读";
            this.getMessagesNumbers();//获得新的未读数
        },
        showConditions:function(){
            $(".more-conditions").slideToggle();
            this.showTriangle=!this.showTriangle;
        },
        onresize:function(){
            var doc = document,
                ele = doc.documentElement,
                bodys = doc.bodys,
                clientWidth = ele ? ele.clientWidth : bodys.clientWidth
            if(clientWidth<=600){
                $(".paging-container").addClass("paging-x");
                $(".slider-x").hide();
                $(".x-profile.active ul").slideUp("fast")
            }else{
                $(".paging-container").removeClass("paging-x");
                $(".slider-x").show();
                $(".x-profile.active ul").slideDown("fast")
                $(".slider-bar>ul>li.active span:nth-child(3)").removeClass("fa-plus-square-o");
                this.scope.inOrdedent=true;
            }



        }
    }
})
dmspApp.factory("shareFactory",function(){
    return{
        addScrollBar:function(arr){
            if(arr){
                for(var i=0;i<arr.length;i++){
                    $(arr[i]).perfectScrollbar({
                        wheelSpeed:40
                    })
                }
            }
        },
        getChart1:function(elementId){
            var myChart = echarts.init(document.getElementById(elementId));
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['订单1','订单2','订单3','订单4','订单5','订单6']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'订单1',
                        type:'bar',
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'订单2',
                        type:'bar',
                        stack: '广告',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'订单3',
                        type:'bar',
                        stack: '广告',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'订单4',
                        type:'bar',
                        stack: '广告',
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name:'订单5',
                        type:'bar',
                        data:[862, 1018, 964, 1026, 1679, 1600, 1570],
                        markLine : {
                            lineStyle: {
                                normal: {
                                    type: 'dashed'
                                }
                            },
                            data : [
                                [{type : 'min'}, {type : 'max'}]
                            ]
                        }
                    },
                    {
                        name:'订单6',
                        type:'bar',
                        barWidth : 5,
                        stack: '搜索引擎',
                        data:[620, 732, 701, 734, 1090, 1130, 1120]
                    }
                ]
            };

            myChart.setOption(option);
        },
        getChart2:function (elementId) {
            var myChart = echarts.init(document.getElementById(elementId));
            // app.title = '嵌套环形图';

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['供应商1','供应商2','供应商3','供应商4','供应商5','供应商6','供应商7','供应商8','供应商9','其他']
                },
                series: [
                    {
                        name:'供应商详情',
                        type:'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],

                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'供应商1', selected:true},
                            {value:679, name:'供应商2'},
                            {value:1548, name:'供应商3'}
                        ]
                    },
                    {
                        name:'供应商详情',
                        type:'pie',
                        radius: ['40%', '55%'],

                        data:[
                            {value:335, name:'供应商1'},
                            {value:310, name:'供应商2'},
                            {value:234, name:'供应商3'},
                            {value:135, name:'供应商4'},
                            {value:1048, name:'供应商5'},
                            {value:251, name:'供应商6'},
                            {value:147, name:'供应商7'},
                            {value:102, name:'其他'}
                        ]
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
})
dmspApp.controller("dmspCtrl",function($scope,changeStatus,shareFactory){
    //添加滚动条插件
    var arr=["#addScroll","#addScrollContent","#message-content"];
    shareFactory.addScrollBar(arr);
    //页面刷新，跳转到首页
    changeStatus.jump('/main')
    $scope.sliderAllLists=[
        {
            "parentLiItem":"目录管理",
            "parentLiStatus":"notActive",
            "parentSign":"fa-list",
            "parentLink":'',
            "childrenLi":[
                {"childLi":"目录药品","childLiStatus":"notActive","link":"#Drug","childSign":"fa-comments"},
                {"childLi":"目录耗材","childLiStatus":"notActive","link":"#Consumable","childSign":"fa-files-o"},
                {"childLi":"机构目录药品","childLiStatus":"notActive","link":"#Institution","childSign":"fa-calendar"},
                {"childLi":"机构目录耗材","childLiStatus":"notActive","link":"#InstitutionCatalog","childSign":"fa-envira"},
                ],
        },
        {
            "parentLiItem":"采购管理",
            "parentLiStatus":"notActive",
            "parentSign":"fa-shopping-cart",
            "parentLink":'',
            "childrenLi":[
                {"childLi":"药品采购计划单","childLiStatus":"notActive","link":"#","childSign":"fa-list-alt"},
                {"childLi":"药品配送单","childLiStatus":"notActive","link":"#","childSign":"fa-arrow-right"},
                {"childLi":"药品采购单","childLiStatus":"notActive","link":"#","childSign":"fa-text-width"},
                {"childLi":"药品订单付款","childLiStatus":"notActive","link":"#","childSign":"fa-heart"},
                {"childLi":"耗材订单付款","childLiStatus":"notActive","link":"#","childSign":"fa-square-o"}
            ],
        },
        {
            "parentLiItem":"发票管理",
            "parentLiStatus":"notActive",
            "parentSign":"fa-ticket",
            "parentLink":'',
            "childrenLi":[
                {"childLi":"供应商管理","childLiStatus":"notActive","link":"#","childSign":"fa-pencil"},
                {"childLi":"生产商管理","childLiStatus":"notActive","link":"#","childSign":"fa-floppy-o"},
                {"childLi":"药品信息管理","childLiStatus":"notActive","link":"#","childSign":"fa-table"},
                {"childLi":"耗材基础信息","childLiStatus":"notActive","link":"#","childSign":"fa-align-justify"},
                {"childLi":"药品规格信息","childLiStatus":"notActive","link":"#","childSign":"fa-sort-alpha-desc"}
            ],
        },
        {
            "parentLiItem":"统计分析",
            "parentLiStatus":"notActive",
            "parentSign":"fa-bar-chart",
            "parentLink":'',
            "childrenLi":[
                {"childLi":"供应商管理","childLiStatus":"notActive","link":"#","childSign":"fa-download"},
                {"childLi":"生产商管理","childLiStatus":"notActive","link":"#","childSign":"fa-bar-chart-o"},
                {"childLi":"药品信息管理","childLiStatus":"notActive","link":"#","childSign":"fa-exchange"},
                {"childLi":"耗材基础信息","childLiStatus":"notActive","link":"#","childSign":"fa-reddit"},
                {"childLi":"药品规格信息","childLiStatus":"notActive","link":"#","childSign":"fa-modx"}
            ],
        },
        {
            "parentLiItem":"系统管理",
            "parentLiStatus":"notActive",
            "parentSign":"fa-cogs",
            "parentLink":'',
            "childrenLi":[
                {"childLi":"供应商管理","childLiStatus":"notActive","link":"#","childSign":"fa-simplybuilt"},
                {"childLi":"生产商管理","childLiStatus":"notActive","link":"#","childSign":"fa-trello"},
                {"childLi":"药品信息管理","childLiStatus":"notActive","link":"#","childSign":"fa-shirtsinbulk"},
                {"childLi":"耗材基础信息","childLiStatus":"notActive","link":"#","childSign":"fa-bandcamp"},
                {"childLi":"药品规格信息","childLiStatus":"notActive","link":"#","childSign":"fa-envira"}
            ],
        }

    ]  //初始化导航栏数据
    $scope.breadCrumbLists=[
        {"link":"#main","htmlContent":"主页","status":"notActive active","sign":"fa fa-desktop"}
    ] //初始化面包屑数组
    $scope.messagesLists=[
        {"messageAvatar":"images/logo.png",
            "messageName":"张三",
            "messageDate":"05.03.2013 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus temporibus totam veniam voluptatem? Adipisci earum, fuga illum omnis repellat rerum."},
        {"messageAvatar":"images/window-pic/111.jpg",
            "messageName":"Rose",
            "messageDate":"07.03.2013 14:20",
            "messageStatus":"已读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere ."},
        {"messageAvatar":"images/window-pic/888.jpg",
            "messageName":"Jack",
            "messageDate":"05.03.2013 14:21",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus temporibus totam veniam voluptatem? "},
        {"messageAvatar":"images/window-pic/222.jpg",
            "messageName":"Jacsdk",
            "messageDate":"05.03.2013 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus t."},
        {"messageAvatar":"images/window-pic/333.jpg",
            "messageName":"Jack",
            "messageDate":"05.03.2014 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus temporibus totam veniam voluptatem? Adipisci earum, fuga illum omnis repellat rerum."},
        {"messageAvatar":"images/window-pic/444.jpg",
            "messageName":"Jack",
            "messageDate":"05.04.2013 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis "},
        {"messageAvatar":"images/window-pic/555.jpg",
            "messageName":"Jack",
            "messageDate":"05.03.2013 14:20",
            "messageStatus":"已读",
            "messageContent":"方式一设置浏览器最小字体限制：设置--》高级设置--》网络内容--》自定义字体...设置成最小字体就可以了。(无须重启)"},
        {"messageAvatar":"images/window-pic/777.jpg",
            "messageName":"Jack",
            "messageDate":"05.03.2013 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus temporibus totam veniam voluptatem? Adipisci earum, fuga illum omnis repellat rerum."},
        {"messageAvatar":"images/window-pic/666.jpg",
            "messageName":"Jack",
            "messageDate":"05.03.2013 14:20",
            "messageStatus":"未读",
            "messageContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, aperiam autem blanditiis cupiditate deleniti dolore facere illo nostrum possimus temporibus totam veniam voluptatem? Adipisci earum, fuga illum omnis repellat rerum."},

    ] //初始化消息列表数据

    $scope.inOrdedent=changeStatus.inOrDedent; //初始化伸缩按钮状态
    $scope.sliderX=changeStatus.sliderX;//控制左边导航栏大小
    $scope.sliderBarCollapse=changeStatus.sliderBarCollapse; //导航栏功能
    $scope.changeBreadcrumb=changeStatus.changeBreadcrumb; //面包屑状态切换
    $scope.toggleMessage=changeStatus.toggleMessage; //消息通知显示和隐藏

    //获取消息总条数,以及未读条数
    $scope.getMessagesNumbers=function(){
        $scope.messagesTotalNumbers=$scope.messagesLists.length;
        for(var i=0,num=0;i<this.messagesTotalNumbers;i++){
            if($scope.messagesLists[i].messageStatus=="未读")
                num++;
        }
        $scope.unreadedNumbers=num;
    }
    $scope.getMessagesNumbers();//每次页面，重新扫描消息数据，得到总数和未读数
    $scope.updateReaded=changeStatus.updateReaded;
    //面包屑状态切换，面包屑选中项对应左导航栏的选中项以及content中网页
    // $scope.onActive=function(){
    //     for(var i=0;i<$scope.breadCrumbLists.length;i++){
    //         for(var j=0;j<$scope.sliderAllLists.length;j++){
    //             $scope.sliderAllLists[j].parentLiStatus="notActive"
    //             for(var k=0;k<$scope.sliderAllLists[j].childrenLi.length;k++){
    //                 $scope.sliderAllLists[j].childrenLi[k].childLiStatus="notActive"
    //                 console.log("ok")
    //             }
    //         }
    //     }
    // }

    //屏幕切换是，左边框的变化
    window.scope=$scope;
    window.onresize = changeStatus.onresize;

    //展现部分公共头部
    $scope.condition=changeStatus.condition;
    $scope.showUp=changeStatus.showUp;
    $scope.showTriangle=changeStatus.showTriangle;
    $scope.showConditions=changeStatus.showConditions;

    $('.consumable-content').tabulator();
})

//mian控制器
dmspApp.factory("mainChangeStatus",function(){
    return {
        showTask:true,
        showNotice:false,
        showInform:false,
    }
})
dmspApp.controller("mainCtrl",function($scope,mainChangeStatus,shareFactory){
    var arr=["#tasks"];
    shareFactory.addScrollBar(arr);

    $scope.indicesLists=[
        {"detailName":"药品订单量",
            "detailNumber":"123",
            "visualSign":"fa-pie-chart",
            "bgColor":"color-1",
            "moreLink":""
        },
        {"detailName":"发票管理统计",
            "detailNumber":"63",
            "visualSign":"fa-bar-chart-o",
            "bgColor":"color-2",
            "moreLink":""
        },
        {"detailName":"耗材信息管理统计",
            "detailNumber":"454",
            "visualSign":"fa-windows",
            "bgColor":"color-3",
            "moreLink":""
        },
        {"detailName":"药品资质",
            "detailNumber":"230",
            "visualSign":"fa-envira",
            "bgColor":"color-4",
            "moreLink":""
        }
    ];
    $scope.informationLists=[
        {"informSign":"fa-calendar","showTarget":true,"showTitle":"待办任务","isActive":"notActive active"},
        {"informSign":"fa-bell-o","showTarget":false,"showTitle":"公告","isActive":"notActive"},
        {"informSign":"fa-weixin","showTarget":false,"showTitle":"通知","isActive":"notActive"}
    ]

    //消息通知tab切换
    $scope.showTask=mainChangeStatus.showTask;
    $scope.showNotice=mainChangeStatus.showNotice;
    $scope.showInform=mainChangeStatus.showInform;
    $scope.showInformation=function($event,$index){
        for(var i=0;i<this.informationLists.length;i++){
            this.informationLists[i].isActive="notActive";
            this.informationLists[i].showTarget=false;
        }
        this.informationLists[$index].isActive="notActive active";
        this.informationLists[$index].showTarget=true;
        $scope.showTask=this.informationLists[0].showTarget;
        $scope.showNotice=this.informationLists[1].showTarget;
        $scope.showInform=this.informationLists[2].showTarget;
    }

    //制作柱状图以及饼图
    shareFactory.getChart1("myChart1");
    shareFactory.getChart2("myChart2");

    //订单量以及供应商tab切换
    $scope.active="active";
    $scope.showCaret=true;
    $scope.showChart=true;
    $scope.showOrders=function(){
        $scope.active="active";
        $scope.notActive="notActive";
        $scope.showCaret=true;
        $scope.showChart=true;
    }
    $scope.showSuppliers=function(){
        $scope.active="notActive";
        $scope.notActive="active";
        $scope.showCaret=false;
        $scope.showChart=false;
    }
})

dmspApp.factory("consumbableChangeStatus",function(){
    return{

    }
})
dmspApp.controller("consumableController",function ($scope) {
    $(window).resize(function(){
        $(".consumable-content").tabulator("redraw");
    });
    $('.consumable-content').tabulator({
        columns:[
            {title:"Name", field:"name", sortable:true, sorter:"string", width:200, editable:true},
            {title:"Age", field:"age", sortable:true, sorter:"number", align:"right",width:200, formatter:"progress"},
            {title:"Gender", field:"gender", sortable:true, sorter:"string",width:100, onClick:function(e, val, cell, row){console.log("cell click")},},
            {title:"Height", field:"height", sortable:true, formatter:"star", align:"center", width:100},
            {title:"Date Of Birth", field:"dob", sortable:true, sorter:"date", align:"center"},
            {title:"Cheese Preference", field:"cheese", sortable:true, sorter:"boolean", align:"center", formatter:"tickCross"},
            {title:"operation", field:"operation", sortable:false,  align:"center"},
        ],
        colResizable:false,
        fitColumns:true,
        headerBackgroundColor:"#f3f5cf",
        backgroundColor:"#fff",
        borderColor:"#ddd",
        headerBorderColor:"#ddd",
        rowBorderColor:"#ddd",
        rowBackgroundColor:"#fff",
        textSize:"12",
        rowHoverBackground:"#ccc",
        rowEvenBackground:"#fff",
        rowOddBackground:"#fff"
    });

    $scope.consumableLists=[
        {id:1, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
        {id:2, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
        {id:3, name:"Christine Lobowski", age:"42", height:0, col:"green", dob:"22/05/1982", cheese:"true"},
        {id:4, name:"Brendon Philips", age:"125", gender:"male", height:1, col:"orange", dob:"01/08/1980"},
        {id:5, name:"Margret Marmajuke", age:"16", gender:"female", height:5, col:"yellow", dob:"31/01/1999"},
        {id:6, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
        {id:7, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
        {id:8, name:"Christine Lobowski", age:"42", height:0, col:"green", dob:"22/05/1982", cheese:"true"},
        {id:9, name:"Brendon Philips", age:"125", gender:"male", height:1, col:"orange", dob:"01/08/1980"},
        {id:10, name:"Margret Marmajuke", age:"16", gender:"female", height:5, col:"yellow", dob:"31/01/1999"},
        {id:11, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
        {id:12, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
        {id:13, name:"Christine Lobowski", age:"42", height:0, col:"green", dob:"22/05/1982", cheese:"true"},
        {id:14, name:"Brendon Philips", age:"125", gender:"male", height:1, col:"orange", dob:"01/08/1980"},
        {id:15, name:"Margret Marmajuke", age:"16", gender:"female", height:5, col:"yellow", dob:"31/01/1999"},
        {id:16, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
        {id:17, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
        {id:18, name:"Christine Lobowski", age:"42", height:0, col:"green", dob:"22/05/1982", cheese:"true"},
        {id:19, name:"Brendon Philips", age:"125", gender:"male", height:1, col:"orange", dob:"01/08/1980"},
        {id:20, name:"Margret Marmajuke", age:"16", gender:"female", height:5, col:"yellow", dob:"31/01/1999"},
    ]
    var operation="<button class='btn btn-success tabulate-btn tabulate-success'>编辑</button>" +
    "<button class='btn btn-danger tabulate-btn tabulate-danger'>删除</button>" +
    "<button class='btn btn-info tabulate-btn tabulate-info'>详情</button>";
    for(var i=0;i<$scope.consumableLists.length;i++){
        $scope.consumableLists[i].operation=operation;
    }
    $('.consumable-content').tabulator('setData',$scope.consumableLists)





})

dmspApp.controller("institutionCtrl",function($scope,shareFactory,$http,$timeout,$interval){
    var arr=["#tree",".tree-content"];
    shareFactory.addScrollBar(arr);
    var vm = $scope.vm = {};
    vm.countries=[
        {
            "label":"病区",
            "provinces":[
                {
                    'label':"新ICU-13楼A区",
                    "cities":[
                        {"label":"FB12345678901"},
                        {"label":"FB12345678902"},
                        {"label":"FB12345678903"},
                        {"label":"FB12345678904"}
                    ]
                },
                {
                    'label':"新ICU-13楼B区",
                    "cities":[
                        {"label":"FB1234567890112345678901"},
                        {"label":"FB1234567890212345678901"},
                        {"label":"FB1234567890312345678901"},
                        {"label":"FB1234567890412345678901"}
                    ]
                },
                {
                    'label':"新ICU-13楼C区",
                    "cities":[
                        {"label":"FB1234567890112345678901"},
                        {"label":"FB1234567890212345678901"},
                        {"label":"FB1234567890312345678901"},
                        {"label":"FB1234567890412345678901"}
                    ]
                },
            ]
        },
        {
            "label":"病区",
            "provinces":[
                {
                    'label':"北京",
                    "cities":[
                        {
                            "label":"朝阳区",
                            "towns":[
                                {"label":"天安门"},
                                {"label":"天安门"}
                            ]
                        },
                        { "label":"朝阳区"},
                        { "label":"朝阳区"},
                        {"label":"朝阳区"}
                    ]
                },
                {'label':"河北"},
                {'label':"安徽"},
            ]
        },
        {"label":'病区'}
    ]

    // vm.countries = CityData;
    vm.select = function(country, province, city,town) {
        vm.country = country;
        vm.province = province;
        vm.city = city;
        vm.town = town;

    };
    $scope.resetWidth=function(){
        var treeWidth=$('.tree').css("width");
        $('.tree-content').css("left",treeWidth);
    }



    $scope.changeBig=function($index){
        if($index==0){
            $scope.showBig=true;
        }
    }
    $http.get('php/select.php')
        .success(function (lists) {
            $scope.lists=lists;
        });
    $scope.changeSmall=function(){
        $scope.showBig=false;
    }
    $interval(function(){
        $http.get('php/select.php')
            .success(function (lists) {
                $scope.lists=lists;
            });
    },5000)



    $scope.cannotSort = false;
    // $scope.data = [{
    //     "name": "allen",
    //     "age": 21,
    //     "i": 0
    // }, {
    //     "name": "bob",
    //     "age": 18,
    //     "i": 1
    // }, {
    //     "name": "curry",
    //     "age": 25,
    //     "i": 2
    // }, {
    //     "name": "david",
    //     "age": 30,
    //     "i": 3
    // }];

    $scope.sortableOptions = {
        // 数据有变化
        update: function(e, ui) {
            console.log("update");
            //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG？
            $timeout(function() {
                var resArr = [];
                for (var i = 0; i < $scope.lists.length; i++) {
                    resArr.push($scope.lists[i].i);
                }
                console.log(resArr);
            })


        },

        // 完成拖拽动作
        stop: function(e, ui) {

        }
    }

})
dmspApp.directive("weiYi",function(){
    return{
        restrict :'A',//A属性,E标签,C类名,D注释
        link :function(scope,element,attr){
            attr.data=angular.equals(attr.data,"true");
            //console.log(attr.data);
            console.log(element);
            element.on("mousedown",function(e){
                var that = $(this);
                console.log(attr.data);
                if(attr.data){
                    $div=$("<div>");
                    console.log($div);
                    $div.css({"width":"100px","height":"100px","border": "2px dotted green","position":"absolute","left":that.offset().left,"top":that.offset().top});
                    $div.appendTo($("body"));
                }
                var x=e.clientX-$(this).offset().left;
                var y=e.clientY-$(this).offset().top;
                //console.log(x+":"+y);
                $(document).on("mousemove",function(e){
                    if(attr.data){
                        $div.css({"left":e.clientX-x,"top":e.clientY-y});
                    }else{
                        that.css({"left":e.clientX-x,"top":e.clientY-y});
                    }
                });
                $(document).on("mouseup",function(e){
                    //console.log($div);
                    $(document).off();
                    if(attr.data){
                        that.css({"left":$div.offset().left,"top":$div.offset().top});
                        $div.remove();
                    }
                })

            })
        }
    }
});

dmspApp.controller("institutionCatalogCtrl",function($scope,shareFactory){
    var arr=["#tree",".tree-content"];
    shareFactory.addScrollBar(arr);
    var vm = $scope.vm = {};
    vm.countries=[
        {
            "label":"病区",
            "provinces":[
                {
                    'label':"新ICU-13楼A区",
                    "cities":[
                        {"label":"FB12345678901"},
                        {"label":"FB12345678902"},
                        {"label":"FB12345678903"},
                        {"label":"FB12345678904"}
                    ]
                },
                {
                    'label':"新ICU-13楼B区",
                    "cities":[
                        {"label":"FB1234567890112345678901"},
                        {"label":"FB1234567890212345678901"},
                        {"label":"FB1234567890312345678901"},
                        {"label":"FB1234567890412345678901"}
                    ]
                },
                {
                    'label':"新ICU-13楼C区",
                    "cities":[
                        {"label":"FB1234567890112345678901"},
                        {"label":"FB1234567890212345678901"},
                        {"label":"FB1234567890312345678901"},
                        {"label":"FB1234567890412345678901"}
                    ]
                },
            ]
        },
        {
            "label":"病区",
            "provinces":[
                {
                    'label':"北京",
                    "cities":[
                        {
                            "label":"朝阳区",
                            "towns":[
                                {"label":"天安门"},
                                {"label":"天安门"}
                            ]
                        },
                        { "label":"朝阳区"},
                        { "label":"朝阳区"},
                        {"label":"朝阳区"}
                    ]
                },
                {'label':"河北"},
                {'label':"安徽"},
            ]
        },
        {"label":'病区'}
    ]

    // vm.countries = CityData;
    vm.select = function(country, province, city,town) {
        vm.country = country;
        vm.province = province;
        vm.city = city;
        vm.town = town;

    };
    $scope.resetWidth=function(){
        var treeWidth=$('.tree').css("width");
        $('.tree-content').css("left",treeWidth);
    }



})







