const input_text=document.getElementById('input-text')
const submit_btn=document.getElementById('submit-btn')
const tasks_list=document.querySelector('ul')
const clear_all_btn=document.getElementById('clear-all')
const task_counter=document.getElementById('task-counter')
const speech_btn=document.getElementById('voice-icon')
const prioritySelected=document.getElementById('priority')
const priorityColor=document.getElementById('priority-circle')

const priorityColorValues={
    low:'green',
    medium:'orange',
    high:'red'
}
prioritySelected.addEventListener('change',()=>{
    const choosenPriority=prioritySelected.value

    if(choosenPriority=='default'){
        priorityColor.style.backgroundColor='White'

    }
    else{
        priorityColor.style.backgroundColor=priorityColorValues[choosenPriority]

    }
})



function add_task(){
    numberOfTasks=update_task_counter()
    if(numberOfTasks>=15){
        show_toast("Remove some tasks before adding new ones.", "\u26A0\uFE0F");
        return 
    }
    const task_text=create_task('task-text')//create task text
    if (!task_text) return;//if task_text is null exit funtion
    const li=document.createElement('li')//new list item to hold task
    const task_priority=document.createElement('span')
    task_priority.className='task_priority'
    const priority_value=prioritySelected.value
    task_priority.style.backgroundColor=priorityColorValues[priority_value]
    li.append(task_priority)
    li.appendChild(task_text)
    const task_btns=document.createElement('div')//div to hold edit and remove button
    task_btns.className='task-btns'   
    const edit_task=create_button('edit-task','fa-solid fa-pen-to-square')
    const remove_task=create_button('remove-task','fa-solid fa-check')
    
    //edit task
    edit_task.addEventListener('click',function (){
        edit_task_function(li)
    })

    //remove task
    remove_task.addEventListener('click',function(){
        show_toast("Deleted.Your to-do list just got lighter.","\uD83C\uDFC6")
        li.remove()
        numberOfTasks=update_task_counter()
        save_task_to_storage()
    })
    


    
    task_btns.appendChild(edit_task)
    task_btns.appendChild(remove_task)

    //add div to the list 
    li.append(task_btns)
    tasks_list.appendChild(li)//append list to task_list(ul)


    input_text.value=''//clear input text bar
    numberOfTasks=update_task_counter()
    save_task_to_storage() 

}
//creates task div
function create_task(classname){
    const taskvalue=input_text.value.trim()
    if(taskvalue===''){
        show_toast("Your list won’t fill itself. Let’s add a task!","\u26A0\uFE0F");
        return null;
    }
    const task_text=document.createElement('div')
    task_text.className=classname
    task_text.textContent=taskvalue

    return task_text
}

function create_button(button_classname,icon_classname){
    const button=document.createElement('button')
    button.className=button_classname
    const icon=create_icon(icon_classname)//calls function to create icon
    button.appendChild(icon)
    return button

}

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


function edit_task_function(li){
    const task_text=li.querySelector('.task-text')
    const input=document.createElement('input')
    input.type='text'
    input.className='edit-input'
    input.value = task_text.textContent;

    task_text.replaceWith(input)
    input.focus();
    //saves the changes made
    function save_task(){
        const new_value=input.value.trim()
        if (new_value === '') {
            show_toast("Empty edits are a no-go!", "\u26A0\uFE0F");
            input.focus();
            return;
        }
        //change classname back to task-text
        const updated_task = document.createElement('div');
        updated_task.className = 'task-text';
        updated_task.textContent = new_value;
        input.replaceWith(updated_task);
        show_toast("Task updated successfully!", "\u2705");
        save_task_to_storage()
        li.querySelector('.edit-task').addEventListener('click', function () {
            edit_task_function(li);
        });

        
    }
    input.addEventListener('blur', save_task);
    input.addEventListener('keypress', function (event) {
        event.stopPropagation(); // Prevent Enter from triggering add_task()
        if (event.key === 'Enter') save_task();
    });
}


function clear_all(){
    if(tasks_list.children.length==0){
    show_toast("You can’t delete what doesn’t exist. ","\uD83D\uDE09");
    }
    else{
        tasks_list.innerHTML=''
        localStorage.removeItem("tasks") //remove tasks array from storage
        show_toast("Done and dusted!Your list is all clear.","\u2728")
        update_task_counter()
       
    }
    
}

function update_task_counter(){
    const task_count=tasks_list.children.length
    task_counter.innerText=task_count
    return task_count
}

function save_task_to_storage(){
    const tasks=[] //create an array to store task
    document.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('.task-text')?.textContent;
        const priorityColor = li.querySelector('.task_priority')?.style.backgroundColor;
        let priority = Object.keys(priorityColorValues).find(key => priorityColorValues[key] === priorityColor);

        if (taskText && priority) {
            tasks.push({ text: taskText, priority });
        }
    });
    localStorage.setItem("tasks",JSON.stringify(tasks))
}
function load_task_from_storage(){
    const tasks=JSON.parse(localStorage.getItem("tasks")) || []  //get the task list or empty array if there is no task
    tasks.forEach(task=>{
        input_text.value=task.text 
        prioritySelected.value = task.priority;
        priorityColor.style.backgroundColor = priorityColorValues[task.priority];
        add_task()
    })


}
window.addEventListener('load',load_task_from_storage)
//toast msg
function show_toast(message,emoji){
    const toast=document.getElementById('custom-toast')
    const toast_message=document.getElementById('toast-message')
    toast_message.innerHTML=`<span style="font-size:20px;">${emoji}</span> ${message}`
    toast.classList.add('show')//adds show to the classname (.toast.show)
    toast.classList.remove('hide')//removes the hide from classname (.toast.hide)
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    }, 3000);
}

speech_btn.addEventListener('click',()=>{
    if(!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)){
        show_toast('Speech Recognition is NOT supported in this browser.,\uD83D\uDE1E')

    }
    const recognition=new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang='en-US'
    recognition.continuous=false
    recognition.interimResults=false
    recognition.start()
    speech_btn.style.color='rgb(85, 179, 76)'
    recognition.onresult=function (e){
        const spokenText = e.results[0][0].transcript;
        input_text.value=spokenText

    }
    recognition.onerror=function(e){
        show_toast('Oops, speech recognition error.', '\uD83D\uDE16')
    }
    recognition.onend=function(){
         speech_btn.style.color=' #2e2e2e'
    }
    
})
clear_all_btn.addEventListener('click',clear_all)
update_task_counter()