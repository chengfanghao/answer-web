$(document).ready(function () {
    var config = {
        postPath: {
            "选择题": "singleChoice",
            "填空题": "blank",
            "判断题": "judge",
            "问答题": "essay"
        },
        baseUrl: "http://localhost:8080"
    };

    //初始化菜单
    $('.navMenu li a').on('click', function () {
        //获取当前页签的父级的父级
        var parent = $(this).parent().parent();
        var labeUl = $(this).parent("li").find(">ul");
        if ($(this).parent().hasClass('open') == false) {
            //展开未展开
            //parent.find('ul').slideUp(300);
            //parent.find("li").removeClass("open");
            //parent.find('li a').removeClass("active").find(".arrow").removeClass("open");
            $(this).parent("li").addClass("open").find(labeUl).slideDown(300);
            $(this).addClass("active").find(".arrow").addClass("open");
        } else {
            $(this).parent("li").removeClass("open").find(labeUl).slideUp(300);
            if ($(this).parent().find("ul").length > 0) {
                $(this).removeClass("active").find(".arrow").removeClass("open");
            } else {
                $(this).addClass("active");
            }
        }
    });

    //表单提交
    $("#requestForm").submit(function (envent) {
        //根据试卷类型，设置路径
        var postPath = config.postPath[$("#questionType").val()],
            postData = null;
        //根据试卷类型，获取相应的表单数据
        if (postPath == "singleChoice") {
            postData = {
                questionLevel: $('#questionLevel').val(),
                testSubject: $('#testSubject').val(),
                questionSource: $('#questionSource').val(),
                questionStatus: $('#questionStatus').val(),
                titleName: $('#titleName').val(),
                choiceAnswer: $('input:radio:checked').val(),
                choiceA: $('#choiceA').val(),
                choiceB: $('#choiceB').val(),
                choiceC: $('#choiceC').val(),
                choiceD: $('#choiceD').val(),
                questionAnalysis: $('#questionAnalysis').val()
            }
        } else if (postPath == "blank" || postPath == "essay") {
            postData = {
                questionLevel: $('#questionLevel').val(),
                testSubject: $('#testSubject').val(),
                questionSource: $('#questionSource').val(),
                questionStatus: $('#questionStatus').val(),
                titleName: $('#titleName').val(),
                blankAnswer: $('#blankAnswer').val(),
                questionAnalysis: $('#questionAnalysis').val()
            }
        } else if (postPath == "judge") {
            postData = {
                questionLevel: $('#questionLevel').val(),
                testSubject: $('#testSubject').val(),
                questionSource: $('#questionSource').val(),
                questionStatus: $('#questionStatus').val(),
                titleName: $('#titleName').val(),
                judgeAnswer: $('input:radio:checked').val(),
                questionAnalysis: $('#questionAnalysis').val()
            }
        }

        envent.preventDefault();
        var form = $(this);
        $.ajax({
            url: `${config.baseUrl}/${postPath}/add`,
            type: form.attr("method"),
            contentType: "application/json",
            data: JSON.stringify(postData),
            dataType: "text",
            beforeSend: function () {
                console.dir(postData);
            },
            error: function () {
                console.log("失败");
            },
            complete: function () {
                console.log("完成");
            },
            success: function (data) {
                alert("录入成功");
            }
        });
    });

    //标识当前应添加符号的输入框
    $("#requestForm .form-control").click(function () {
        $("#requestForm .form-control").removeClass("cfh-active-input");
        $(this).addClass("cfh-active-input");
    });
    $(".cfh-span-sign").click(function () {
        $("#signTable").modal('hide');
        if ($(".cfh-active-input").length != 0) {
            var currentControlVal = $(".cfh-active-input").val();
            $(".cfh-active-input").val(currentControlVal + $(this).text());
            $(".cfh-active-input").removeClass("cfh-active-input");
        } else {
            alert("请点击需要插入符号的输入框");
        }
        //阻止冒泡上层click
        event.stopPropagation();
    });

    //选择试题类型，显示相应详情
    $("#questionType").change(function () {
        //$(".request-detail").css("display","none");
        $(".request-detail").remove();
        if ($(this).val() == "选择题") {
            $("#requestTitle").after(`
            <div id="singleChoiceRequest" class="request-detail">
                <div class="form-group">
                    <label class="form-label" for="choiceA">选项A:</label>
                    <input type="radio" name="choiceAnswer" value="A" required>
                    <input type="text" class="form-control cfh-inline-form-control" name="choiceA" id="choiceA" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="choiceB">选项B:</label>
                    <input type="radio" name="choiceAnswer" value="B" required>
                    <input type="text" class="form-control cfh-inline-form-control" name="choiceB" id="choiceB" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="choiceC">选项C:</label>
                    <input type="radio" name="choiceAnswer" value="C" required>
                    <input type="text" class="form-control cfh-inline-form-control" name="choiceC" id="choiceC" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="choiceD">选项D:</label>
                    <input type="radio" name="choiceAnswer" value="D" required>
                    <input type="text" class="form-control cfh-inline-form-control" name="choiceD" id="choiceD" required>
                </div>
            </div>`);
            //$("#singleChoiceRequest").css("display","block");
        } else if ($(this).val() == "填空题" || $(this).val() == "问答题") {
            $("#requestTitle").after(`
                <div id="blankRequest" class="form-group request-detail">
                    <label class="textarea-lable" for="requestAnswer">试题答案:</label>
                    <textarea class="form-control cfh-inline-form-control" rows="5" name="blankAnswer" id="blankAnswer" required></textarea>
                </div>`);
            //$("#blankRequest").css("display","block");
        } else {
            $("#requestTitle").after(`
                <div id="judegeRequst" class="form-group request-detail">
                    <label>判断选项:</label>
                    <div class="inline-block">
                        <input type="radio" name="judgeAnswer" value="正确" required>正确&nbsp&nbsp
                        <input type="radio" name="judgeAnswer" value="错误" required>错误
                    </div>
                </div>`);
            //$("#judegeRequst").css("display","block");
        }
    });

});
