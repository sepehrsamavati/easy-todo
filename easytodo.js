const dbChanged=false;
let DB={
	'version':'2.3.2',
	'name':'',
	'done':0,
	'list':[],
	'column':false,
	'direction':false,
	'chosen':null,
	'password':null,
	'theme':0
},mode=0,i,deleted=[],deleteBusy=false;
var thisVersion=DB["version"];
let colors=["rgb(0, 116, 217)","rgb(217, 0, 70)","rgb(234, 123, 0)","rgb(0, 217, 90)","rgb(162, 162, 162)","rgb(232, 209, 0)"];
for(i=0;i<colors.length;i++)
{
	let labelSpan = document.createElement("span");
	labelSpan.style.backgroundColor=colors[i];
	labelSpan.onclick = function(){
		if($("#pwd").hasClass('active'))
		{
			DB["list"][DB["chosen"]]["color"]=$(this).index();
			$(".card:eq("+DB["chosen"]+")").css("background-color",colors[DB["list"][DB["chosen"]]["color"]]);
		}
		else
		{
			DB["chosen"]=$(this).index();
		}
	};
	document.getElementById("label").appendChild(labelSpan);
}

function openNav() {
	$(".card").addClass("hasTransition");
	$("#sidenav,#main").addClass('active');
	hideMessage(true);
}

function closeNav(isButton) {
	$(".card").addClass("hasTransition");
	$("#sidenav,#main").removeClass("active");
	setTimeout(function(){
		$(".card").removeClass("hasTransition");
	},500);
	if(isButton)
	{
		hideMessage();
	}
}

function refresh(dontScroll, isAdded, refreshId)
{
	if(isAdded) /* add a card */
	{
		indexCard(DB["list"].length-1, true);
	}
	else if (refreshId !== undefined) /* refresh a card */
	{
		indexCard(refreshId, null, true);
	}
	else /* refresh all cards */
	{
		$("#list").html('');
		for (i=0;i<DB["list"].length;i++)
		{
			indexCard(i);
		}
	}
	$(".card > p").on("click",function(){
		if(!$("#main").hasClass('active'))
		{
			viewCard(this);
		}
	});
	if(!dontScroll)
	{
		document.getElementById("list").scrollTo(0,document.getElementById("list").scrollHeight);
	}
	saveData();
}

function indexCard(i, effect, refresh)
{
	let card,paragraph;
	card = document.createElement("div");
	$(card).css("background-color",colors[DB["list"][i]["color"]]);
	card.classList.add("card");
	paragraph = document.createElement("p");
	paragraph.textContent = DB["list"][i]["text"];
	card.appendChild(paragraph);
	if(DB["list"][i]["password"]!=null)
	{
		if(DB["list"][i]["password"]!=".")
		{
			card.classList.add("isLock");
			paragraph.textContent = '';
		}
		let i1=document.createElement("i");
		i1.classList.add("fa","fa-lock");
		i1.onclick=function(){
			lockFunc(this);
		};
		card.appendChild(i1);
	}
	else
	{
		let i1=document.createElement("i"),i2=document.createElement("i");
		i1.classList.add("fa","fa-sort");
		i2.classList.add("fa","fa-check");
		i2.onclick=function(){
			deleteItem(this);
		};
		card.appendChild(i1);
		card.appendChild(i2);
	}
	if(effect) /* fade in effect */
	{
		card.style.opacity=0;
	}
	document.getElementById("list").appendChild(card);
	if(refresh)
	{
		$(card).insertAfter($(".card").eq(i));
		$(".card").eq(i).remove();
	}
	$(card).delay(230).fadeTo(500, 1);
}

function editCard(element)
{
	mode=6;
	if(!$(element).next().hasClass('fa-lock'))
	{
		DB["chosen"]=$(element).parent().index();
		message("Rename or change color:\nTap the plus to submit");
		$("#label,#pwd,#mainInput").addClass('active');
		$("#mainInput").val($(element).text());
		typed();
	}
}

