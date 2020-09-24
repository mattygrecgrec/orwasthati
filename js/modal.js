
function displayModal() {
    document.getElementById('id01').style.display='block'
}

function closeModal() {
    document.getElementById('id01').style.display='none'
}


document.getElementById('?button').addEventListener('click', displayModal)
document.getElementById('closeModal').addEventListener('click', closeModal)




