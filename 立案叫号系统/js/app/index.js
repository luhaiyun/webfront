var app = angular.module('queue', []);
//展现小手的指令
app.directive('showCursor', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('mouseenter', function(event) {
                showCurosrShape(event, element);
            }).bind('mousemove', function(event) {
                showCurosrShape(event, element);
            }).bind('mouseleave', function(event) {
                $('.js-cursor').hide();
            });
            /*
             * 展现悬浮标签，如果元素的展现宽度小于实际宽度，则展现对应的悬浮标签
             * @param event 对应的鼠标移入或者移动事件对象
             * @param element 对应触发事件对象的元素
             * */
            function showCurosrShape(event, element) {
                event = event || window.event;
                var _text = element.text();
                var _cursor = $('.js-cursor');
                var _left = event.pageX;    //水平方向中间位置为鼠标悬浮位置
                var _top = event.pageY + 3;    //垂直方向在鼠标悬浮位置的上方10像素
                _cursor.css({
                    top: _top,
                    left: _left
                }).show();
            }
        }
    }
});
app.controller('queueController', function($scope, $http) {
    //初始化分页对象
    $scope.pageData = initPageData();

    //请求左侧排队等候数据
    $http.get('json/index-queue.json').success(function(data) {
        $scope.queueData = data.result;
        $scope.pageData.countPage = Math.ceil($scope.queueData.list.length / $scope.pageData.pageSize);
        $scope.pageList = getPageList($scope.pageData.countPage);
    });

    //判断当前元素是否展现
    $scope.isShow = function(pagingData, index) {
        var _startIndex = (pagingData.currentPage - 1) * pagingData.pageSize;
        var _endIndex = (pagingData.currentPage * pagingData.pageSize - 1);
        if(index >= _startIndex && index <= _endIndex) {
            return true;
        }
        return false;
    };

    /*
    * 更新分页
    * @param pageNum 要切换的页数
    * */
    $scope.updatePage = function(pageNum) {
        var $target = $(window.event.target);
        if($target.hasClass('fd-current') || $target.hasClass('disabled')) {
            return;
        }
        $scope.pageData.currentPage = pageNum;
    };

    /*
    * 点击了我的接待
    * */
    $scope.getMyReception = function() {
        $http.get('json/index-reception.json').success(function(data) {
            $scope.queueData = data.result;
            $scope.pageData = initPageData();
            $scope.pageData.countPage = Math.ceil($scope.queueData.list.length / $scope.pageData.pageSize);
            $scope.pageList = getPageList($scope.pageData.countPage);
        });
    };

    $scope.queue = function() {
        alert('点击了叫号');
    };

    /*
    * 获取初始化的pageData对象
    * */
    function initPageData() {
        return {
            currentPage: 1,
            pageSize: 8
        }
    }
    /*
    * 根据总页数获取页数列表
    * @param countPage 总页数
    * */
    function getPageList(countPage) {
        var pageList = [];
        if(countPage > 1) {
            for(var i = 1; i <= countPage; i++) {
                pageList.push(i);
            }
        }
        return pageList;
    }
});