function viewCard(element)
{
	DB["chosen"]=$(element).parent().index();
	$("#label,#pwd").removeClass('active');
	if(!$(element).next().hasClass('fa-lock'))
	{
		$("#edtcrd").addClass('active');
		$("#edtcrd").on("click",function(){
			editCard(element);
		});
	}

	let time='';
	if(DB["list"][DB["chosen"]]["date"] !== undefined)
	{
		let toDay=86400000, toHours=3600000, toMin=60000, timeDiff=new Date()-new Date(DB["list"][DB["chosen"]]["date"]);
		if(timeDiff/toHours>1&&timeDiff/toHours<30)
		{
			time='Added <span class="messageBoxData">'+Math.round(timeDiff/toHours)+'h</span> ago';
		}
		else if(timeDiff/toMin>3&&timeDiff/toMin<60)
		{
			time='Added <span class="messageBoxData">'+Math.round(timeDiff/toMin)+'m</span> ago';
		}
		else if(timeDiff/toDay>1&&timeDiff/toDay<60)
		{
			time='Added <span class="messageBoxData">'+Math.round(timeDiff/toDay)+'d</span> ago';
		}
		else
		{
			time="Added just now!";
		}
	}

	$("#messageText").html("<span style='border-color:"+colors[DB["list"][DB["chosen"]]["color"]]+";' id='boxTitle' class='messageBoxData'></span>"+time+"<br><span class='messageBoxData'>"+($(element).next().hasClass('fa-lock-open')?"Password protected":"Not protected")+"</span>");
	$("#boxTitle").text(DB["list"][DB["chosen"]]["text"]);
	showMessage();
}

function addToList(text,color)
{
	if(text===undefined||color===undefined) /* read input */
	{
		var inputValue=$("#mainInput").val();
		if(inputValue.length>0&&mode==0) /* add input value */
		{
			if(searchInObject(DB["list"],"text",inputValue)==-1) /* if unique */
			{
				$("#mainInput").val('');
				$("#addInput").removeClass('active');
				DB["list"].push({'text':inputValue,'color':(DB["chosen"]?DB["chosen"]:DB["theme"]),'password':null,'date':new Date()});
				refresh(null, true);
			}
		}
		else if(inputValue.length>0&&mode!=0) /* command handler */
		{
			switch(mode)
			{
				case 1:
					switch (inputValue.toLowerCase())
					{
						case 'skip':
							DB["name"]='.';
						break;
						default:
							DB["name"]=inputValue;
						break;
					}
				break;
				case 2:
					if(inputValue=="Yes")
					{
						if(localStorage)
						{
							localStorage.removeItem("theToDo_DB2");
							window.location='';
							return;
						}
					}
				break;
				case 3:
					if(inputValue=="Yes")
					{
						DB["done"]=0;
						saveData();
						window.location='';
					}
				break;
				case 5:
					DB["name"]=inputValue;
				break;
				case 6:
					if(searchInObject(DB["list"],"text",inputValue)==-1&&!isNaN(parseInt(DB["chosen"])))
					{
						$("#mainInput").val('');
						$("#addInput").removeClass('active');
						DB["list"][DB["chosen"]]["text"]=inputValue;
						$(".card:eq("+DB["chosen"]+")").children('p').text(inputValue);
					}
					else
					{
						message("Already exists!");
					}
				break;
				case 7:
					if(!isNaN(parseInt(DB["chosen"])))
					{
						if(DB["list"][DB["chosen"]]["password"]==inputValue)
						{
							lockFunc(null,DB["chosen"]);
						}
						else
						{
							$("#mainInput").blur();
							$("#redScreen").fadeTo(400, 1, function() {
								$(this).fadeTo(300, 0, function() {
									$(this).hide();
								});
							});
						}
					}
				break;
				case 8: /* remove change add password */
					if(inputValue==" "||inputValue=="null")
					{
						inputValue=null;
					}
					DB["list"][DB["chosen"]]["password"]=inputValue;
					refresh(null, null, DB["chosen"]);
				break;
				case 9:
					if(inputValue=="OK")
					{
						DB["version"]=thisVersion;
					}
				break;
				case 10:
					if(jsaHash(inputValue)==DB["password"])
					{
						if(DB["chosen"]=="changePass")
						{
							$("#mainInput").val('');
							message("Enter a new password:",true);
							mode=11;
							return;
						}
						else
						{
							downloadDB();
							closeNav(true);
						}
					}
				break;
				case 11:
					DB["password"]=jsaHash(inputValue);
				break;
			}
		}
	}
	else /* undo delete */
	{
		if(searchInObject(DB["list"],"text",text)==-1)
		{
			DB["list"].push({'text':text,'color':color,'password':null,'date':new Date()});
			DB["done"]--;
			refresh(null, true);
		}
	}
	DB["chosen"]=null;
	hideMessage();
}
function deleteItem(item)
{
	if(!$("#main").hasClass('active')&&!deleteBusy)
	{
		deleteBusy=true;
		var element=$(item);
		element.parent().hide(300,function(){
			$(this).remove();
		});
		element.prev().hide(200);
		element.hide(200);
		setTimeout(function(){deleteBusy=false;},200);
		let id=element.parent().index();
		deleted=[DB["list"][id]["text"],DB["list"][id]["color"]];
		DB["list"].splice(id,1);
		DB["done"]++;
		$("#uDT").addClass("active");
		saveData();
	}
}

