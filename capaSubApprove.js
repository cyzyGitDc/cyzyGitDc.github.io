// 全局分页数据
var pageNum = 1;
var pageSize = 10;
var queryParam;// 查询参数

$(function () {

    queryCapaSubInfo();

});

// 审批
function saveCapaSubApprove() {
    $("#approveForm").submit();
}

function updatePager(pageSize, currentPage, totalCount) {


    //更新显示记录数
    $('#pageinfo').text('每页显示10条，共' + totalCount + '条');

    if (totalCount <= 0) {
        return;
    }
    $.jqPaginator('#pagination1', {
        pageSize: pageSize,
        visiblePages: 10,
        totalCounts: totalCount,
        currentPage: currentPage,
        onPageChange: function (num, type) {
            if ("change" == type) {
                //查询
                pageNum = num;
                queryCapaSubInfo(queryParam);// 重新查询
            }
        }
    });
}


// 查询 未审批的订阅 信息
function queryCapaSubInfo(param) {

    var p = param || {};
    queryParam = p;
    p.page = pageNum;
    p.rows = pageSize;


    $.ajax({
        url: "capa/queryCapaSubInfo.do",
        type: "POST",
        async: false,
        data: p,
        dataType: "json",
        cache: false,
        success: function (r) {
            handleRows(r);
            updatePager(pageSize, pageNum, r.total);
        },
        error: function () {
            showNullInfo("查询服务异常，请稍后再试……");
        }
    });

}

// 处理列表数据
function handleRows(data) {
    if (data) {


        if (data.total == 0) {
            showNullInfo();
        } else {
            var htm = '';

            for (var i = 0; i < data.rows.length; i++) {
                htm += getItemHtml(data.rows[i]);
            }

            $("#list").html(htm);

        }


    } else {
        showNullInfo();
    }
}

// 获取列表数据
function getItemHtml(item) {
    var htm = '';
    htm += '<div class="panle clearfix panle-title">';
    htm += '<div class="panletitle">';
    htm += '<div class="block-info-title">';
    htm += '    <span class="panle-label"></span>';
    htm += '订阅日期:' + item.subsDate + '<span class="ml30">标识:' + item.capa.code + '</span>';
    htm += op_button(item);
    htm += ' </div>';
    htm += ' </div>';
    htm += '<div class="p10">';
    htm += ' <div class="row pro-info-list">';
    htm += '  <div class="col-xs-7">';
    htm += '  <div class="PI-con">';
    htm += '   <div class="pr info-con">';

    var imgPath = item.capa.imgPath || "skins/default/images/back-pro-img.gif";

    htm += ' <i class="pro-img-pa pa"><img src="' + imgPath + '" width="70px" height="70px"></i>';
    htm += '  <h5 class="fb">' + item.capa.name + '</h5>';
    htm += '  <p class="mb5 cutword">' + item.capa.desc + '</p>';
    htm += '   <p class="text-blueinfo">开发厂家：浪潮通信信息技术有限公司</p>';
    htm += '  </div>';
    htm += '   </div>';
    htm += ' </div>';
    htm += '  <div class="col-xs-1">';
    htm += '  <div class="PI-con">';
    htm += '   <div class="info-con-text tc">' + item.capa.version + '</div>';
    htm += '  </div>';
    htm += ' </div>';

    htm += '  <div class="col-xs-2">';
    htm += '  <div class="PI-con">';
    htm += '   <div class="info-con-text tc">' + item.siUser + '</div>';
    htm += '  </div>';
    htm += ' </div>';

    htm += '  <div class="col-xs-2">';
    htm += '   <div class="PI-con">';
    htm += '   <div class="info-con-text tc">' + item.endDate + '</div>';
    htm += '  </div>';
    htm += '  </div>';

    htm += ' </div>';
    htm += ' </div>';
    htm += '</div>';

    return htm + "\n";
}

// 展示空数据
function showNullInfo(msg) {

    msg = msg || "查询记录为空";

    var htm = '';
    htm += '<div class="panle clearfix">';
    htm += '<div style="text-align: center; margin-top:15px">';
    htm += msg;
    htm += ' </div>';
    htm += '</div>';

    $("#list").html(htm);
}

