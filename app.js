const table = document.querySelector('#myTable'); 
const form = document.querySelector('#myForm');
//Displaying
function renderUsers(doc, i){
    /*let tr = document.createElement('tr');
    let ind = document.createElement('td');
    let first = document.createElement('td');
    let last = document.createElement('td');
    let handle = document.createElement('td'); 
    tr.setAttribute('data-id', doc.id);
    ind.textContent = ++i;
    first.textContent = doc.data().FirstName;
    last.textContent = doc.data().LastName;
    handle.textContent = doc.data().UserName;
    tr.appendChild(ind);
    tr.appendChild(first);
    tr.appendChild(last);
    tr.appendChild(handle);
    table.appendChild(tr);*/
    tr = table.insertRow();
    //tr.setAttribute('id', doc.id);
    tr.insertCell(0).innerHTML = i;
    tr.insertCell(1).innerHTML = doc.data().FirstName;
    tr.insertCell(2).innerHTML = doc.data().LastName;
    tr.insertCell(3).innerHTML = doc.data().UserName;
    let up = document.createElement('input');
    let del = document.createElement('input');
    up.setAttribute('type', 'button');
    up.setAttribute('value', '+');
    up.setAttribute('id', doc.id);
    up.setAttribute('onclick', 'updateDoc(this.id);');
    tr.insertCell(4).appendChild(up);

    del.setAttribute('id', doc.id);
    del.setAttribute('value', ' X ');
    del.setAttribute('type', 'button');
    del.setAttribute('onclick', 'deleteDoc(this.id);');
    tr.insertCell(5).appendChild(del);
}
//deleting
function deleteDoc(id){
    //console.log(id);
    db.collection('users').doc(id).delete();
    
}

function updateDoc(id){
    db.collection('users').doc(id).get().then((snapshot)=>{
        //console.log(snapshot.data());
        
        document.getElementById('validationDefault01').value = snapshot.data().FirstName,
        document.getElementById('validationDefault02').value = snapshot.data().LastName;
        document.getElementById('validationDefaultUsername').value = snapshot.data().UserName;
        document.getElementById('validationDefault03').value = snapshot.data().City;
        document.getElementById('validationDefault04').value = snapshot.data().State;
        document.getElementById('validationDefault05').value = snapshot.data().Zip;
        var input = document.getElementById('validationDefault01');
        input.focus();
        input.select();
    });
    document.getElementById("insert").type = 'reset';
    form.addEventListener('reset', (e)=>{
        e.preventDefault();
        db.collection('users').doc(id).update({
            FirstName: document.getElementById('validationDefault01').value,
            LastName: document.getElementById('validationDefault02').value,
            UserName: document.getElementById('validationDefaultUsername').value,
            City: document.getElementById('validationDefault03').value,
            State: document.getElementById('validationDefault04').value,
            Zip: document.getElementById('validationDefault05').value
        });
        document.getElementById('validationDefault01').value = '';
        document.getElementById('validationDefault02').value = '';
        document.getElementById('validationDefaultUsername').value = '';
        document.getElementById('validationDefault03').value = '';
        document.getElementById('validationDefault04').value = '';
        document.getElementById('validationDefault05').value = '';
    });
    
    document.getElementById("insert").type = 'reset';
    
}

//retrieving data from firestore
/*
db.collection('users').orderBy('FirstName').get().then((snapshot)=>{
    //console.log(snapshot.docs);
    var i = 0;
    snapshot.docs.forEach(doc =>{
        renderUsers(doc, ++i);
    })
})
*/
var tableIndex = 0;
//retrieving real-time data from firestore
db.collection('users').orderBy('FirstName').onSnapshot(snapshot=>{
    //console.log(snapshot.docs);
    
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderUsers(change.doc, ++tableIndex);
        }
        else if(change.type == 'removed'){
            //Fetching the button
            let tr = document.getElementById(change.doc.id);
            //console.log(tr.parentElement.parentElement.getElementsByTagName('td')[0].innerText);
            //Fetching the text of the first cell from the row which contains the button
            table.deleteRow((tr.parentElement.parentElement.getElementsByTagName('td')[0].innerText));
            tableIndex--;
        }
    })
})

//Saving 

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    db.collection('users').add({
        FirstName: document.getElementById('validationDefault01').value,
        LastName: document.getElementById('validationDefault02').value,
        UserName: document.getElementById('validationDefaultUsername').value,
        City: document.getElementById('validationDefault03').value,
        State: document.getElementById('validationDefault04').value,
        Zip: document.getElementById('validationDefault05').value
        
    });
    document.getElementById('validationDefault01').value = '';
    document.getElementById('validationDefault02').value = '';
    document.getElementById('validationDefaultUsername').value = '';
    document.getElementById('validationDefault03').value = '';
    document.getElementById('validationDefault04').value = '';
    document.getElementById('validationDefault05').value = '';
})