$("#mainInput").on("focus",function(){
	if(DB["chosen"]==null&&!$("#label").hasClass('active'))
	{
		$("#label").addClass('active');
		message("Task label color");
	}
	$(this).css("color",changeTheme(null,true)[1]);
});
$("#mainInput").on("focusout",function(){
	$(this).css("color","rgba(255, 255, 255, 0.21)");
});

function passwordChange()
{
	$("#label,#pwd").removeClass('active');
	$("#mainInput").val('');
	typed();
	mode=8;
	message("Enter the new password:\n\nSpace: remove password\nDot: lock sort, check and edit",true,true);
}

function lockFunc(element,id)
{
	if(element&&!id)
	{
		if($(element).hasClass('fa-lock'))
		{
			mode=7;
			DB["chosen"]=$(element).parent().index();
			message("Enter password:",true,true);
		}
		else
		{
			refresh(true, null, $(element).parent().index());
		}
	}
	else if(element==null)
	{
		$(".card:eq("+id+")").children('.fa-lock').removeClass('fa-lock').addClass('fa-lock-open');
		$(".card:eq("+id+")").children('p').text(DB["list"][id]["text"]);
		let theParent = document.querySelectorAll(".card")[id];
		theParent.classList.remove("isLock");
		let i1=document.createElement("i"),i2=document.createElement("i");
		i1.classList.add("fa","fa-sort");
		i2.classList.add("fa","fa-check");
		i2.onclick=function(){
			deleteItem(this);
		};
		theParent.appendChild(i1);
		theParent.appendChild(i2);
	}
}

function arrayMove(arr, fromIndex, toIndex) {
	let element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
	saveData();
}

function searchInObject(array,attr,toSearch)
{
	for(i=0;i<array.length;i++)
	{
		if(array[i][attr]==toSearch)
		{
			return i;
		}
	}
	return -1;
}

function typed()
{
	if($("#mainInput").val().length>0)
	{
		$("#addInput").addClass('active');
	}
	else
	{
		$("#addInput").removeClass('active');
	}
}
$(document).keypress(function(e) { /* press key */
	if(e.which == 13) /* press enter */
	{
		addToList();
	}
});
$("#addInput").on("click",function(){
	addToList();
});
function saveData()
{
	if (typeof(Storage) !== undefined) {
		localStorage.setItem("theToDo_DB2", JSON.stringify(DB));
		return true;
	} else {
		return false;
	}
}
function loadData()
{
	if (typeof(Storage) !== undefined) {
		var newDB = localStorage.getItem("theToDo_DB2");
		if(newDB)
		{
			DB=JSON.parse(newDB);
			if(DB["column"])
			{
				$("#list").addClass('twoColumn');
			}
			if(DB["direction"])
			{
				$("#list").addClass('direction');
			}
			refresh(true);
			changeTheme(true);
			if(dbChanged)
			{
				if(parseInt(DB["version"][0]+DB["version"][2]+DB["version"][4])<parseInt(thisVersion[0]+thisVersion[2]+thisVersion[4]))
				{
					mode=9;
					message("The app database structure has been updated/changed and you need to reset your data (manually)!\nEnter 'OK' if you got it.", true);
				}
			}
			return true;
		}
		else if(saveData()){
			loadData();
		}
	} else {
		return false;
	}
}

