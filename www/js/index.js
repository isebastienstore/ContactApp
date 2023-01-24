document.addEventListener("deviceready", loadContacts, false);
function loadContacts() {
    let options = new ContactFindOptions();
  //  options.filter = "resp";
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ["name"];

    navigator.contacts.find(fields, showContacts, handleError, options);
}

function showContacts(contacts){
    let code = '';

    for(let i = 0; i < contacts.length; i++){
        code += `
            <li onclick="showOneContactById(${contacts[i].id})">
                <a href="#">
                    <img src="images/avatar.jpg" alt="photo de profil">
                    <h3>${contacts[i].name.formatted}</h3>
                    <p>${contacts[i].phoneNumbers[0].value}</p>
                </a>
            </li>
        `;

        
    }

    contactsList.innerHTML = code;
    // il faut demander à jquery de se raffraichier pour ajouter les classes
    $(contactsList).listview("refresh");
}



function handleError(contactError){
    alert(contactError);
}


function addContactLink(){
    $("#add-button").hide() 
    $("#add-form").show() 
}

function annulerButton(){
    $("#add-form").hide()
    $("#add-button").show()
}

function ajouterContact(){
    nom = contactName.value
    prenom = contactSecondName.value
    phone = contactPhoneNumber.value
    mobilPhone = contactMobilePhone.value
    email = contactMail.value

    if(nom == "" || prenom == ""){
        alert('Veuillez renseigner les champs')
        contactName.value = "";
        contactSecondName.value = "";
        contactPhoneNumber.value = ""
        contactMobilePhone.value = ""
        contactMail.value = ""

        contactName.focus();
        return;
    }

    if(isNaN(phone)){
        alert('Renseigner le numéro de téléphone !')
        contactName.value = "";
        contactSecondName.value = "";
        contactPhoneNumber.value = ""
        contactMobilePhone.value = ""
        contactMail.value = ""

        contactName.focus();
        return;

    }

    var myContact = navigator.contacts.create({'displayName': nom})

    let name = new ContactName()

    name.givenName = nom
    name.familyName = prenom

    myContact.name = name
    myContact.phoneNumbers = [new ContactField('mobile', phone, true), new ContactField('fixe', mobilPhone, true)]
    myContact.emails = [new ContactField('email', email, true)]
    myContact.save(onSuccess, onError)
}

function onSuccess(contact){
    alert('contact ajouté avec succès !')
    $("#add-form").hide()
    $("#add-button").show()

    contactName.value = "";
    contactSecondName.value = "";
    contactPhoneNumber.value = ""

    contactName.focus();

    loadContacts();
    $("#contactsList").listview('refresh')

}

function onError(contactError){
    alert('Erreur lors du chargement du contact ');
}


function showOneContactById(id){
    // modifier les éléments dans la nouvelle page
    var options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    
    var contact = navigator.contacts.find(["id"], (contacts) => {
        window.location = "#page2"
        for (let i=0; i < contacts.length; i++){
            
            document.getElementById("contact-name").textContent = contacts[i].name.familyName;
            document.getElementById("contactSecond-name").textContent = contacts[i].name.givenName;
            document.getElementById("contactMobile-number").textContent = contacts[i].phoneNumbers[0].value;
            document.getElementById("contactPhone-number").textContent = contacts[i].phoneNumbers[1].value;
            document.getElementById("contact-email").textContent = contacts[i].emails[0].value;
        }
        
        
    }, (contactError) => {
        alert("erreur")
    }, options)

    $("#on-delete").on("click", () => {
        let confirmDelete = confirm("Voulez vous supprimer ce contact")
        if (confirmDelete === true ){
            var options = new ContactFindOptions();
            options.filter = id;
            options.multiple = false;
            
            var contact = navigator.contacts.find(["id"], (contacts) => {
                contacts[0].remove((contact) => {
                    alert("Contact supprimé avec succès")
                    window.location = "#page1"
                    loadContacts()
                }, (contactError) => {
                    alert("erreur")
                })
            }, (contactError) => {
                alert("erreur")
            }, options)
        }
        else{
            return;
        }
    })
    
}


// modification d'un contact
function showUpdateContactForm(id){
    var options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    //navigator.contacts.find(fields, showContacts, onError, options);
    
    var contact = navigator.contacts.find(["id"], (contacts) => {
        window.location = "#page3"
        for (let i=0; i < contacts.length; i++){
            document.getElementById("contactNameUpdate").value = contacts[i].name.familyName;
            document.getElementById("contactFirstNameUpdate").value = contacts[i].name.givenName;
            document.getElementById("contactMobileNumberUpdate").value = contacts[i].phoneNumbers[0].value;
            document.getElementById("contactPhoneNumberUpdate").value = contacts[i].phoneNumbers[1].value;
            document.getElementById("contactEmailUpdate").value = contacts[i].emails[0].value;
        }
        //window.location = "#page2"
    }, (contactError) => {
        alert("erreur")
    }, options)
    $("#on-update").on("click", () => {
        let confirmUpdate = confirm("Voulez vous modifier ce contact ?")
        if (confirmUpdate === true ){
            var options = new ContactFindOptions();
            options.filter = id;
            options.multiple = false;
            //navigator.contacts.find(fields, showContacts, onError, options);
            var contact = navigator.contacts.find(["id"], (contacts) => {
                contacts[0].remove((contact) => {
                    alert("Contact supprimé avec succès")
                    window.location = "#page1"
                    loadContacts()
                }, (contactError) => {
                    alert("erreur")
                })
            }, (contactError) => {
                alert("erreur")
            }, options)
        }
        else{
            return;
        }
    })
}

// annulation de la modification
function annulerModification(){
    history.go(-1);
}

function acceuil(){
    window.location = '#page1'
    window.location.reload()
}
