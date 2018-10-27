var Extend = {

    getChildByNames:function(node,nameStr){
        if(!Extend.isNodeValid(node)){
            cc.log("Extend getChildByNames the params of node is null")
            return null
        }
        if(!nameStr){
            cc.log("Extend getChildByNames the params of nameStr is null")
            return null
        }
        var names = nameStr.split(".")
        var currParentNode = node
        for(var key in names){
            var name = names[key]
            var findNode = currParentNode.getChildByName(name)
            if(!findNode){
                return null
            }
            currParentNode = findNode
        }
        return currParentNode
    },

    createSystemLabel:function(str,fontSize,fontColor){
        var node = new cc.Node()
        fontColor = fontColor ? fontColor :new cc.Color(255, 255, 255)
        node.setColor(fontColor)
        var label = node.addComponent(cc.Label);
        label.string = str
        label.fontSize = fontSize ? fontSize:20
        return node
    },

    asyncCreateSpriteWithPng:function(path,callback,target){
        if(!path || path == "")
        {
            cc.log("asyncCreateSpriteWithPng the params of path is null or ''")
            return
        }
         cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
             if (err) {
                cc.error(err);
                return;
            }
            if(!callback)
            {
                cc.log("asyncCreateSpriteWithPng the params of callback is null")
                return;
            }
             var node = new cc.Node();
             var sprite = node.addComponent(cc.Sprite);
             sprite.spriteFrame = spriteFrame;
             if(target)
             {
                if(typeof(callback) != "string")
                {
                    cc.log("asyncCreateSpriteWithPng the type of params callback is not string ")
                    return
                }
                target[callback](node)
             }else{
                if(typeof(callback) != "function")
                {
                    cc.log("asyncCreateSpriteWithPng the type of params callback is not function")
                    return
                }
                if(callback) callback(node)
             }
            
        });
    },

    asyncCreateSpriteWithPlist:function(path,frameName,callback,target){
        if(!path || path == "")
        {
            cc.log("asyncCreateSpriteWithPlist the params of path is null or ''")
            return
        }
        if(!frameName || frameName == "")
        {
            cc.log("asyncCreateSpriteWithPlist the params of frameName is null or ''")
            return
        }
        cc.loader.loadRes(path, cc.SpriteAtlas, function (err, spriteAtlas) {
             if (err) {
                cc.error(err);
                return;
            }
            if(!callback)
            {
                cc.log("asyncCreateSpriteWithPlist the params of callback is null")
                return;
            }
             var node = new cc.Node();
             var sprite = node.addComponent(cc.Sprite);
             var spriteFrame = spriteAtlas.getSpriteFrame(frameName);
             sprite.spriteFrame = spriteFrame;
             if(target)
             {
                if(typeof(callback) != "string")
                {
                    cc.log("asyncCreateSpriteWithPlist the type of params callback is not string ")
                    return
                }
                target[callback](node)
             }else{
                if(typeof(callback) != "function")
                {
                    cc.log("asyncCreateSpriteWithPlist the type of params callback is not function")
                    return
                }
                if(callback) callback(node)
             }
            
        });
    },

    asyncCreateSpriteFrameWithPng:function(path,callback,target){
        if(!path || path == "")
        {
            cc.log("asyncCreateSpriteFrameWithPng the params of path is null or ''")
            return
        }
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
             if (err) {
                cc.error(err);
                return;
            }
            if(!callback)
            {
                cc.log("asyncCreateSpriteFrameWithPng the params of callback is null")
                return;
            }
            if(target)
             {
                if(typeof(callback) != "string")
                {
                    cc.log("asyncCreateSpriteFrameWithPng the type of params callback is not string ")
                    return
                }
                target[callback](spriteFrame)
            }else{
                if(typeof(callback) != "function")
                {
                    cc.log("asyncCreateSpriteFrameWithPng the type of params callback is not function")
                    return
                }
                if(callback) callback(spriteFrame)
            }
            
        });

    },


    isNodeValid:function(node){
        if(node ==null || !node.isValid)
        {
            return false
        }
        return true
    },

    //创建垂直layout组件
    createVerticalLayoutComponent:function(node,resizeMode,paddingTop,paddingBottom,spacingY,direction){
        if(!Extend.isNodeValid(node))
        {
            cc.log("createVerticalLayoutComponent the node is not valide")
            return
        }
        var layoutComp = node.addComponent(cc.Layout)
        layoutComp.type = cc.Layout.Type.VERTICAL
        resizeMode = resizeMode ? resizeMode :cc.Layout.ResizeMode.NONE
        layoutComp.resizeMode = resizeMode
        paddingTop = paddingTop ? paddingTop : 0
        layoutComp.paddingTop = paddingTop
        paddingBottom = paddingBottom ? paddingBottom:0
        layoutComp.paddingBottom = paddingBottom
        spacingY = spacingY ? spacingY:0
        layoutComp.spacingY = spacingY
        direction = direction ? direction :cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        layoutComp.verticalDirection = direction
        return layoutComp
    },

    //创建横向layout组件
    createHorizontalLayoutComponent:function(node,resizeMode,paddingLeft,paddingRight,spacingX,direction){
        if(!Extend.isNodeValid(node))
        {
            cc.log("createHorizontalLayoutComponent the node is not valide")
            return
        }
        var layoutComp = node.addComponent(cc.Layout)
        layoutComp.type = cc.Layout.Type.HORIZONTAL
        resizeMode = resizeMode ? resizeMode :cc.Layout.ResizeMode.NONE
        layoutComp.resizeMode = resizeMode
        paddingLeft = paddingLeft ? paddingLeft : 0
        layoutComp.paddingLeft = paddingLeft
        paddingRight = paddingRight ? paddingRight:0
        layoutComp.paddingRight = paddingRight
        spacingX = spacingX ? spacingX:0
        layoutComp.spacingX = spacingX
        direction = direction ? direction :cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
        layoutComp.horizontalDirection = direction
        return layoutComp
    },
    
    //创建网格layout组件
    createGridLayoutComponent:function(node,resizeMode,paddingTop,paddingBottom,paddingLeft,paddingRight,spacingX,spacingY,verticalDirection,horizontalDirection,row,col,cellSize){
        if(!Extend.isNodeValid(node))
        {
            cc.log("createGridLayoutComponent the node is not valide")
            return
        }
        var layoutComp = node.addComponent(cc.Layout)
        layoutComp.type = cc.Layout.Type.GRID
        resizeMode = resizeMode ? resizeMode :cc.Layout.ResizeMode.NONE
        layoutComp.resizeMode = resizeMode

        paddingTop = paddingTop ? paddingTop : 0
        layoutComp.paddingTop = 0
        paddingBottom = paddingBottom ? paddingBottom:0
        layoutComp.paddingBottom = paddingBottom

        paddingLeft = paddingLeft ? paddingLeft : 0
        layoutComp.paddingLeft = 0
        paddingRight = paddingRight ? paddingRight:0
        layoutComp.paddingRight = paddingRight

        spacingX = spacingX ? spacingX:0
        layoutComp.spacingX = spacingX
        spacingY = spacingY ? spacingY:0
        layoutComp.spacingY = spacingY

        horizontalDirection = horizontalDirection ? horizontalDirection :cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
        layoutComp.horizontalDirection = horizontalDirection
        verticalDirection = verticalDirection ? verticalDirection :cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        layoutComp.verticalDirection = verticalDirection

        if(row && col && cellSize)
        {   

            var totalWidth = col * cellSize.width + (col - 1) * spacingX
            var totalHeight = row * cellSize.height + (row - 1) * spacingY
            node.width = totalWidth
            node.height = totalHeight
        }

        return layoutComp
    },

    createScrollView:function(name,width,height,isVertical,isHorizontal,spaceX,spaceY){
        
        name = name ? name :"ScrollView_"+Math.ceil(Math.random()*1000)
        var scrollViewNode = new cc.Node(name)
        width = width ? width:100
        height = height ? height:100
        scrollViewNode.width = width
        scrollViewNode.height = height
        var scrollViewComp = scrollViewNode.addComponent(cc.ScrollView)

        var viewNode = new cc.Node("view")
        viewNode.width = width
        viewNode.height = height
        Extend.createMaskComponent(viewNode)
        viewNode.parent = scrollViewNode

        var contentNode = new cc.Node("content")
        contentNode.parent = viewNode
        

        scrollViewComp.content = contentNode
        scrollViewComp.horizontal = isHorizontal
        scrollViewComp.vertical = isVertical

        

        if(isHorizontal && !isVertical){
            contentNode.setAnchorPoint(0,0.5)
            contentNode.setPosition(-width/2,0)
            Extend.createHorizontalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,null,null,spaceX,null)
        }else if(!isHorizontal && isVertical){
            contentNode.setAnchorPoint(0.5,1)
            contentNode.setPosition(0,height/2)
            Extend.createVerticalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,null,null,spaceY,null)
        }

        return scrollViewNode
       
    },

    //更新滚动属性
    updateScrollAttribute:function(scrollNode,inertia,brakem,bounceDuration,cancelInnerEvents){
        if(!Extend.isNodeValid(scrollNode)){
            cc.log("updateScrollAttribute the params of scrollNode is null")
            return
        }
        var scrollViewComp = scrollNode.addComponent(cc.ScrollView)
        if(!scrollViewComp){
           cc.log("updateScrollAttribute the params of scrollNode has no ScrollView Component")
            return
        }
        scrollViewComp.inertia = inertia ? inertia : true
        scrollViewComp.brakem = brakem ? brakem : 0.75
        scrollViewComp.bounceDuration = bounceDuration ? bounceDuration : 0.2
        scrollViewComp.cancelInnerEvents = cancelInnerEvents ? cancelInnerEvents : true
    },


    SCROLL_TO_TOP:"scroll-to-top",
    SCROLL_TO_BUTTOM:"scroll-to-bottom",
    SCROLL_TO_LEFT:"scroll-to-left",
    SCROLL_TO_RIGHT:"scroll-to-right",
    SCROLLING:"scrolling",
    SCROLL_END:"scroll-ended",
    SCROLL_TOUCH_UP:"touch-up",

    addSrollEventListener:function(node,eventType,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addSrollEventListener the node is not valide")
            return
        }
        var scrollComp = node.getComponent(cc.ScrollView)
        if(!scrollComp){
            cc.log("addSrollEventListener the node is not scollView")
            return
        }

        node.on(eventType,callback,target)
    },

    createMaskComponent:function(node,maskType){
        if(!Extend.isNodeValid(node)){
            cc.log("createMaskComponent the node is not valide")
            return
        }
        var maskComp = node.addComponent(cc.Mask)
        maskType = maskType ? maskType:cc.Mask.Type.RECT
        maskComp.type = maskType
        return maskComp
    },

    //创建默认的滚动条
    createScollBar:function(){

    },

    //默认的资源
    createDefaultSprite:function(){
 
    },

    createPageView:function(pageName,pageWidth,pageHeight,maskWidth,maskHeight,isVertical){
        pageName = pageName ? pageName:"PageView_Name_" + Math.ceil(Math.random()*1000)
        var pageNode = new cc.Node(pageName)
        pageWidth = pageWidth ? pageWidth:500
        pageNode.width = pageWidth
        pageHeight = pageHeight ? pageHeight:450
        pageNode.height = pageHeight

        var maskNode = new cc.Node("view")
        maskNode.parent = pageNode
        maskWidth = maskWidth ? maskWidth:pageWidth
        maskHeight = maskHeight ? maskHeight:pageHeight
        maskNode.width = maskWidth
        maskNode.height = maskHeight

        Extend.createMaskComponent(maskNode)

        var contentNode = new cc.Node("content")
        contentNode.parent = maskNode

        var pageComponent = pageNode.addComponent(cc.PageView)
        
        pageComponent.content = contentNode 

        if(isVertical){
            Extend.createVerticalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,0,0,0,null)
            contentNode.setAnchorPoint(cc.p(0.5,1))
            pageComponent.direction = cc.PageView.Direction.Vertical
        }else{
            Extend.createHorizontalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,0,0,0,null)
            contentNode.setAnchorPoint(cc.p(0,0.5))
            pageComponent.direction = cc.PageView.Direction.Horizontal
        }
        return pageNode
    },

    //横向pageView
    createHorizontalPageView:function(pageName,pageWidth,pageHeight,maskWidth,maskHeight){
        pageName = pageName ? pageName:"PageView_Name_" + Math.ceil(Math.random()*1000)
        var pageNode = new cc.Node(pageName)
        pageWidth = pageWidth ? pageWidth:500
        pageNode.width = pageWidth
        pageHeight = pageHeight ? pageHeight:450
        pageNode.height = pageHeight

        var maskNode = new cc.Node("view")
        maskNode.parent = pageNode
        maskWidth = maskWidth ? maskWidth:pageWidth
        maskHeight = maskHeight ? maskHeight:pageHeight
        maskNode.width = maskWidth
        maskNode.height = maskHeight

        Extend.createMaskComponent(maskNode)

        var contentNode = new cc.Node("content")
        contentNode.parent = maskNode
        Extend.createHorizontalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,0,0,0,null)
        contentNode.setAnchorPoint(cc.p(0,0.5))
        contentNode.height = pageHeight

        var pageComponent = pageNode.addComponent(cc.PageView)
        pageComponent.direction = cc.PageView.Direction.Horizontal
        pageComponent.content = contentNode 
       
        return pageNode
    },

    //纵向pageView
    createVerticalPageView:function(pageName,pageWidth,pageHeight,maskWidth,maskHeight){
        pageName = pageName ? pageName:"PageView_Name_" + Math.ceil(Math.random()*1000)
        var pageNode = new cc.Node(pageName)
        pageWidth = pageWidth ? pageWidth:500
        pageNode.width = pageWidth
        pageHeight = pageHeight ? pageHeight:450
        pageNode.height = pageHeight

        var maskNode = new cc.Node("view")
        maskNode.parent = pageNode
        maskWidth = maskWidth ? maskWidth:pageWidth
        maskHeight = maskHeight ? maskHeight:pageHeight
        maskNode.width = maskWidth
        maskNode.height = maskHeight

        Extend.createMaskComponent(maskNode)

        var contentNode = new cc.Node("content")
        Extend.createVerticalLayoutComponent(contentNode,cc.Layout.ResizeMode.CONTAINER,0,0,0,null)
        contentNode.parent = maskNode
        
        contentNode.setAnchorPoint(cc.p(0.5,1))

        var pageComponent = pageNode.addComponent(cc.PageView)
        pageComponent.direction = cc.PageView.Direction.Vertical
        pageComponent.content = contentNode 
       
        return pageNode
    },

    //更新pageview的属性，没有的采用默认参数
    updatePageComponentAttribute:function(pageComponent,sizeMode,scrollThreshold,autoPageTurningThreshold,inertia,brake,elastic,bounceDuration,cancelInnerEvents,pageTurningEventTiming){
        if(!pageComponent){
            cc.log("updatePageComponentAttribute the params of pageComponent is null")
            return
        }
        sizeMode = sizeMode ? sizeMode:cc.PageView.SizeMode.Unified
        scrollThreshold = scrollThreshold? scrollThreshold:0.2
        autoPageTurningThreshold = autoPageTurningThreshold? autoPageTurningThreshold:100
        inertia = inertia? inertia:true
        brake = brake? brake:0.2
        elastic = elastic? elastic:true
        bounceDuration = bounceDuration? bounceDuration:0.5
        //布尔值，是否在滚动行为时取消子节点上注册的触摸事件
        //在子节点上有按钮会很明显，如果为true，那么点击在按钮上移动，按钮点击事件不会触发，只有没有移动的时候才会触发点击事件
        //设置为false，点击移动pageview,点击事件也会触发
        cancelInnerEvents = cancelInnerEvents? cancelInnerEvents:true 
        pageTurningEventTiming = pageTurningEventTiming? pageTurningEventTiming:0.1

        pageComponent.sizeMode = sizeMode
        pageComponent.scrollThreshold = scrollThreshold
        pageComponent.autoPageTurningThreshold = autoPageTurningThreshold
        pageComponent.inertia = inertia
        pageComponent.brake = brake
        pageComponent.elastic = elastic
        pageComponent.bounceDuration = bounceDuration
        pageComponent.cancelInnerEvents = cancelInnerEvents
        pageComponent.pageTurningEventTiming = pageTurningEventTiming
    },

    //设置翻页标识
    setPageIndicator(pageNode,indicatorNode){
         if(!Extend.isNodeValid(pageNode)){
            cc.log("setPageIndicator the params of pageNode is null")
            return 
        }
        var pageComponent = pageNode.getComponent(cc.PageView)
        if(!pageComponent){
            cc.log("setPageIndicator the params of pageNode  has no PageView component")
            return
        }
        if(!Extend.isNodeValid(indicatorNode)){
            cc.log("setPageIndicator the params of indicatorNode is null")
            return 
        }
        var indicatorComp = indicatorNode.getComponent(cc.PageViewIndicator)
        if(!indicatorComp){
            cc.log("setPageIndicator the params of indicatorNode has no PageViewIndicator component")
            return
        }
        pageComponent.indicator = indicatorComp
        indicatorNode.parent = pageNode
    },

    addPageViewPageChangeListener:function(node,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addPageViewPageChangeListener the node is not valide")
            return
        }
        var pageComponent = node.getComponent(cc.PageView)
        if(!pageComponent){
            cc.log("addSrollEventListener the node has no pageComponent")
            return
        }

        node.on("page-turning",callback,target)
    },

    /*################最好采用这些函数来注册事件监听########################*/
    addButtonClickEventListener:function(buttonNode,callback,target){
        if(!Extend.isNodeValid(buttonNode)){
            cc.log("addButtonClickEventListener the params of buttonNode is null")
            return 
        }
        buttonNode.on("click", callback, target);
    },

    addNodeTouchBeginEventListener:function(node,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addNodeTouchBeginEventListener the params of node is null")
            return 
        }
        node.on(cc.Node.EventType.TOUCH_START, callback, target);
    },

    addNodeTouchEndEventListener:function(node,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addNodeTouchEndEventListener the params of node is null")
            return 
        }
        node.on(cc.Node.EventType.TOUCH_END, callback, target);
    },

    addNodeTouchMoveEventListener:function(node,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addNodeTouchMoveEventListener the params of node is null")
            return 
        }
        node.on(cc.Node.EventType.TOUCH_MOVE, callback, target);
    },

    addNodeTouchCancelEventListener:function(node,callback,target){
        if(!Extend.isNodeValid(node)){
            cc.log("addNodeTouchCancelEventListener the params of node is null")
            return 
        }
        node.on(cc.Node.EventType.TOUCH_CANCEL, callback, target);
    },

    addSliderChangeEventListener:function(sliderNode,callback,target){
        if(!Extend.isNodeValid(sliderNode)){
            cc.log("addSliderChangeEventListener the params of sliderNode is null")
            return 
        }
        sliderNode.on("slide", callback, target);
    }


}
module.exports = Extend