setTimeout(function(){
	if(mode==0)
	{
		var userName='';
		if(DB['name']!='.'&&DB['name'].length>0)
		{
			userName="Hi "+DB["name"]+"\n";
		}
		switch(DB["done"])
		{
			case 0:
				$("#stats").text(userName+"No task completed!");
			break;
			case 1:
				$("#stats").text(userName+"1 task completed!");
			break;
			default:
				$("#stats").text(userName+DB["done"]+" tasks completed!");
			break;
		}
		$("#stats").fadeTo(500,1);
		setTimeout(function(){
			$("#stats").fadeTo(500,0,function(){
				$(this).css("display","none");
			});
		},6000);
	}
},4000);

loadData(); /* app start */

if(DB["name"].length==0)
{
	mode=1;
	message("Welcome to Easy ToDo.\nA super easy to use todo list. Just type in the field box and tap the plus button. Your data is saved locally on your device.\nNow enter your name or type 'Skip':",true);
}

new Sortable(list, {
	handle: '.fa-sort',
	animation: 150,
	onChoose: function (evt){
		$(evt['item']).addClass("active");
	},
	onUnchoose: function (evt){
		$(evt['item']).removeClass("active");
	},
	onUpdate: function (evt) {
		arrayMove(DB["list"], evt.oldIndex, evt.newIndex);
	}
});

$("#main").on("click",function(){
	if(document.getElementById("main").classList.contains('active'))
	{
		closeNav();
	}
});
$(".fa-bars").on("click",function(event){
	event.stopPropagation();
	openNav();
});

function showMessage(){
	$("#blackSection").fadeTo(300,1);
	$("#blackSection > #messageBox").delay(200).fadeTo(300,1);
}
function message(content,focus,keepchosen){
	$("#edtcrd").removeClass('active');
	$("#messageText").text(content);
	if(focus)
	{
		if(!keepchosen)
		{
			DB["chosen"]="empty";
		}
		// if([7,8,10,11].includes(mode))
		// {
		// 	$("#mainInput").attr("type","password");
		// }
		$("#mainInput").focus();
	}
	if($("#blackSection").css("display")=="none"||$("#messageBox").css("display")=="none")
	{
		showMessage();
	}
}
function hideMessage(isMenu){
	DB["chosen"]=null;
	mode=0;
	$("#mainInput").val('');
	//$("#mainInput").attr("type","text");
	if(!isMenu)
	{
		$("#addInput,#mainInput").removeClass('active');
		$("#blackSection").fadeTo(300,0,function(){
			saveData();
			$(this).css("display","none");
		});
	}
	else
	{
		$("#messageBox").hide(200);
		$("#blackSection").fadeTo(500,0.7);
	}
	setTimeout(function(){
		$("#label,#pwd").removeClass('active');
	},500);
}

function changeTheme(justLoad,returnCurrentColor)
{
	if(!justLoad&&!returnCurrentColor)
	{
		DB["theme"]++;
	}
	let colorA="#7FDBFF",colorB="#0074D9",colorC="#001f3f",colorD="#001a31";
	switch(DB["theme"])
	{
		case 1:
			colorA="#ffcfcf";
			colorB="#d93500";
			colorC="#421000";
			colorD="#2b0b00";
		break;
		case 2:
			colorA="#ffbe8c";
			colorB="#ff6e00";
			colorC="#954100";
			colorD="#753200";
		break;
		case 3:
			colorA="#85ff9b";
			colorB="#00b91f";
			colorC="#1c5e27";
			colorD="#002807";
		break;
		case 4:
			colorA="#959595";
			colorB="#959595";
			colorC="#2d2d2d";
			colorD="#3e3e3e";
		break;
		case 5:
			colorA="#ffe889";
			colorB="#5b4a00";
			colorC="#d2aa00";
			colorD="#886e00";
		break;
		default:
			DB["theme"]=0;
		break;
	}
	if(!returnCurrentColor)
	{
		saveData();
		$("#sidenav a, #sidenav button, #iDB, #mainInput.active, #addInput").css("color",colorA);

		$("#mainInput.active").css("border-color",colorB);
		$("#addInput").css("background-color",colorB);
		$(".fa-bars").css("color",colorB);

		$("meta[name='theme-color']").attr("content",colorC);
		$("body,#panel").css("background-color",colorC);
		$("#panel").css("box-shadow","0 0 9vw "+colorC);

		$("#sidenav").css("background-color",colorD);
	}
	else
	{
		return [colorA,colorB,colorC,colorD];
	}
}

