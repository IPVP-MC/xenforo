$(document).ready(function(){
	//DOM
	var
	$window 	= $(window),
	html 		= $('html'),
	head    	= $('head'),
	body 		= $('body');
	
	//UIX variables
	uix.windowWidth 				= 0;
	uix.windowHeight 				= 0;
	uix.scrollTop 					= window.scrollY || document.documentElement.scrollTop;
	
	//process stickyItems object
	var stickyItemSelector = [];
	for (var item in uix.stickyItems) {
		stickyItemSelector.push(item);
		uix.stickyItems[item].elm = $(item);
		uix.stickyItems[item].offset = uix.stickyItems[item].elm.offset();
		uix.stickyItems_length++;
	}
	
	uix.elm = {
		sticky          : $(stickyItemSelector.join()),
		navigation 		: $('#navigation'),
		userBar 		: $('#moderatorBar'),
		logo 			: $('#logo'),
		logoBlock 		: $('#logoBlock'),
		logoSmall 		: $('#logo_small'),
		jumpToFixed 	: $('#uix_jumpToFixed'),
		mainSidebar 	: $('.uix_mainSidebar'),
		mainContent 	: $('.mainContent'),
		mainContainer 	: $('.mainContainer'),
		welcomeBlock 	: $('#uix_welcomeBlock'),
		stickyCSS 		: $('#uixStickyCSS')
	};
	uix.elm.sidebar 			= $('.uix_mainSidebar');
	uix.elm.sidebar_inner		= uix.elm.sidebar.find('.sidebar');
	
	uix.hasSticky 					= uix.stickyItems_length ? true : false;
	uix.stickyHeight				= 0;
	uix.stickyRunning				= false;
	uix.contentHeight				= uix.elm.mainContent.outerHeight();
	uix.emBreak						= uix.elm.mainContainer.scrollTop();
	uix.resizeTimer					= undefined;
	
	//custom logger: logs only under Beta mode
	uix.log = function(x){
		if (uix.betaMode) { console.log(x) }
	};
	uix.info = function(x){
		if (uix.betaMode) { console.info(x) }
	};
	
	// ==============
	// UIX functions
	// ==============
  uix.sticky = {
    stick: function(item){
			var
			target = uix.stickyItems[item].elm,
			innerWrapper = uix.stickyItems[item].wrapper,
      normalHeight = uix.stickyItems[item].normalHeight;
			
			$('.lastSticky').removeClass('lastSticky');
			
      target
			.addClass('lastSticky')
			.removeClass('inactiveSticky')
			.addClass('activeSticky')
			.css('height', normalHeight);
			
      innerWrapper.css('top',uix.stickyHeight);
      uix.stickyHeight += uix.stickyItems[item].stickyHeight;
			//uix.elm.stickyCSS.html('.scrollDirection-up .activeSticky .sticky_wrapper {-webkit-transform: translateY(-'+uix.stickyHeight+'px)}');
			
			if ( uix.elm.logoSmall.length && uix.elm.logo.length ) {
				uix.fn.checkLogoVisibility();
			}
    },
    unstick: function(item){
			var
			target = uix.stickyItems[item].elm,
			innerWrapper = uix.stickyItems[item].wrapper,
      stickyHeight = uix.stickyItems[item].stickyHeight;
			
      target
			.addClass('inactiveSticky')
			.removeClass('lastSticky')
			.removeClass('activeSticky')
			.css('height', '');
			
      innerWrapper.css('top','');
			
      uix.stickyHeight -= stickyHeight;
			
			$('.activeSticky').last().addClass('lastSticky');
			
			//uix.fn.checkRadius();
			
			if ( uix.elm.logoSmall.length && uix.elm.logo.length ) {
				uix.fn.checkLogoVisibility();
			}
    },
		check: function(){
			
      //for (var item in uix.stickyItems) {
			//iterating on jQuery object for correct order
			for(var x=0,y=uix.elm.sticky.length; x<y;x++) {
				var
				itemID = '#'+uix.elm.sticky[x].id,
				item = uix.stickyItems[itemID],
				$this = item.elm,
				innerWrapper = item.wrapper,
				wrapperFromWindowTop = innerWrapper[0].getBoundingClientRect().top;
							
				//Is stuck
				if ($this.hasClass('activeSticky')) {
					if (!item.alwaysSticky && $this[0].getBoundingClientRect().top >= wrapperFromWindowTop) {
						uix.sticky.unstick(itemID);
					}
				}
				//Not stuck
				else {
					if (wrapperFromWindowTop-uix.stickyHeight <=0) {
						uix.sticky.stick(itemID);
					}
				}
			}
			
		}
  };
	
	uix.sidebarSticky = {
		running:false,
		update: function(){
			uix.sidebarSticky.sidebarOffset = uix.elm.sidebar.offset();
			uix.sidebarSticky.sidebarFromLeft = uix.sidebarSticky.sidebarOffset.left;
			uix.sidebarSticky.mainContainerHeight = uix.elm.mainContainer.outerHeight();
			uix.sidebarSticky.bottomLimit = uix.elm.mainContainer.offset().top + uix.sidebarSticky.mainContainerHeight;
			uix.sidebarSticky.maxTop = uix.sidebarSticky.bottomLimit - (uix.sidebarSticky.sidebarOffset.top+uix.sidebarSticky.sidebarHeight);
			uix.sidebarSticky.check();
		},
		check: function(){
		if (uix.sidebarSticky.mainContainerHeight>=uix.sidebarSticky.sidebarHeight) {
			var
			sidebarFromWindowTop = uix.sidebarSticky.sidebarOffset.top - (uix.stickyHeight+uix.scrollTop),
			bottomLimitFromWindowTop = uix.sidebarSticky.bottomLimit - uix.scrollTop;
				
			if (bottomLimitFromWindowTop-uix.stickyHeight<=uix.sidebarSticky.sidebarHeight+uix.globalPadding) {
				uix.sidebarSticky.fixBottom()
			}
			else if (uix.elm.sidebar.hasClass('sticky') && sidebarFromWindowTop-uix.globalPadding > 0){
				uix.sidebarSticky.unstick();
			}
			else if (bottomLimitFromWindowTop-uix.stickyHeight>uix.sidebarSticky.sidebarHeight+uix.globalPadding && sidebarFromWindowTop-uix.globalPadding <= 0) {
				uix.sidebarSticky.stick();
			}
		}
		else if (uix.sidebarSticky.running) {
			uix.sidebarSticky.unstick();
		}
		},
		stick: function(){
			uix.elm.sidebar.addClass('sticky');
			uix.sidebarSticky.innerWrapper.css({
				top: uix.stickyHeight+uix.globalPadding,
				left: uix.sidebarSticky.sidebarOffset.left
			});
		},
		
		unstick: function(){
			uix.elm.sidebar.removeClass('sticky');
			uix.sidebarSticky.innerWrapper.css({
				top: '', left: ''
			});
		},
		
		fixBottom: function(){
			uix.elm.sidebar.removeClass('sticky');
			uix.sidebarSticky.innerWrapper.css({
				top: uix.sidebarSticky.maxTop, left: ''
			});
		},
		
		reset: function(){
			uix.sidebarSticky.unstick();
			uix.sidebarSticky.innerWrapper.css('width', '');
			$window.off('scroll.sidebarStickyCheck');
			uix.sidebarSticky.running = false;
		}
	};
  
	uix.fn = {
		
		determineIfLandscape: function(windowHeight) {
			if (windowHeight <= 400) { //is landscape, essentially
				html.addClass('isLandscape');
				return true;
			} else {
				html.removeClass('isLandscape');
				return false;
			}
		},
		
		checkRadius: function(){
			/* Reset border radius selectively */
      var remove_radius = function(elm, direction){
        if(!direction){ elm.addClass('noBorderRadius') }
        else {
          /* Capitalize direction*/
          $direction = direction.charAt(0).toUpperCase() + direction.slice(1);
					elm.addClass('noBorderRadius'+$direction);
        }
      },
			reset_radius = function(elm){
				elm
				.removeClass('noBorderRadius')
				.removeClass('noBorderRadiusTop')
				.removeClass('noBorderRadiusBottom') 
			};
			
      /* Target elements to run tests against */
      var 
      _elms = ["#logoBlock .pageContent", "#content .pageContent", "#userBar .pageContent", "#navigation .pageContent", ".footer .pageContent", "#uix_footer_columns .pageContent", ".footerLegal .pageContent"],
      uix_wrapper = $("#uix_wrapper"),
      uix_wrapper_offset = uix_wrapper.offset();
			
      /* mirror variable */
			var elms = _elms;
      var checked = {};
      
			/* Loop through all */
      for (var i = 0; i < _elms.length; i++) {
				var 
				element_selector = elms[i],
        element = $(element_selector);
        checked[element_selector] = {};
        
				//remove previous noBorderRadius classes
				reset_radius(element);
				
				if(element.length){
          var 
          element_height = element.outerHeight(),
          element_offset = element.offset();
          
          /* Check if our element is touching #uix_wrapper */
          
          /* top */
          if (element_offset.top == uix_wrapper_offset.top) {
            remove_radius(element, 'top');
          }
          /* bottom */
					if ((element_offset.top + element_height) == uix_wrapper_offset.top){
            remove_radius(element, 'bottom')
          }
					
          /* Check if our element is touching others in elms[] */
          for (var x=0; x<elms.length; x++) {
            var currentElm = $(elms[x]);
            if (currentElm.length){
							var
              currentElm_height = currentElm.outerHeight(),
              currentElm_offset = currentElm.offset();
              
              /* Dont check against itself */
              if(elms[i]!=elms[x]) {
                var
                isAttachedToTop = ( element_offset.top - (currentElm_offset.top + currentElm_height) ) == 0,
                isAttachedToBottom = ( ( element_offset.top + element_height ) == currentElm_offset.top );
                
								if (isAttachedToTop) {
                  remove_radius(element, 'top');
                  checked[element_selector]['top'] = 'reset';
                }
                else if(checked[element_selector]['top'] != 'reset'){
                  element.removeClass('noBorderRadiusTop');
                }
                if (isAttachedToBottom) {
                  remove_radius(element, 'bottom');
                  checked[element_selector]['bottom'] = 'reset';
                }
                else if(checked[element_selector]['bottom'] != 'reset'){
                  element.removeClass('noBorderRadiusBottom');
                }
							}
						}
          }
          
          /* Reset border-radius if element is full width */
          if (element.outerWidth()==$window.width()){
            remove_radius(element);
          }
        }
      }
    },
		
		checkLogoVisibility: function() {
			if ( uix.elm.navigation.hasClass('activeSticky') ) {
				var
				logoTopOffset           = uix.elm.logo.offset().top + (uix.elm.logo.outerHeight(true) / 2),
				stickyWrapper           = uix.elm.navigation.find('.sticky_wrapper'),
				navigationBottomOffset  = stickyWrapper.offset().top + stickyWrapper.outerHeight(true);
				
				if (logoTopOffset < navigationBottomOffset) {
					html.addClass('activeSmallLogo');
				}
				else {
					html.removeClass('activeSmallLogo');
				}
			}
			else {
				html.removeClass('activeSmallLogo');
			}
		},
		
	}
  
	// ================
	// init() functions
	// ================
	
  uix.init.scrollDetector = function(){
    //Scroll Direction Detector
    var lastScrollTop = 0;
    $window.on('scroll', function(){
      if (uix.scrollTop > lastScrollTop){
        uix.scrollDirection = 'down';
        html.removeClass('scrollDirection-up').addClass('scrollDirection-down');
      } else {
        uix.scrollDirection = 'up';
        html.removeClass('scrollDirection-down').addClass('scrollDirection-up');
      }
      lastScrollTop = uix.scrollTop;
    });
  },
  
	uix.init.viewportCheck = function(){
		var e = window, a = 'inner';
		if (!window.innerWidth) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		var viewport = { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    uix.windowWidth = viewport.width;
    uix.windowHeight = viewport.height;
		
		$window.on('scroll', function(){
			uix.scrollTop = window.scrollY || document.documentElement.scrollTop;
			if (uix.scrollTop == 0) {
				html.removeClass('scrollNotTouchingTop');
			}
			else if(!html.hasClass('scrollNotTouchingTop')){
				html.addClass('scrollNotTouchingTop');
			}
		});
	};
	
	uix.init.welcomeBlock = function(){
		if ( uix.elm.welcomeBlock.length && uix.elm.welcomeBlock.hasClass('uix_welcomeBlock_fixed') ) {
			if ( $.getCookie('hiddenWelcomeBlock') == 1 ) {
				if (uix.reinsertWelcomeBlock) {
					uix.elm.welcomeBlock.removeClass('uix_welcomeBlock_fixed');
				}
				else {
					uix.elm.welcomeBlock.hide();
				}
			}  
      
			uix.elm.welcomeBlock.find('.close').on('click', function(e) {
				e.preventDefault();
				$.setCookie('hiddenWelcomeBlock', 1);
				uix.elm.welcomeBlock.fadeOut('slow', function() {
					if (uix.reinsertWelcomeBlock) {
						uix.elm.welcomeBlock.removeClass('uix_welcomeBlock_fixed');
						uix.elm.welcomeBlock.fadeIn();
					}
				});
			});
		}
	};
	
	uix.init.setupTabLinks = function(){
		
		$('.moderatorTabs').children().each(function() {
			var $this = $(this);
			if ( $this.is('a') ) {
				$this.addClass('navLink');
			}
			if (!$this.is('li') ) {
				$this.wrap('<li class="navTab" />');
			}
		});
		
		$('.uix_adminMenu .blockLinksList').children().each(function() {
			var $this = $(this);
			if ( $this.is('a') ) {
				$this.addClass('navLink');
			}
			if (!$this.is('li') ) {
				$this.wrap('<li class="navTab" />');
			}
		});


		if ( $('.moderatorTabs .admin').length ) {
			var
			$itemCounts = $('.uix_adminMenu').find('.itemCount'),
			adminListTotal = 0,
			adminListTotalUnread = 0;

			$itemCounts.each(function() {
				var $this = $(this)
				adminListTotal += parseInt( $this.text(), 10 );
				if ( $this.hasClass('alert') ) {
					adminListTotalUnread = 1;
				}
			});

			if (adminListTotal > 0) {
				$('.moderatorTabs .admin .itemCount').removeClass('Zero').find('.Total').text(adminListTotal);
				if (adminListTotalUnread) {
				  $('.moderatorTabs .admin .itemCount').addClass('alert');
				}
			}
		}
	}
	
	uix.init.jumpToFixed = function(){
		var scrollToThe = function(pos) {

			if (pos == 'bottom') {
				$('html, body').stop().animate({scrollTop: $(document).height()}, 400);
			} else {
				$('html, body').stop().animate({scrollTop: 0}, 400);
			}
			
			return false;
		};
		
		var jumpToFixed = uix.elm.jumpToFixed;
		
		$('.topLink').on('click', function() {scrollToThe('top')});
    
		if (jumpToFixed.length) {
				
			jumpToFixed.find('a').on('click', function() {scrollToThe( $(this).data('position') )});
		   
			if (uix.jumpToFixed_delayHide) {
				jumpToFixed.hover(
				function() {
							clearTimeout(scrollTimer);
							jumpToFixed.stop(true, true).show();
						}, 
						function() {
							jumpToFixed.stop(true, true).fadeOut();
						}
				);
			}
			var scrollTimer = null;	
			$window.scroll(function () {
				if (uix.jumpToFixed_delayHide) {
					if (scrollTimer) {
						clearTimeout(scrollTimer);   // clear any previous pending timer
					}
				}
				
				if (uix.scrollTop > 140) {
					if (uix.elm.jumpToFixed.is(':hidden')) {
						jumpToFixed.stop().fadeIn();
						if (uix.jumpToFixed_delayHide) {
							scrollTimer = setTimeout(function() {
								scrollTimer = null;
								jumpToFixed.stop(true, true).fadeOut();
							}, 1500);   // set new timer
						}
					}
				} else {
					if (uix.elm.jumpToFixed.is(':visible')) {
						jumpToFixed.stop().fadeOut();
					}
				}
			});
				
		}
	}
	
	uix.init.fixScrollLocation = function(){
    
		if (document.location.hash) {
        var $target = $(document.location.hash);
				var newScroll = $target.offset().top - uix.stickyHeight-(uix.globalPadding);
        if ($target.length) {
          window.scrollTo(0,newScroll);
        }
			}
	}
	
	uix.init.mainSidebar = function(){
		var
		mainSidebar = uix.elm.mainSidebar,
		sidebarCollapse = $('.uix_sidebar_collapse'),
		sidebarCollapsePhrase = $('.uix_sidebar_collapse_phrase'),
		mainContent = $('.mainContainer .mainContent');
		
		if ( mainSidebar.length && html.hasClass('hasSidebarToggle') ) {
      var
			documentWidthWhenSidebarResponsive = parseInt(uix.maxResponsiveWideWidth, 10),
      //$sidebar = uix.elm.sidebar,
      sidebarLocation = (mainSidebar.hasClass('uix_mainSidebar_left')) ? 'left' : 'right',
			sidebarMargin,
			origSidebarMargin = 0;
        
      if (uix.mainContainerMargin.length) {
				origSidebarMargin = uix.mainContainerMargin;
			}
				
			$(window).on('resize orientationchange', function(){
				
        if (uix.windowWidth <= documentWidthWhenSidebarResponsive) {
					mainContent.css('marginRight', 0);
					mainContent.css('marginLeft', 0);
        }
        
				else {
          if ( mainSidebar.is(":visible") ) {
            if ( sidebarLocation == 'left') {
              mainContent.css('marginLeft', origSidebarMargin);
            }
            else {
              mainContent.css('marginRight', origSidebarMargin);
            }
          }
        }
      });
			
			if ( $.getCookie('collapsedSidebar') == 1 ) {
        sidebarCollapse.addClass('uix_sidebar_collapsed');
				sidebarCollapsePhrase.text(uix.collapsibleSidebar_phrase_open);
				
				//Hiding part moved to js_header
				mainSidebar.hide();
        if (sidebarLocation == 'left') {
          mainContent.css('marginLeft', 0);
          //$('.sidebar').css('marginLeft', parseInt($sidebar.css('marginLeft'),10) == 0 ? $sidebar.outerWidth() * (-1) : 0 );
        }
        else {
          mainContent.css('marginRight', 0);
          //$('.sidebar').css('marginRight', parseInt($sidebar.css('marginRight'),10) == 0 ? $sidebar.outerWidth() * (-1) : 0 );
				}
			}
			
      sidebarCollapse.find('a').on('click', function(e) {
				e.preventDefault();
        
				if ( mainSidebar.is(":visible") ) {
          $.setCookie("collapsedSidebar", 1);
          sidebarCollapse.addClass('uix_sidebar_collapsed');
					sidebarCollapsePhrase.text(uix.collapsibleSidebar_phrase_open);
                
          if (sidebarLocation == 'left') {
            if (uix.windowWidth > documentWidthWhenSidebarResponsive) {
              mainSidebar.fadeOut("slow", function() {
                mainContent.stop().animate({
                  marginLeft: 0
                });
              });
            }
            else {
              mainSidebar.hide();
              mainContent.css('marginLeft', 0);
            }
          }
          else {
            if (uix.windowWidth > documentWidthWhenSidebarResponsive) {
              mainSidebar.fadeOut("slow", function() {
                mainContent.stop().animate({
									marginRight: 0
								});
							});
						}
						else {
							mainSidebar.hide();
							mainContent.css('marginRight', 0);
						}
					} 
        }
          
				else {
          $.setCookie("collapsedSidebar", 0);
          sidebarCollapse.removeClass('uix_sidebar_collapsed');
					sidebarCollapsePhrase.text(uix.collapsibleSidebar_phrase_close);
          var stickyCondition = (uix.stickySidebar && uix.windowWidth > 800 && !uix.sidebarSticky.running);
					if (sidebarLocation == 'left') {
            if (uix.windowWidth > documentWidthWhenSidebarResponsive) {
              mainContent.animate({
                marginLeft: origSidebarMargin
              }, function() {
                mainSidebar.fadeIn(400, function(){if (stickyCondition){uix.init.stickySidebar()}});
              });
            }
            
						else {
              mainSidebar.show();
              mainContent.css('marginLeft', 0);
							if (stickyCondition){uix.init.stickySidebar()}
            }
          }
          
					else {
						if (uix.windowWidth > documentWidthWhenSidebarResponsive) {
              mainContent.stop().animate({
                marginRight: origSidebarMargin
              }, function() {
                mainSidebar.fadeIn(400, function(){if (stickyCondition){uix.init.stickySidebar()}});
              });
            }
            else {
              mainSidebar.show();
							if (stickyCondition){uix.init.stickySidebar()}
              mainContent.css('marginRight', 0);
            }
          }
        }
      });
    }
	};
	uix.modernSticky = {
		stick: function (elm, fromtop) {
			elm.css('top', fromtop).addClass('positionSticky');
		},
		unstick: function (elm) {
			elm.css('top', '').removeClass('positionSticky');
		}
	}
	uix.init.stickySidebar = function(){
		var sidebar = uix.elm.sidebar;
		uix.sidebarSticky.sidebarOffset = sidebar.offset();
		uix.sidebarSticky.sidebarFromLeft = uix.sidebarSticky.sidebarOffset.left;
		uix.sidebarSticky.sidebarHeight = sidebar.outerHeight();
		uix.sidebarSticky.mainContainerHeight = uix.elm.mainContainer.outerHeight();
		uix.sidebarSticky.innerWrapper = sidebar.find('.inner_wrapper');
			
		uix.sidebarSticky.innerWrapper.css('width', sidebar.outerWidth());
			
		uix.sidebarSticky.bottomLimit = uix.elm.mainContent.offset().top + uix.sidebarSticky.mainContainerHeight;
		uix.sidebarSticky.maxTop = uix.sidebarSticky.bottomLimit - (uix.sidebarSticky.sidebarOffset.top+uix.sidebarSticky.sidebarHeight);
		
		uix.sidebarSticky.check();
		$window.on('scroll.sidebarStickyCheck', uix.sidebarSticky.check);
		uix.sidebarSticky.running = true;
	};
	
	uix.init.collapsibleNodes = function(){
		if ( html.hasClass('hasCollapseNodes') ) {
      // go through each cookie, and hide nodes that are stored
      if ( $.getCookie('collapsedNodes') ) {
        var
				collapsedNodes = $.getCookie("collapsedNodes"),
        collapsedNodes_array = collapsedNodes.split('.');
				
        $.each(collapsedNodes_array, function(index, value) {
          if (value) {
            $('.node_' + value + '.category > .nodeList').hide();
            $('.node_' + value).addClass("collapsed");
          }
        });
      }
			
      $('.uix_collapseNodes').click(function(e) {
				e.preventDefault();
				
        // this nodelist
        var thisNodeList = $(this).parents('.node.category').children('.nodeList');
        // get the id of the clicked node
        var nodeId = $(this).parents('.node.category').attr('id').split('.')[1];
        
        // get the contents of the cookie, the collapsed nodes
        var collapseNodes_content = '';
        if ( $.getCookie('collapsedNodes') ) {
          collapseNodes_content = $.getCookie('collapsedNodes');
        }
				
				// if the id of the node is already in the cookie, remove it's cookie otherwise create it
        if ( collapseNodes_content.indexOf(nodeId + '.') >= 0) {
          collapseNodes_content = collapseNodes_content.replace( nodeId + '.' , '');
        } 
        else { // add it in
          collapseNodes_content = collapseNodes_content + nodeId + '.';
				}
        
				$.setCookie("collapsedNodes", collapseNodes_content);
            
        // the animation
        $(this).parents('.node.category').toggleClass("collapsed").children('.nodeList').slideToggle(400, function(){uix.sidebarSticky.update()});
				
			});
    }
	}
	
	uix.init.offcanvas = function(){
		$('.uix_sidePane .navTab.selected').addClass('active');
		$('.uix_sidePane .SplitCtrl').on('click', function(e) {
			$('.uix_sidePane .navTab').removeClass('active');
			$(e.target).closest('.navTab').toggleClass('active');
			return false;
		});
		uix.offcanvas = {};
		uix.offcanvas.wrapper = $('.off-canvas-wrapper');
		uix.offcanvas.move = function(direction){
			uix.offcanvas.wrapper.addClass('move-'+direction);
		},
		
		uix.offcanvas.reset = function(){
			uix.offcanvas.wrapper.removeClass('move-right').removeClass('move-left');
		};
		
		$('.left-off-canvas-trigger').on('click', function(){
			uix.offcanvas.move('right');
			return false;
		});
		$('.right-off-canvas-trigger').on('click', function(){
			uix.offcanvas.move('left');
			return false;
		});
		
		$('.exit-off-canvas').on('touchstart click', function(){
			uix.offcanvas.reset();
			return false;
		});
	}
	
	uix.init.sticky = function(){
    
		var stickyElmsHeight = 0;
		uix.elm.sticky.each(function(){
			$this = $(this),
			item = uix.stickyItems['#' + $this.attr('id')];
			
			if ($this.offset().top == stickyElmsHeight) {
				item.alwaysSticky = true;
				stickyElmsHeight += item.stickyHeight;
			}
		});
		
		uix.stickyHeight = 0;
		uix.stickyLast = uix.elm.sticky.last();
    uix.stickyLastBottom = uix.stickyLast.offset().top + uix.stickyLast.outerHeight();
		
		for (var item in uix.stickyItems) {
			var $this = uix.stickyItems[item].elm;
			if (!$this.find('.sticky_wrapper').length) {
				$this.wrapInner('<div class="sticky_wrapper"></div>').addClass("inactiveSticky");
			}
			uix.stickyItems[item].wrapper = $this.find('.sticky_wrapper');
		}
		uix.sticky.check();
		$window.on('scroll.stickyCheck', uix.sticky.check);
		
		if ( uix.elm.logoSmall.length && uix.elm.logo.length ) {
			uix.fn.checkLogoVisibility();
    }
		
		uix.stickyRunning = true;
		setTimeout(uix.init.fixScrollLocation, 20);
	}
	
	//check viewport on load, resize and orientation change
  $window.on('load resize orientationchange', function(){
		
		//update viewport variables
		uix.init.viewportCheck();
		
		uix.fn.checkRadius();
		
		//updates sidebar css
		if (uix.stickySidebar) {
			if (uix.windowWidth>parseInt(uix.maxResponsiveWideWidth)) {
				uix.elm.sidebar.css({
					'width': uix.sidebarWidth,
					'float': uix.sidebar_innerFloat
				});
			}
			else {
				uix.elm.sidebar.css({'width': '','float': ''});
			}
		}
		
		//update stickysidebar position
		if (uix.elm.sidebar.length && uix.stickySidebar && uix.elm.sidebar.is(":visible")) {
			uix.sidebarSticky.update();
			
			if (uix.windowWidth>parseInt(uix.maxResponsiveWideWidth) && uix.sidebarSticky.running) {
				if (uix.elm.sidebar.hasClass('sticky')) {
					uix.sidebarSticky.innerWrapper.css({
						left: uix.sidebarSticky.sidebarFromLeft
					});
				}
				else {
					uix.sidebarSticky.innerWrapper.css('left', '')
				}
			}
			else if(uix.windowWidth>parseInt(uix.maxResponsiveWideWidth) && !uix.sidebarSticky.running) {
				uix.init.stickySidebar();
			}
			else {
				uix.sidebarSticky.reset();
			}
		}
		
		//sticky
		uix.stickySizeCondition	= (uix.windowHeight < uix.stickyNavigation_maxHeight && uix.windowHeight > uix.stickyNavigation_minHeight && uix.windowWidth < uix.stickyNavigation_maxWidth && uix.windowWidth > uix.stickyNavigation_minWidth);
		
		if (uix.hasSticky) {
			
			if (uix.stickySizeCondition && !uix.stickyRunning) {
				uix.init.sticky();
				uix.sticky.check();
			}
				
			else if(!uix.stickySizeCondition && uix.stickyRunning) {
				
				for(var item in uix.stickyItems){
					uix.sticky.unstick(item)
				}
					
				//turn off sticky checker
				$window.off('scroll.stickyCheck');
				uix.stickyHeight = 0;
				uix.stickyRunning = false;
			}
		}
	});
	$window.on('load',uix.init.fixScrollLocation);
	
	uix.on('init', function(){
		
		uix.init.viewportCheck();
		uix.stickySizeCondition	= (uix.windowHeight < uix.stickyNavigation_maxHeight && uix.windowHeight > uix.stickyNavigation_minHeight && uix.windowWidth < uix.stickyNavigation_maxWidth && uix.windowWidth > uix.stickyNavigation_minWidth);
		
		//Beta mode warning
		if (uix.betaMode) {
			console.warn("%cUI.X IS IN BETA MODE", "color:#E74C3C;font-weight:bold");
		}
		//uix.init.scrollDetector();
		uix.init.welcomeBlock();
		uix.init.jumpToFixed();
		//sidebar
		if (uix.elm.sidebar.length && uix.stickySidebar) {
			uix.elm.sidebar.wrapInner('<div class="inner_wrapper"></div>');
			uix.elm.sidebar.css({
				'width': uix.elm.sidebar_inner.outerWidth(),
				'float': uix.sidebar_innerFloat
			});
			//uix.elm.sidebar_inner.css('float','none');
			uix.sidebarSticky.innerWrapper = uix.elm.sidebar_inner;
		}
		uix.init.mainSidebar();
		uix.init.collapsibleNodes();
		uix.init.offcanvas();
		uix.init.setupTabLinks();
		
		uix.fn.checkRadius();
		
		if (uix.hasSticky && uix.stickySizeCondition) {
			uix.init.sticky();
		}
		
		if (uix.elm.sidebar.length && uix.stickySidebar && uix.windowWidth > 800 && uix.elm.sidebar.is(":visible")) {
			uix.init.stickySidebar();
		}
    
		uix.init.fixScrollLocation();
		
		if ( $('#searchBar.hasSearchButton').length) {
		  $("#QuickSearch .primaryControls span").click(function(e) {
			e.preventDefault();
			$("#QuickSearch > .formPopup").submit();
		  });
		}
			
		if ( $("#content.register_form").length ) {
				$("#loginBarHandle").hide();
		}
	});
	
	//Initialize UIX	
	uix.init();
	
});