import { createOrderData } from './data.js';
import { createOrderHtml } from './view.js';
import { html } from './view.js';


/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}

/* HELP OVERLAY DISPLAY AND CLOSE */
const handleHelpToggle = (event) => {
    if (event.target == html.other.help){
        html.help.overlay.show()
    } else if (event.target == html.help.cancel) {
        html.help.overlay.close()
    }
}

/*ADD ORDER FUNCTIONS*/
const handleAddToggle = (event) => {
    if (event.target == html.other.add){
        html.add.overlay.show()
    } else if (event.target == html.add.cancel) {
        html.add.overlay.close()
    }
}
const handleAddSubmit = (event) => {
    event.preventDefault()

    const props = {
        title: html.add.title.value,
        table: html.add.table.value,
        column: "ordered"
    }
    const grid = html.other.grid.querySelector(`[data-column=${props.column}]`)

    const orderData = createOrderData(props)
    const order = createOrderHtml(orderData)
    console.log(order)
    grid.appendChild(order)

    //console.log(html.other.grid.querySelector(`[data-id="${orderData.id}"]`))
    console.log(html.other.grid.dataset)
    

    html.add.overlay.close()
    html.add.form.reset()
}

/*EDIT ORDER FUNCTIONS*/
const handleEditToggle = (event) => {
    html.edit.overlay.show()
    

    if (event.target.dataset.id){
        const props = {
            id: event.target.dataset.id,
            title: event.target.querySelector('[data-order-title]').textContent,
            table: event.target.querySelector('[data-order-table]').textContent,
        }

        html.edit.id = props.id
        html.edit.title.setAttribute('value',props.title)
        html.edit.table.selectedIndex = props.table - 1

    } else if (event.target == html.edit.cancel){
        html.edit.form.reset()
        html.edit.overlay.close()
    }
}

const handleEditSubmit = (event) => {
    event.preventDefault()

    const props = {
        id: html.edit.id,
        title: html.edit.title.value,
        table: html.edit.table.value,
        created: new Date(),
        column: html.edit.column.selectedIndex
    }
    const statusCol = {0:"ordered", 1:"preparing", 2:"served"}

    const order = document.querySelector(`[data-id="${html.edit.id}"]`)
    const removeOrder = document.querySelector(`[data-id="${html.edit.id}"]`)
    
    if (props.column == 0 && document.querySelector(`[data-column="ordered"] [data-id="${html.edit.id}"]`)) {
        order.querySelector('[data-order-title]').textContent = html.edit.title.value
        order.querySelector('[data-order-table]').textContent = html.edit.table.value
    } else {

        const newOrder = createOrderHtml(props)
        removeOrder.remove()
        const grid = html.other.grid.querySelector(`[data-column=${statusCol[props.column]}]`)
        grid.appendChild(newOrder)
    }

    html.edit.form.reset()
    html.edit.overlay.close()
}
const handleDelete = (event) => {
    html.edit.overlay.close()
    const order = document.querySelector(`[data-id="${html.edit.id}"]`)
    order.remove()
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}