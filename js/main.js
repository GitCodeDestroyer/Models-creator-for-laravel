const fs = require('fs'),
    draggingOptions = {
        start() {
            let selector = ".container .table.ui-selected"
            positions = []

            $(ui.selected).selectable({disabled: false})
            $(selector).each(function(i) {
                const el = $(this)

                positions.push([el.css('top'), el.css('left')])
            })
        },
        drag(e, ui) {
            let selector = ".container .table.ui-selected"

            $(selector).each(function(i) {
                const el = $(this),
                    top = parseInt(positions[i][0]) - (ui.originalPosition.top - ui.position.top),
                    left = parseInt(positions[i][1]) - (ui.originalPosition.left - ui.position.left)

                if (el[0].offsetTop > -1 && el[0].offsetLeft > -1) {
                    el.css({
                        top: top,
                        left: left
                    })
                } else if (el[0].offsetTop <= 0 || el[0].offsetLeft <= 0) {
                    el.css({
                        top: top > 0 ? top : -1,
                        left: left > 0 ? left : -1
                    })
                }
            })
        },
        stop() {
            $(ui.selected).selectable({disabled: true})
        }
    }

let TableDragged = true,
    positions = []

function newElement(elementName, className, additional={}) {
    return $(`<${elementName}/>`,
        Object.assign({
            class: className
        }, additional)
    )
}


$('.table').draggable({
    containment: 'parent',
})

$('.new-table').click(function() {
    // <div class="table">
    //     <div class="name"></div>
    //     <div class="cols">
    //     </div>
    // </div>
    let tableContainer = newElement('div', 'table'),
        tableName = newElement('div', 'name'),
        tableCols = newElement('div', 'cols'),
        tableCol = newElement('div', 'col')

        tableName.append([
            newElement('input')
        ])
        tableCol.append([
            newElement('input', 'col-name'),
            newElement('input', 'col-type')
        ])
        tableCols.append(tableCol)
        tableContainer.append([
            tableName,
            tableCols
        ]).appendTo($('.container'))
})

$('.container').selectable({
    filter: '.table',
    selected(e, ui) {
        $(ui.selected).draggable(draggingOptions)
    },
})