import {guid} from "./util";

class CURDTreeMem {

    constructor({
                    newEntity = () => {
                        return {}
                    },
                    params = null,
                    parentField = "parent",
                    childrenField = "children",
                    emit
                }
    ) {

        this.newEntity = newEntity
        // 数据相关属性
        // this.start = 0  //树表不能实现分页，暂时不使用
        // this.limit = limit //树表不能实现分页，暂时不使用
        this.filters = params // 固定的查询参数
        this.params = {}
        this.total = 0
        this.data = []
        this.active = []
        this.open = []
        this.dataMap = {} //id 为key 的数据索引
        this.keyword = ''
        // 状态相关属性
        this.selection = null
        this.loading = false
        this.create = false
        this.edit = false
        this.detail = false
        this.deleteDialog = false
        this.editing = 0 // 非编辑状态 -1, 新增状态 1, 编辑状态2
        this.saving = false // 保存状态
        this.entity = this.newEntity() // 当前正在编辑的实体对象
        this.invalid = false // 是否校验有效
        this.validator = null // 表单校验器
        this.error = false // 保存时是否有错误
        this.errorMessage = null // 错误信息
        this.parentField = parentField //关联上级的字段名
        this.childrenField = childrenField //子节点的字段
        this.currentEdit = null // 当前编辑的节点的id
        this.emit = emit

    }


    // 从外部赋值树状数据
    setData(data) {
        data.forEach(node => {
            if (!node.id) {
                node.id = guid()
            }
            this.dataMap[node.id] = node
            this._setParent(node)
        })
        this.data = data
    }

    _setParent(parent) {
        if (!parent[this.childrenField]) parent[this.childrenField] = []
        let children = parent[this.childrenField]
        children.forEach(node => {
            if (!node.id) {
                node.id = guid()
            }
            node._parent = parent.id
            this.dataMap[node.id] = node
            this._setParent(node)
        })
    }

    _isOpen(id) {
        for (let i = 0; i < this.open.length; i++) {
            if (this.open[i] === id) {
                return true
            }
        }
        return false
    }

    /**
     * 打开新建界面
     */
    openNew(item) {
        this.error = null
        let entity = this.newEntity()
        if (item) {
            entity._parent = item.id
        }

        this.entity = entity
        this.create = true
    }

    /**
     * 取消并关闭新建界面
     */
    cancelNew() {
        this.create = false
    }

    saveNew() {
        if (this.validator) {
            this.validator.$touch()
            if (this.validator.$invalid) {
                return
            }
        }

        this.saving = true
        let parent = this.dataMap[this.entity._parent]
        let entity = this.entity
        entity[this.childrenField] = []
        if (!entity.id) {
            entity.id = guid()
        }
        // if (parent) entity._parent = parent
        if (parent) {
            if (!parent[this.childrenField]) parent[this.childrenField] = []
            parent[this.childrenField].push(entity)
            if (!this._isOpen(parent.id)) this.open.push(parent.id)
        } else {
            this.data.push(entity)
        }
        this.dataMap[entity.id] = entity
        this.saving = false
        this.create = false
        if (this.emit !== null) this.emit(this.data)
    }

    select(items) {
        if (items.length === 0) {
            this.selection = null
        }
        this.selection = this.dataMap[items[0]]
        //根据ID转换成对象
    }

    /**
     *  打开编辑界面,编辑当前选择数据
     * @param entity
     */
    openEdit(entity) {
        this.error = null
        if (entity !== undefined) {
            this.entity = {...entity}
            this.edit = true
            return
        }
        if (this.selection.length > 0) {
            this.entity = {...this.selection[0]}
            this.edit = true
        }
    }

    cancelEdit() {
        this.edit = false
    }

    saveEdit() {
        if (this.validator) {
            this.validator.$touch()
            if (this.validator.$invalid) {
                return
            }
        }

        this.saving = true
        let data = this.dataMap[this.entity.id]
        Object.keys(data).forEach((k) => {
            if (k === this.childrenField) return
            data[k] = this.entity[k]
        })
        this.saving = false
        this.edit = false
        if (this.emit !== null) this.emit(this.data)
    }

    openDetail(entity) {
        if (entity === undefined) {
            return
        }
        this.entity = entity
        this.detail = true
    }

    deleteOne(item) {
        let x = -1
        let p = null

        if (item._parent && this.dataMap[item._parent]) {
            p = this.dataMap[item._parent].children
        } else { //没有上级，就是根节点
            p = this.data
        }
        for (let i = 0; i < p.length; i++) {
            if (p[i].id === item.id) {
                x = i
                break
            }
        }
        if (x >= 0) {
            p.splice(x, 1)
        }

        if (this.emit !== null) this.emit(this.data)
    }


}

export var CurdTreeMemMixin = {

    props: {
        value: {
            type: [Array, Object],
            required: true
        },
        filter: {
            type: Object,
        },
        fetchSearch: {
            type: Function
        },
        newEntity: {
            type: Function
        },
        itemChildren: {
            type: String,
            default: "children"
        },
        itemParent: {
            type: String,
            default: "parent"
        }
    },
    data: () => ({
        curd: null,
    }),

    created() {
        let newEntity = this.newEntity ? this.newEntity : undefined
        this.curd = new CURDTreeMem({
            newEntity,
            childrenField: this.itemChildren,
            parentField: this.itemParent,
            emit: this.dataChange
        })
        if (this.value) {
            this.curd.setData(this.value)
        } else {
            this.curd.setData([])

        }
    },

    computed: {},
    methods: {
        select(item) {
            this.curd.select(item)
        },
        dataChange(data) {
            this.$emit("input", data)
        }
    },
    watch: {
        value(v) {
            if (this.value) {
                this.curd.setData(v)
            } else {
                this.curd.setData([])

            }
        }
    }


}
export default CURDTreeMem
