$(function(){
	$("#exam-apply-acceptProtocolBtn").click(exam_apply_onAcceptProtocolBtnClick);

	$("#exam-apply-examRegion").change(exam_apply_onExamRegionChange);
	
	$("#exam-apply-dtl-from-returnBtn").click(exam_apply_dtl_onReturnBtnClick);
	
	
	$("#exam-apply-dtl-from").on('submit', exam_apply_onExamApplyDtlFormSubmit);
	
});

function exam_apply_dtl_onReturnBtnClick(){
	exam_apply_checkAndChgToManageStudentList();
	return false;
}

function exam_apply_dtl_isFromAdminChgInfo(){
	return $("#exam_apply-dtl-form-flag").val() == 'adminChgInfo';
}

function exam_apply_checkAndChgToManageStudentList(){
	if(!exam_apply_dtl_isFromAdminChgInfo()){
		return;
	}
	
	comm_ui_show($("#student-manage-list-div"));
	$("#student-manage-second-page-div").empty();
}

function exam_apply_onExamApplyDtlFormSubmit(){
	
	if(exam_apply_dtl_isFromAdminChgInfo()){
		var submitForm = $("#exam-apply-dtl-from");
		var adminUrl = submitForm.data("admin-save-exam-apply-info-url");
		submitForm.attr("action", adminUrl);
		exam_apply_onExamInfoConfirmOk();
		return false;
	}

	try{
		var param = {};

		var reqData = $("#exam-apply-dtl-from").serialize();

		param.reqData = reqData;
		param.callback = function(isSuccess, data){
			if(!isSuccess){
				return;
			}

			var confirmWinParam = {};
			confirmWinParam.title = "请确认报名信息，报名提交后将无法修改。";
			confirmWinParam.confirmCallback = exam_apply_onExamInfoConfirmOk;
			comm_ui_showConfirm(data, confirmWinParam);
		}
	    comm_Ajax_post($("#exam-apply-confirm-dtl-link").attr("href"), param);
	}catch (e) {
		comm_ui_showMessage("请求出错。");
	}

	return false;
}


function exam_apply_onExamInfoConfirmOk(){
	var param = {};
	param.submitBtnId = "exam-apply-dtl-from-submitBtn";
	param.callback = function(isSuccess, data){
	comm_ui_showMessage("1");
		if(isSuccess){
			if("Success" != data){
			    comm_ui_showMessage("2");
				comm_ui_showMessage(data);
				return;
			}
			
			if(exam_apply_dtl_isFromAdminChgInfo()){
				comm_ui_showMessage("修改成功");
			}else{
				comm_ui_showMessage("报名成功");
				$("#main-side-nav-exam-apply-link").click();
			}
		}
	}
	

	comm_Ajax_submitForm("exam-apply-dtl-from", param);
}

function exam_apply_onExamRegionChange(){
	var curSelectVal = $("#exam-apply-examRegion").val();
	
	var placeSelectObj = $("#exam-apply-examPlaceId");
	
	
	var param = {};
	param.reqData = {regionId: curSelectVal};
	
	param.callback = function(isSuccess, data){
		if(!isSuccess){
			return;
		}
		
		var html = "";
		for(var i = 0; i < data.length; ++i){
			//"<option value='0'>选项1</option>"
			var place = data[i];
			html = html + "<option value='" + place.id + "'>" + place.name + "</option>";
		}
		placeSelectObj.html(html);
	}
    
	var url = placeSelectObj.data("get-data-url");
    comm_Ajax_post(url, param);
}

function exam_apply_onAcceptProtocolBtnClick(){
	comm_ui_hide($("#exam-apply-protocol-div"));
	comm_ui_show($("#exam-apply-dtl-info-div"));
}
