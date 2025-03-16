// Get the input field, submit button, and task list
const input_text=document.getElementById('input-text')
const submit_btn=document.getElementById('submit-btn')
const tasks_list=document.querySelector('ul')
//add new task
function add_task(){
    const task_text=create_task('task-text')//create task text
    if (!task_text) return;//if task_text is null exit funtion
    const li=document.createElement('li')//new list item to hold task
    li.appendChild(task_text)
    
    const task_btns=document.createElement('div')//div to hold edit and remove button
    task_btns.className='task-btns'

    //create edit and remove button
    const edit_task=create_button('edit-task','fa-solid fa-pen-to-square')
    const remove_task=create_button('remove-task','fa-solid fa-xmark')

    //add buttons to the div 
    task_btns.appendChild(edit_task)
    task_btns.appendChild(remove_task)

    //add div to the list 
    li.append(task_btns)
    tasks_list.appendChild(li)//append list to task_list(ul)

    input_text.value=''//clear input text bar


}
//creates task div
function create_task(classname){
    const taskvalue=input_text.value.trim()
    if(taskvalue===''){
        console.log('enter task')
        return null
    }
    const task_text=document.createElement('div')
    task_text.className=classname
    task_text.textContent=taskvalue

    return task_text
}
//creates a button
function create_button(button_classname,icon_classname){
    const button=document.createElement('button')
    button.className=button_classname
    const icon=create_icon(icon_classname)//calls function to create icon
    button.appendChild(icon)
    return button

}
//creates a icon
function create_icon(icon_classname){
    const icon=document.createElement('i')
    icon.className=icon_classname
    return icon
}
submit_btn.addEventListener('click',add_task)//when button is clicked
input_text.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        add_task()
    }
})//when enter is pressed
