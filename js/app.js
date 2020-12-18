console.clear()
const fs = require('fs'),
    draggingOptions = {
        containment: 'parent',
        start(e, ui) {
            let selector = ".container .table.ui-selected"
            positions = []

            $(ui.selected).selectable({
                disabled: false
            })
            $(selector).each(function(i) {
                const el = $(this)

                positions.push([parseInt(el.css('top')), parseInt(el.css('left'))])
            })
        },
        drag(e, ui) {
            const selector = ".container .table.ui-selected",
                  table = $(e.target),
                  relationStart = $(`.relation[data-start-table=${table.data('id')}]`),
                  relationEnd = $(`.relation[data-end-table=${table.data('id')}]`)

            $(selector).each(function(i) {
                const el = $(this),
                    top = positions[i][0] - (ui.originalPosition.top - ui.position.top),
                    left = positions[i][1] - (ui.originalPosition.left - ui.position.left)

                if (el[0].offsetTop > -1 && el[0].offsetLeft > -1) {
                    el.css({
                        top: top, left: left})
                } else if (el[0].offsetTop <= 0 || el[0].offsetLeft <= 0) {
                    el.css({
                        top: top > 0 ? top : -1,
                        left: left > 0 ? left : -1
                    })
                }
            })
        },
        stop(e, ui) {
            $(ui.selected).selectable({
                disabled: true
            })

            let id = this.dataset.id

            app.tables[id].top = ui.position.top
            app.tables[id].left = ui.position.left
        }
    }

let app = new Vue({
    el: '#app',
    data: {
        tables: [],
        relations: [],
        newRelationMode: false,
        newRelation: {
            start: false,
            end: false
        }
    },
    computed: {

    },
    methods: {
        addNewTable(obj=false) {
            const defaultObj = {
                name: '',
                top: 0,
                left: 0,
                cols: [{
                    name: 'id',
                    type: 'BigInteger(255)'
                }]
            }

            this.tables.push(obj ? obj : defaultObj)
            this.$nextTick(() => {
                $('.container .table').draggable(draggingOptions)
            })
        },
        addNewRelation(tableId, colId) {
            if (!this.newRelation.start) {
                this.newRelation.start = [tableId, colId]
            } else if (!this.newRelation.end) {
                this.newRelation.end = [tableId, colId]

                this.relations.push(this.newRelation)

                this.newRelation = {
                    start: false,
                    end: false
                }

                return false;
            }
        },
        save() {
            
        },
        deleteSelected() {
            const ids = []

            $('.table.ui-selected').each((i, el) => {
                ids.push($(el).data('id'))
            })
            ids.sort((a, b) => b - a)

            ids.forEach(el => {
                this.tables.splice(el, 1)
            })
        }
    },
    created() {
        $('#app').show()

        this.addNewTable({
            name: 'projects',
            top: 0,
            left: 0,
            cols: [
                {
                    name: 'id',
                    type: 'BigInteger(255)'
                },
            ]
        })

        this.addNewTable({
            name: 'comments',
            top: 0,
            left: 0,
            cols: [
                {
                    name: 'id',
                    type: 'BigInteger(255)'
                },
                {
                    name: 'project_id',
                    type: 'UnsignedBigInteger(255)'
                }
            ]
        })
        this.$nextTick(() => {
            // this.addRelation()
            // this.relations.push({
            //     start: [0, 0],
            //     end: [1, 1],
            //     top: 0,
            //     left: 0
            // })
            $('.container').selectable({
                filter: '.table',
            })
            $('.container .table').draggable(draggingOptions)
        })
    },
    updated() {
    }
})
