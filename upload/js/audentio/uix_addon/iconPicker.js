var uix = uix || {};
uix.admin = uix.admin || {};
uix.admin.iconator = uix.admin.iconator || {
	iconList: "".split(","),
	iconPrefix: "fa fa-",
	hovering: false,


	searchIconsPhrase: "Search Icons...",
	noIconsPhrase: "No icons to display",

	init: function(){
		uix.admin.iconator.iconContent = "";
		for (var i = 0, len = uix.admin.iconator.iconList.length; i < len; i++){
			uix.admin.iconator.iconContent += '<span class="uix_iconatorIcon"><i class="' + uix.admin.iconator.iconList[i] + '"></i></span>';
		}


		var content = '<span class="uix_iconTrigger"><i class="uix_iconatorDefault"></i></span>';
			content += '	<div class="Menu uix_iconator" id="">';
			content += '		<div class="primaryContent menuHeader">';
			content += '			<div class="uix_iconatorInputWrapper"><input type="text" placeholder="' + uix.admin.iconator.searchIconsPhrase + '" class="uix_iconatorInput textCtrl"/></div>';
			content += '			<div class="uix_iconatorHovered muted">Hovered Icon: </div>';
			content += '		</div>';
			content += '		<ul class="secondaryContent blockLinksList">';	
			content += '			<li>' + uix.admin.iconator.iconContent + '</li>';			
			content += '			<li class="uix_iconatorNoIcons">' + uix.admin.iconator.noIconsPhrase + '</li>';
			content += '		</ul>';
			content += '	</div>';

		var elements = $('.uix_iconInput');

		for (var i = 0, len = elements.length; i < len; i++){
			var uniqueId = XenForo.uniqueId();

			$(elements[i]).wrap("<div class='uix_iconInputWrap' id='" + uniqueId + "'>")
			var element = $(elements[i]).closest('.uix_iconInputWrap')[0];
			var iconator = document.createElement("div");
			iconator.className = "uix_iconWrapper";
			iconator.setAttribute('rel', 'Menu')
			iconator.innerHTML = content;
			element.appendChild(iconator);
			$(".uix_iconatorIcon", element).on("click", function(){
				var ele = $(this);
				var uniqueName = "#XenForoUniq" + (parseInt((ele.closest(".Menu")[0].id).replace("XenForoUniq", "")) - 1);
				if (ele.hasClass('active')){
					ele.removeClass('active')
				} else {
					$("#" + ele.closest(".Menu")[0].id + " .uix_iconatorIcon").removeClass('active');
					ele.addClass('active')

					$(uniqueName + ' .uix_iconTrigger i')[0].className = $("i", ele)[0].className;
					$(uniqueName + " .uix_iconInput")[0].value = $("i", ele)[0].className;
				}
			})
			$(".uix_iconatorIcon", element).on("mouseenter", function(){
				var ele = $(this);
				$("#" + ele.closest(".Menu")[0].id + " .uix_iconatorHovered").html("Hovered Icon: " + $("i", ele)[0].className);
				uix.admin.iconator.hovering = true;
			})
			$(".uix_iconatorIcon", element).on("mouseleave", function(){
				uix.admin.iconator.hovering = false;
				window.setTimeout(function(){
					if (!uix.admin.iconator.hovering){
						$(".uix_iconatorHovered").html("Hovered Icon: ");
					}
				}, 500)
			})

			$(".uix_iconatorInput", iconator).on("keyup cut paste", function(){
				var eles = $(".uix_iconatorIcon i", $(this).closest(".Menu"));
				var numDisplayed = 0
				for (var i = 0, len = eles.length; i < len; i++){
					if (eles[i].className.indexOf(this.value) == -1){
						eles[i].parentNode.style.display = "none"
					} else {
						eles[i].parentNode.style.display = ""
						numDisplayed++;
					}
				}

				if (numDisplayed == 0){
					$('.uix_iconatorNoIcons', $(this).closest(".Menu"))[0].style.display = "list-item"
				} else {
					$('.uix_iconatorNoIcons', $(this).closest(".Menu"))[0].style.display = ""
				}
			})


			func = function(uniqueId){
				var nextId = "XenForoUniq" + (parseInt(uniqueId.replace("XenForoUniq", "")) + 1)
				$(elements[i]).on("keyup cut paste", function(){
					var useDefault = true;
					var input = $("#" + uniqueId + " .uix_iconInput").val();
					for (var i = 0, len = uix.admin.iconator.iconList.length; i < len; i++){
						if (uix.admin.iconator.iconList[i] == input){
							$("#" + uniqueId + " .uix_iconTrigger i")[0].className = input;
							$("#" + nextId + " .uix_iconatorIcon").removeClass('active');
							$("#" + nextId + " .uix_iconatorIcon ." + input.replace(" ", ".")).parent()[0].className += " active"
							useDefault = false;
							break;
						}
					}
					if (useDefault){
						$("#" + uniqueId + " .uix_iconTrigger i")[0].className = "uix_iconatorDefault"; 
						$("#" + nextId + " .uix_iconatorIcon").removeClass('active');
					}
				})
			}

			func(uniqueId);

			var inputVal = elements[i].value
			if (uix.admin.iconator.iconList.indexOf(inputVal) !== -1){
				var ele = $("." + inputVal.replace(" ", "."), iconator);
				if (ele.length){
					ele.parent()[0].className += " active"
				}
				$(element).find('.uix_iconTrigger i').addClass(inputVal);
			}

			var menu = new XenForo.PopupMenu($(element));
		}
	}
};

$(document).ready(function(){
	uix.admin.iconator.init();
})