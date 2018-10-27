var Extend = require("Extend")
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        colorPrefabs:[cc.Prefab],
        backround:{
            default:null,
            type:cc.Node,
        },
        node_container:{
            default:null,
            type:cc.Node,
        },
        MIN_COL:5,
        MIN_ROW:4,
        ITEM_WIDTH:56,
        ITEM_HEIGHT:48,
        demo_node:{
            default:null,
            type:cc.Node,
        },

        positionNodes:[cc.Node],
        labelScore:{
            default:null,
            type:cc.Node,
        },
        gameoverFailNodes:[cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this.loadBackgroundItems()

        this.initView()
        this.initShapeNodes()
        this.score = 0
        this.isGameOver = false
        this.isDebugging = false
    },

    initView:function(){
        for(var i = 0;i<this.gameoverFailNodes.length;i++){
            var node = this.gameoverFailNodes[i]
            node.active = false
        }
    },

    initShapeNodes:function(){
        this.shapeNodes = []
        for(var i = 0 ;i< this.positionNodes.length;i++){
            var positionNode = this.positionNodes[i]
            var shapeNode = this.createItems()
            shapeNode.rootNode.parent = positionNode
            this.shapeNodes.push(shapeNode)

            this.addPositionNodeClickEventListener(i)
        }
    },

    addPositionNodeClickEventListener:function(index){
        var positionNode = this.positionNodes[index]
        
        Extend.addNodeTouchBeginEventListener(positionNode,function(){
            if(this.isGameOver){
                return
            }
            if(this.isShing){
                return
            }
            var shapeNode = this.shapeNodes[index]
            if(shapeNode){
                shapeNode.rootNode.setPositionY(50)
                shapeNode.rootNode.setScale(0.95)
            }
        },this)

        Extend.addNodeTouchEndEventListener(positionNode,function(){
            if(this.isGameOver){
                return
            }
            if(this.isShing){
                return
            }
            this.onTouchEndOrCancelFunctionNode(index)
        },this)

        Extend.addNodeTouchCancelEventListener(positionNode,function(){
            if(this.isGameOver){
                return
            }
            if(this.isShing){
                return
            }
            this.onTouchEndOrCancelFunctionNode(index)
        },this)

        Extend.addNodeTouchMoveEventListener(positionNode,function(event){
            if(this.isGameOver){
                return
            }
            if(this.isShing){
                return
            }
            this.onTouchMoveFunctionNode(index,event)
        },this)
    },

    onTouchEndOrCancelFunctionNode:function(index){
        if(this.selectBackgroundItems != null && this.selectBackgroundItems.length > 0){
            for(var i = 0;i<this.currentShapeNode.subNodes.length;i++){
                var subNode = this.currentShapeNode.subNodes[i]
                var backgroundItem = this.selectBackgroundItems[i]
                var boxComponent = backgroundItem.getComponent("BoxItem")
                boxComponent.addShapeNode(subNode)
            }
            
            var newShapeNode = this.createItems()
            newShapeNode.rootNode.parent = this.currentShapeNode.rootNode.parent
            this.shapeNodes[index] = newShapeNode
            this.currentShapeNode.rootNode.parent = null
            this.selectBackgroundItems = []

            this.score = this.score +  this.currentShapeNode.configType * 50
            this.updateScore()
        }
        var shapeNode = this.shapeNodes[index]
        if(shapeNode){
            shapeNode.rootNode.setPositionY(0)
            shapeNode.rootNode.setPositionX(0)
            shapeNode.rootNode.setScale(1)
        }
        this.currentShapeNode = null

        this.checkCanScore()

        var result = this.checkGameOver()
        if(result == true){
            this.gameFail()
        }
    },

    gameFail:function(){
        for(var i = 0;i<this.gameoverFailNodes.length;i++){
            var node = this.gameoverFailNodes[i]
            node.active = true
        }
        cc.log("你已经输了")
      //  this.isGameOver = true
    },

    onTouchMoveFunctionNode:function(index,event){
        var shapeNode = this.shapeNodes[index]
        var deltaPosition = event.getDelta()
        var prePosition = shapeNode.rootNode.getPosition()
        shapeNode.rootNode.setPosition(cc.p(prePosition.x + deltaPosition.x,prePosition.y + deltaPosition.y))

        this.currentShapeNode = shapeNode

        this.tryHighLightBackground()
    },

    checkBoxValidByIndex:function(index){
        var boxItem = this.allbackgroundItems[index]
        if(boxItem == null){
            cc.log("###检测到错误的index####",index)
            return false
        }
        var boxComponent = boxItem.getComponent("BoxItem")
        return boxComponent.isBoxValid()
    },

    checkCanScore:function(){

        var allScoreItemIndexs = []
        //:-----横向
        var minLine = 1
        var maxLine = 1 + 2 * this.MIN_ROW
        var count = 0
        //cc.log("横向数据开始:")
        for(var i = minLine;i<=maxLine;i++){
            var minCount = count + 1
            var maxCount = 0
            if(i <= (minLine + maxLine)/2){
                maxCount = minCount + i - 1 + this.MIN_ROW
            }else{
                maxCount = minCount + (maxLine - i) + this.MIN_ROW
            }
         //   var str = "第" + i + "行数据:"
            var lines = []
            var isLineScore = true
            for(var j = minCount;j<= maxCount;j++){
                if(this.checkBoxValidByIndex(j-1) == true){
                    isLineScore = false
                    break
                }else{
                    lines.push(j)
                }
            //    str += ("-"+j)
            }
            if(isLineScore){
                for(var temp = 0;temp < lines.length;temp++){
                    allScoreItemIndexs.push(lines[temp])
                }
            }
            //cc.log(str)
            count += (maxCount - minCount + 1)
        }

        cc.log("向左倾斜数据开始:")
        for(var i = 0;i<2*this.MIN_ROW + 1;i++){
            var startRow = 0
            var startCol = 0
            var count = 0
            if(i<=this.MIN_ROW){
                startRow = 1
                startCol = i + 1
                count = this.MIN_ROW + 1 + i
            }else{
                startRow = 1 + i - this.MIN_ROW
                startCol = this.getColByRow(startRow)
                count = 3*this.MIN_ROW + 1 - i
            }
            var isLineScore = true
            var list = []
            var index = this.getIndexByRowCol(startRow,startCol)
            if(this.checkBoxValidByIndex(index-1) == true){
                isLineScore = false
            }else{
                
                list.push(index)

                for(var j = 1;j<count;j++){
                    var nextRow = startRow + j
                    var nextCol = 0
                    if(nextRow <= this.MIN_ROW){
                        nextCol = startCol
                    }else{
                        nextCol = startCol - (nextRow - this.MIN_ROW - 1)
                    }
                    
                    var index = this.getIndexByRowCol(nextRow,nextCol)
                    if(this.checkBoxValidByIndex(index-1) == false){
                        list.push(index)
                    }else{
                        isLineScore = false
                        break
                    }
                }
            }
            
            if(isLineScore){
                for(var temp = 0;temp < list.length;temp++){
                    allScoreItemIndexs.push(list[temp])
                }
            }

      
        }

        
        //:向右倾斜判定方法一
        cc.log("向右倾斜数据开始:")
        for(var i = 0;i<2*this.MIN_ROW + 1;i++){
            var startRow = 0
            var startCol = 0
            var count = 0
            if(i<=this.MIN_ROW){
                startRow = this.MIN_ROW + 1 - i
                startCol = 1
                count = this.MIN_ROW + 1 + i
            }else{
                startRow = 1
                startCol = 1 + i - this.MIN_ROW
                count = 3*this.MIN_ROW + 1 - i
            }

            var list = []
            var isLineScore = true
            var index = this.getIndexByRowCol(startRow,startCol)
            if(this.checkBoxValidByIndex(index-1) == true){
                isLineScore = false
            }else{
                list.push(index)
                for(var j = 1;j<count;j++){
                    var nextRow = startRow + j
                    var nextCol = 0
                    if(nextRow <= this.MIN_ROW + 1){
                        nextCol = startCol + j
                    }else{
                        nextCol = startCol + j - (nextRow - this.MIN_ROW-1)
                    }
                    index = this.getIndexByRowCol(nextRow,nextCol)
                    if(this.checkBoxValidByIndex(index -1) == false){
                        list.push(index)
                    }else{
                        isLineScore = false
                        break
                    }
                }
            }

            if(isLineScore){
                for(var temp = 0;temp < list.length;temp++){
                    allScoreItemIndexs.push(list[temp])
                }
            }
            
            
        }

        this.allScoreItemIndexs = allScoreItemIndexs
        if(this.isDebugging){
             this.tryShineBox()
         }else{
            this.tryRemoveScoreItems()
         }
    },

    //为了方便调试
    tryShineBox:function(){

        if(this.allScoreItemIndexs && this.allScoreItemIndexs.length > 0){
            var count = 0
            this.isShing = true
            for(var temp = 0;temp<this.allScoreItemIndexs.length;temp++){
                var index = this.allScoreItemIndexs[temp] - 1
                var boxItem = this.allbackgroundItems[index]
                var boxComponent = boxItem.getComponent("BoxItem")
                var tempThis = this
                boxComponent.beginShine(function(times){
                    count += times
                    if(count == tempThis.allScoreItemIndexs.length){
                        tempThis.tryRemoveScoreItems()
                    }
                })
            }
        }
    },

    tryRemoveScoreItems:function(){
        this.isShing = false
        for(var temp = 0;temp<this.allScoreItemIndexs.length;temp++){
            var index = this.allScoreItemIndexs[temp] - 1
            var boxItem = this.allbackgroundItems[index]
            var boxComponent = boxItem.getComponent("BoxItem")
            boxComponent.removeShapeNode()
        }

        this.score += this.allScoreItemIndexs.length * 10
        this.updateScore()
        this.allScoreItemIndexs = []
    },



    updateScore:function(){
        cc.log("updateScore",this.score)
        this.labelScore.getComponent("cc.Label").string = this.score
    },

    //高亮显示可以放置的格子
    tryHighLightBackground:function(){
        if(this.currentShapeNode == null){
            return
        }
        if(this.selectBackgroundItems){
            for(var i = 0;i<this.selectBackgroundItems.length;i++){
                var item = this.selectBackgroundItems[i]
                var boxComponent = item.getComponent("BoxItem")
                boxComponent.hideSelected()
            }
        }
        this.selectBackgroundItems = []
        var hitShapeNodeMaps = []
        var firstSubNode = this.currentShapeNode.subNodes[0]
        var isFirstHit = false
        for(var i = 0;i<this.allbackgroundItems.length;i++){
            var curItem = this.allbackgroundItems[i]
            var boxComponent = curItem.getComponent("BoxItem")
            if(boxComponent.isBoxValid()){
                var worldPosition = this.currentShapeNode.rootNode.convertToWorldSpace(firstSubNode.getPosition())
                var nodeContainerLocalPosition = this.node_container.convertToNodeSpace(worldPosition)

                var deltaX = Math.abs(nodeContainerLocalPosition.x - curItem.x)
                var deltaY = Math.abs(nodeContainerLocalPosition.y - curItem.y)
                if(deltaX < this.ITEM_WIDTH/2-5 && deltaY < this.ITEM_HEIGHT/2-5){
                    isFirstHit = true
                    hitShapeNodeMaps.push(curItem)
                    break
                }
            }
        }

        if(isFirstHit == false){
            return
        }
        cc.log("第一个格子符合:",hitShapeNodeMaps[0].index)
        for(var i = 1;i<this.currentShapeNode.subNodes.length;i++){
            var curSubNode = this.currentShapeNode.subNodes[i]
            var deltaRow = curSubNode.row - firstSubNode.row
            var deltaCol = curSubNode.col - firstSubNode.col

            var nextRow = hitShapeNodeMaps[0].row + deltaRow
            var nextCol = hitShapeNodeMaps[0].col + deltaCol
            var delta = 0
            if(nextRow > this.MIN_ROW + 1){
                delta = deltaRow
                if(hitShapeNodeMaps[0].row < this.MIN_ROW + 1){
                    delta = nextRow -  this.MIN_ROW - 1
                }
                nextCol = nextCol - delta
            }
            cc.log("下一个格子",nextRow,nextCol,deltaRow,deltaCol,delta,hitShapeNodeMaps[0].row)
            var index = this.getIndexByRowCol(nextRow,nextCol)
            if(nextCol <= this.getColByRow(nextRow) && nextCol >= 1  && nextRow >=1 && nextRow <= 2*this.MIN_ROW + 1){
                if(this.checkBoxValidByIndex(index-1) == false){
                    return
                }else{
                    var backgroundItem = this.allbackgroundItems[index - 1]
                    hitShapeNodeMaps.push(backgroundItem) 
                }
            }else{
                return
            }
        }


/*  笨方法:选中的形状每个格子都去遍历
        for(var i = 0;i<this.currentShapeNode.subNodes.length;i++)
        {
            hitShapeNodeMaps.push(null)
            var curSubNode = this.currentShapeNode.subNodes[i]
            var worldPosition = this.currentShapeNode.rootNode.convertToWorldSpace(curSubNode.getPosition())
            var nodeContainerLocalPosition = this.node_container.convertToNodeSpace(worldPosition)
            var isCurHit = false
            for(var j = 0;j<this.allbackgroundItems.length;j++){
                var curItem = this.allbackgroundItems[j]
                var boxComponent = curItem.getComponent("BoxItem")
                if(boxComponent.isBoxValid()){
                    var deltaX = Math.abs(nodeContainerLocalPosition.x - curItem.x)
                    var deltaY = Math.abs(nodeContainerLocalPosition.y - curItem.y)
                    if(deltaX < this.ITEM_WIDTH/2-5 && deltaY < this.ITEM_HEIGHT/2-5){
                        isCurHit = true
                        hitShapeNodeMaps[i] = curItem
                        break
                    }
                }
            }

            if(isCurHit == false){
                isAllHit = false
                break
            }
        }
*/
        this.selectBackgroundItems = hitShapeNodeMaps
        for(var i = 0;i<this.selectBackgroundItems.length;i++){
            var item = this.selectBackgroundItems[i]
            var boxComponent = item.getComponent("BoxItem")
            boxComponent.showSelected()
            cc.log(item.index)
        }
    },

    checkGameOver:function(){
        for(var i = 0;i<this.shapeNodes.length;i++){
            var shapeNode = this.shapeNodes[i]
            if(shapeNode.configType == 1){
                return false
            }
        }

        this.allIdleBackgroundItems = []
        for(var i = 0;i<this.allbackgroundItems.length;i++){
            var backgroundItem = this.allbackgroundItems[i]
            var boxComponent = backgroundItem.getComponent("BoxItem")
            if(boxComponent.isBoxValid() == true){
                this.allIdleBackgroundItems.push(backgroundItem)
            }
        }

        for(var i = 0;i<this.shapeNodes.length;i++){
            var shapeNode = this.shapeNodes[i]
            if(this.checkShapeNodeCanPutIn(shapeNode)){
                return false
            }
        }

        return true
    },

    checkShapeNodeCanPutIn:function(shapeNode){
        if(shapeNode == null){
            return false
        }
        var allSubNodes = shapeNode.subNodes
        var firstSubNode = allSubNodes[0]
        for(var i = 0;i<this.allIdleBackgroundItems.length;i++){
            var curIdleItem = this.allIdleBackgroundItems[i]
            var canPutIn = true
            var list = []
            list.push(curIdleItem.index)
            for(var j = 1;j <allSubNodes.length;j++){
                var curSubNode = allSubNodes[j]
                var deltaRow = curSubNode.row - firstSubNode.row
                var deltaCol = curSubNode.col - firstSubNode.col


                var nextRow = curIdleItem.row + deltaRow
                var nextCol = curIdleItem.col + deltaCol

                var delta = 0
                if(nextRow > this.MIN_ROW + 1){
                    delta = deltaRow
                    if(curIdleItem.row < this.MIN_ROW + 1){
                        delta = nextRow -  this.MIN_ROW - 1
                    }
                    nextCol = nextCol - delta
                }

                var index = this.getIndexByRowCol(nextRow,nextCol)
                if(nextCol <= this.getColByRow(nextRow) && nextCol >= 1  && nextRow >=1 && nextRow <= 2*this.MIN_ROW + 1){
                    if(this.checkBoxValidByIndex(index-1) == false){
                        canPutIn = false
                        break
                    }else{
                        list.push(index)
                    }
                }else{
                    canPutIn = false
                }
            }
            if(canPutIn){
                for(var temp = 0;temp<list.length;temp++){
                    cc.log(list[temp])
                }
                return true
            }
        }
        return false
    },

    //row和col对应的格子id
    getIndexByRowCol:function(row,col){
        var ret = 0
        for(var i = 1;i < row;i++){
            if(i<=this.MIN_ROW + 1){
                ret += (this.MIN_ROW + i)
            }else{
                ret += (3*this.MIN_ROW + 2 -i)
            }
        }
        ret = ret + col
        return ret
    },

    //row对应的行有多少个格子
    getColByRow:function(row){
        if(row<=this.MIN_ROW + 1){
            return this.MIN_ROW + row
        }else{
            return 3*this.MIN_ROW + 2 -row
        }
    },

    loadBackgroundItems:function(){
        //60,69
        this.allbackgroundItems = []
        var WIDTH = this.ITEM_WIDTH
        var HEIGHT = this.ITEM_HEIGHT
        var MIN_ROW = this.MIN_ROW
        var MIN_COL = this.MIN_COL
        var count = 0
        for(var i = -1 * MIN_ROW;i <= 1 * MIN_ROW;i++)
        {

            var curRow = MIN_ROW + i + 1
            var curCol = this.getColByRow(curRow)
            var positionY = 0
            
            positionY = this.backround.getPositionY() + i * HEIGHT

            var leftX = -1 * (Math.floor(curCol-1)/2) * WIDTH + this.backround.getPositionX()
            for(var j = 1;j <= curCol;j++)
            {
                count++
                var curX = leftX + (j - 1) * WIDTH
                this.loadItem(count,cc.p(curX,positionY),curRow,j)
            }
        }
    },

    loadItem:function(index,position,row,col){
        var node = new cc.Node("node" + index)
        var component = node.addComponent("BoxItem")
        component.init(index)
        node.parent = this.node_container
        node.setPosition(position)
        this.allbackgroundItems.push(node)
        node.row = row
        node.col = col
        node.index = index
    },

    onClickRandom:function(){

        var randomInt = Math.floor(Math.random() * this.shapeNodes.length)
        var positionNode = this.positionNodes[randomInt]
        positionNode.removeAllChildren()
        var newShapeNode = this.createItems()
        newShapeNode.rootNode.parent = positionNode
        this.shapeNodes[randomInt] = newShapeNode

    },

    createItems:function(){

        var ShapeConfigs = require("./shape/ShapeConfigs")
        var rootNode = new cc.Node()
        
        var numbers = Math.ceil(Math.random() * 4)
        var configs = null
        if(numbers == 1){
            configs = ShapeConfigs.Shape_One
        }else if(numbers == 2){
            configs = ShapeConfigs.Shape_Two
        }else if(numbers == 3){
            configs = ShapeConfigs.Shape_Three
        }else if(numbers == 4){
            configs = ShapeConfigs.Shape_Tour
        }

        var  randomInt = Math.floor(Math.random() * configs.length)

        
        var shapeNode = {}
        var config = configs[randomInt]
        shapeNode.config = config
        shapeNode.configType = numbers
        shapeNode.subNodes = []
        shapeNode.rootNode = rootNode
        for(var i = 0;i < config.length;i++){
            if(config[i] > 0){
                var row = Math.ceil((i + 1)/numbers)
                var col = i - (row - 1) * numbers + 1
                var leftX = -1 * (row - 1) * this.ITEM_WIDTH/2
                var positionY = (row - 1) * this.ITEM_HEIGHT
                var positionX = leftX + (col - 1) * this.ITEM_WIDTH
                var itemNode = cc.instantiate(this.colorPrefabs[numbers - 1])
                itemNode.setPosition(cc.p(positionX,positionY))
                itemNode.parent = rootNode
                shapeNode.subNodes.push(itemNode)
                itemNode.row = row
                itemNode.col = col
            }
            
        }
        
        
        return shapeNode
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