function downloadDB()
{
	function download(filename, text)
	{
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
	download("EasyToDo_"+(new Date()).toISOString().replace(/z|t/gi,' ').trim()+".txt",JSON.stringify(DB));
}

function importData()
{
	let file = document.getElementById("fileInput").files[0];
	let textType = /text.*/;

	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function() {
			try {
				DB=JSON.parse(reader.result);
				message("Data imported successfully!");
				refresh(true);
			}
			catch {
				message("There was an error while reading data!");
				$("#redScreen").fadeTo(400, 1, function() {
					$(this).fadeTo(300, 0, function() {
						$(this).hide();
					});
				});
			}
		}

		reader.readAsText(file);
	}
}

/* Close message box by clicking outside of it */
$("#messageBox").on("click",function(e){
	e.stopPropagation();
});
$("#blackSection").on("click",function(){
	hideMessage();
});

/* Handle menu buttons */
$("#sidenav button").on("click",function(){
	if(mode==0)
	{
		closeNav();
		switch(this.id)
		{
			case "rDB":
				mode=2;
				message("Are you sure you want to delete all data?!\nEnter 'Yes' to continue:",true);
			break;
			case "rCR":
				mode=3;
				message("Are you sure you want to reset counter to zero?!\nEnter 'Yes' to continue:",true);
			break;
			case "about":
				mode=-1;
				message("Easy ToDo v"+thisVersion+"\nA super easy to use todo list. Just type in the field box and tap the plus button. Your data is saved locally on your device. So it's safe.\nTap the plus button to close.");
			break;
			case "cNM":
				mode=5;
				message("Enter the new name:",true);
			break;
			case "sDB":
				mode=-1;
				message("Name: "+DB["name"]+"\nTasks: "+DB["list"].length+"\nDone: "+DB["done"]+"\nTap the plus button to close.");
			break;
			case "cCN":
				DB["column"]=!DB["column"];
				$("#list").toggleClass('twoColumn');
				saveData();
				closeNav(true);
			break;
			case "cDN":
				DB["direction"]=!DB["direction"];
				$("#list").toggleClass("direction");
				saveData();
				closeNav(true);
			break;
			case "uDT":
				if($(this).hasClass('active'))
				{
					addToList(deleted[0],deleted[1]);
					$(this).removeClass('active');
				}
				closeNav(true);
			break;
			case "eDB":
				if(DB["password"]!=null)
				{
					mode=10;
					message("Enter master password:",true);
				}
				else
				{
					message("You should set a master password before accessing the data.");
				}
			break;
			case "sMP":
				if(DB["password"]!=null)
				{
					mode=10;
					DB["chosen"]="changePass";
					message("Enter current password:",true,true);
				}
				else
				{
					mode=11;
					message("Enter a password:",true);
				}
			break;
			case "cTH":
				changeTheme();
				hideMessage();
			break;
		}
		if(mode==-1)
		{
			$("#mainInput").val('Tap the plus to close');
			typed();
		}
	}
});

function jsaHash(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j;
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	var hash = jsaHash.h = jsaHash.h || [];
	var k = jsaHash.k = jsaHash.k || [];
	var primeCounter = k[lengthProperty];

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80'
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00'
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return;
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16);
		var oldHash = hash;
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			var w15 = w[i - 15], w2 = w[i - 2];

			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
				+ ((e&hash[5])^((~e)&hash[6]))
				+ k[i]
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
					)|0
				);
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
			
			hash = [(temp1 + temp2)|0].concat(hash);
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
}

/* Height debug (css vh) */
function reSized()
{
	if(!$("#mainInput").is(":focus"))
	{
		setTimeout(function(){
			$("#list,#blackSection").css("height",window.innerHeight-$("#panel").outerHeight());
		},400);
	}
	else
	{
		setTimeout(reSized,1000);
	}
}
reSized();
