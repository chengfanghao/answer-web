$(document).ready(function () {
    var config = {
        postPath: {
            "选择题": "singleChoice",
            "填空题": "blank",
            "判断题": "judge",
            "问答题": "essay"
        },
        paperInfo: {
            paperName: "",
            time: 120
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

    //定时器
    function timer(intDiff) {
        //无延迟
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $('#hourShow').html('<s id="h"></s>' + hour + ':');
        $('#minuteShow').html('<s></s>' + minute + ':');
        $('#secondShow').html('<s></s>' + second);
        intDiff--;

        $("#timer").css("display", "block");

        window.setInterval(function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;
            if (intDiff > 0) {
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            $('#hourShow').html('<s id="h"></s>' + hour + ':');
            $('#minuteShow').html('<s></s>' + minute + ':');
            $('#secondShow').html('<s></s>' + second);
            intDiff--;
        }, 1000);
    }

    //加载试卷列表
    $.get(`${config.baseUrl}/examinationPaper/allExaminationPaper`, function (data, status) {
        console.log(data);
        var innerHtml = ``;
        for (var examinationPaper in data) {
            innerHtml += `
                <tr>
                    <td>${data[examinationPaper][0]}</td>
                    <td>${data[examinationPaper][1]}</td>
                    <td><a class="exam-operations" data-examname="${data[examinationPaper][0]}" data-time="${data[examinationPaper][1]}">开始答题</a></td>
                </tr>
            `;
        }
        $("#examinationPaperContent").html(innerHtml);

        //绑定加载试题事件
        $('.exam-operations').click(function () {
            //隐藏表格
            $('#examinationPaperList').css("display", "none");
            var name = $(this).data("examname");
            config.paperInfo.paperName = name;
            config.paperInfo.time = parseInt($(this).data("time"));
            $.get(`${config.baseUrl}/examinationPaper/getPaper/${name}`, function (data, status) {
                console.dir(data);

                var singleChoices = data[0],
                    blanks = data[1],
                    judges = data[2],
                    essays = data[3];

                //填充选择题,分三种形式，选项最大长度：10字符，一行4个；20字符，一行2个；其他，一行一个
                var choiceContent = ``;
                for (var i = 0; i < singleChoices.length; i++) {
                    var maxLength = Math.max(singleChoices[i].choiceA.length, singleChoices[i].choiceB.length,
                        singleChoices[i].choiceC.length, singleChoices[i].choiceD.length);
                    if (maxLength <= 10) {
                        choiceContent += `<div>
                        <p>${i + 1}.${singleChoices[i].titleName}</p>
                        <p><span class="col-md-3"><input type="radio" name="singleChoice${i + 1}" required>A.${singleChoices[i].choiceA}</span>
                        <span class="col-md-3"><input type="radio" name="singleChoice${i + 1}" required>B.${singleChoices[i].choiceB}</span>
                        <span class="col-md-3"><input type="radio" name="singleChoice${i + 1}" required>C.${singleChoices[i].choiceC}</span>
                        <span class="col-md-3"><input type="radio" name="singleChoice${i + 1}" required>D.${singleChoices[i].choiceD}</span>
                        </p></div><br>`;
                    } else if (maxLength <= 20) {
                        choiceContent += `<div>
                        <p>${i + 1}.${singleChoices[i].titleName}</p>
                        <p><span class="col-md-6"><input type="radio" name="singleChoice${i + 1}" required>A.${singleChoices[i].choiceA}</span>
                        <span class="col-md-6"><input type="radio" name="singleChoice${i + 1}" required>B.${singleChoices[i].choiceB}</span></p>
                        <p><span class="col-md-6"><input type="radio" name="singleChoice${i + 1}" required>C.${singleChoices[i].choiceC}</span>
                        <span class="col-md-6"><input type="radio" name="singleChoice${i + 1}" required>D.${singleChoices[i].choiceD}</span></p>
                        </div><br>`;
                    } else {
                        choiceContent += `<div>
                        <p>${i + 1}.${singleChoices[i].titleName}</p>
                        <p><input type="radio" name="singleChoice${i + 1}" required>A.${singleChoices[i].choiceA}</p>
                        <p><input type="radio" name="singleChoice${i + 1}" required>B.${singleChoices[i].choiceB}</p>
                        <p><input type="radio" name="singleChoice${i + 1}" required>C.${singleChoices[i].choiceC}</p>
                        <p><input type="radio" name="singleChoice${i + 1}" required>D.${singleChoices[i].choiceD}</p>
                        </div><br>`;
                    }
                }
                $("#singleChoiceRegion").html(choiceContent);

                //填充填空题
                var blankContent = ``;

                for (var i = 0; i < blanks.length; i++) {
                    var titleNameArr = (blanks[i].titleName).split('_');
                    blankContent += `<div><p><span>${i + 1}.</span>`;
                    for (var subName in titleNameArr) {
                        //判断不为空
                        if (titleNameArr[subName].length > 0) {
                            if (subName == titleNameArr.length - 1) {
                                blankContent += `<span>${titleNameArr[subName]}</span>`;
                            } else {
                                blankContent += `<span>${titleNameArr[subName]}<input class="blank-input" name="blank${i}-${subName}"></span>`;
                            }

                        }
                    }
                    blankContent += `</p></div><br>`;
                }
                $("#blankRegion").html(blankContent);
                //填空题输入框根据文字变长
                $('.blank-input').bind('input propertychange', function () {
                    var textLength = $(this).val().length;//获取当前文本框的长度
                    var currentWidth = parseInt(textLength) * 18;//18是字符的大小
                    $(this).css("width", currentWidth + "px");
                });

                //填充判断题
                var judgeContent = ``;
                for (var i = 0; i < judges.length; i++) {
                    judgeContent += `<div>
                    <p>${i + 1}.${judges[i].titleName}</p>
                    <span><input type="radio" name="judge${i + 1}" required>正确</span>
                    <span><input type="radio" name="judge${i + 1}" style="margin-left: 20px" required>错误</span>
                    </div><br>`;
                }
                $("#judgeRegion").html(judgeContent);

                //填充问答题
                var essayContent = ``;
                for (var i = 0; i < essays.length; i++) {
                    essayContent += `<div>
                    <p>${i + 1}.${essays[i].titleName}</p>
                    <textarea rows="5" required></textarea>
                    </div><br>`;
                }
                $("#essayRegion").html(essayContent);

                //显示试卷
                $("#paperForm").css("display", "block");

                //计时开始
                timer((config.paperInfo.time) * 60);
            });
        });
    });

})
;


