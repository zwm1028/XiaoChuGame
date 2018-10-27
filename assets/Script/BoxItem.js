var Extend = require("Extend")
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
    },


    init:function(index){
        this.index = index

        var tempThis = this
        Extend.asyncCreateSpriteWithPng("pics/kuang",function(node){
            tempThis.onLoadSprite(node)
        })


        Extend.asyncCreateSpriteWithPlist("pics/pics","kuangLiang",function(node){
            tempThis.onLoadSelectedSprite(node)
        })

        this.isSelected = false
         
    },

    onLoadSprite:function(node){
        var backgroundNode = node
        backgroundNode.parent = this.node
        backgroundNode.setScale(0.95)

        var label = Extend.createSystemLabel(this.index)
        backgroundNode.addChild(label)
        label.zIndex = 3
        label.parent = this.node
        label.setPosition(backgroundNode.getPosition())


        this.backgroundNode = backgroundNode
        this.addTouchEventListener()
    },

    onLoadSelectedSprite:function(node){
        var selectNode = node
        selectNode.parent = this.node
        selectNode.setScale(0.95)
        selectNode.active = this.isSelected
        this.selectNode = selectNode
    },

    addTouchEventListener:function(){
        Extend.addNodeTouchEndEventListener(this.backgroundNode,function(event){
            cc.log("点击了:",this.index)
        },this)
    },

    showSelected:function(){
        this.isSelected = true
        this.selectNode.active = true
        this.backgroundNode.active = false
    },

    hideSelected:function(){
        this.isSelected = false
        this.selectNode.active = false
        this.backgroundNode.active = true
    },

    addShapeNode:function(subNode){
        if(subNode == null){
            return
        }
        this.isSelected = false
        this.selectNode.active = false
        subNode.parent = this.node
        this.subNode = subNode
        this.subNode.setPosition(cc.p(0,0))

        this.backgroundNode.active = false
    },

    removeShapeNode:function(){
        if(this.subNode){
            this.backgroundNode.active = true
            this.selectNode.active = false
            this.subNode.parent = null
            this.subNode = null
        }
    },

    isBoxValid:function(){
        if(this.subNode){
            return false
        }
        return true
    },

    //为了方便调试
    beginShine:function(callback){

        if(this.isShining){
            this.callingTimes++
            return
        }
        this.callingTimes = 1
        this.shineTime = 0
        this.isShining = true
        var totalTimes = 4
        this.schedule(function(dt){
            this.shineTime++
            if(this.shineTime%2 == 0){
                this.showSelected() 
                if(this.subNode){
                    this.subNode.active = true
                }
            }else{
               this.hideSelected()
               if(this.subNode){
                    this.subNode.active = false
                }
            }
            if(this.shineTime == totalTimes){
                this.isShining = false
                if(this.subNode){
                    this.subNode.active = true
                }
                this.hideSelected()

               if(callback)
                {
                    callback(this.callingTimes)
                    this.callingTimes = 0
                } 
            }
            
        },0.5,totalTimes)
    },

});

//hexagon
//shape