//按钮操作
function op_button(item) {
    var htm = '';
    htm += '<a  class="btn btn-warning btn-sm pa titlebtn-right" href="javascript:showApprove(' + item.id + ',1);" >&nbsp;订阅审核&nbsp;</a>';

    return htm;

}

function stateDecode(value) {
    if (value == 0) {
        return "已注销";
    } else if (value == 1) {
        return "已上线";
    } else if (value == 2) {
        return "新注册";
    } else if (value == 3) {
        return "上线申请中";
    } else if (value == 4) {
        return "注销申请中";
    } else if (value == 5) {
        return "上线驳回";
    } else if (value == 6) {
        return "注销驳回";
    }
}


// 检索框
function query(value, name) {
    var keyType = $("#key_type").val();

    var keyValue = $("#key_value").val();


    var p = {};
    p[keyType] = keyValue;

    queryReset();

    queryCapaSubInfo(p);
}

//新的查询时 查询参数重置
function queryReset() {

    pageNum = 1;
    createPageFlag = 0;
}

var layerId;

// 订阅审核的弹出层
function showApprove(id, type) {

    var htm = '';// 要显示的窗口
    htm += '<div class="edit-form-box" style="width:90%">';
    htm += ' <form class="form-horizontal" method="post" id="noticeForm">';
    htm += '<input type="hidden" name="id" id="id" value="' + id + '"/>';
    htm += ' <ul class="edit-form-list">';
    htm += '  <li>';
    htm += '   <div class="form-group">';
    htm += '    <label for="name_id" class="col-xs-3 control-label">审核结果:</label>';
    htm += '  	<div class="col-xs-7">';
    htm += '      	<label class="radio-inline">';
    htm += '  			<input type="radio" name="state" id="inlineRadio1" value="1" checked="checked"> 通过';
    htm += ' 			</label>';
    htm += '  		<label class="radio-inline">';
    htm += '     			<input type="radio" name="state" id="inlineRadio2" value="5"> 驳回';
    htm += '  		</label>';
    htm += '		</div>';
    htm += '	</div>';
    htm += ' 	</li>';
    htm += '  <li>';
    htm += '   <div class="form-group">';
    htm += '    <label for="subMonths" class="col-xs-3 control-label">开通周期(月):</label>';
    htm += '  	<div class="col-xs-7">';
    htm += '      	<select class="form-control" id="subMonths">';
    for (var i = 1; i <= 36; i++) {
        htm += '			<option value="' + i + '">' + i + '</option>';
    }
    htm += '			</select>';

    htm += '		</div>';
    htm += '	</div>';
    htm += ' 	</li>';

    htm += ' <li>';
    htm += ' <div class="form-group">';
    htm += '   <label for="advice" class="col-xs-3 control-label">审核意见:</label>';
    htm += '  <div class="col-xs-7">';
    htm += '   <textarea class="form-control" rows="4" name="advice" id="advice" ></textarea>';
    htm += '  </div>';
    htm += '  </div>';
    htm += '  </li>';

    htm += '<li>';
    htm += ' <div class="form-group">';
    htm += ' <label for="inputEmail3" class="col-xs-2 control-label"></label>';
    htm += ' <div class="col-xs-10">';
    htm += ' <a type="submit" class="btn btn-info w100 mr20" href="javascript:subApprove()">提交</a>';
    htm += ' </div>';
    htm += ' </div>';
    htm += '  </li>';

    htm += ' </ul>';
    htm += ' </form>';
    htm += ' </div> ';


    layerId = layer.open({
        title: "订阅审核",
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['620px', '400px'], //宽高
        content: htm
    });

}

//上线审核
function subApprove() {
    var id = $("#id").val();
    var advice = $("#advice").val();
    var v = $("input:checked").val();
    var subMonths = $("#subMonths").val();
    $.ajax({
        url: "capa/capaSubApprove.do",
        type: "POST",
        async: false,
        data: {
            id: id,
            advice: advice,
            state: v,
            subMonths: subMonths
        },
        cache: false,
        success: function (r) {
            layer.close(layerId);
            layer.msg("订阅审核成功", {icon: 6});
            queryCapaSubInfo();
        },
        error: function () {
            layer.close(layerId);
            layer.msg("服务异常", {icon: 5});
        }
    });
}

