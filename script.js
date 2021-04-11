const form = document.getElementById('form')
const uploadInput = document.getElementById('upload')
const uploadGroup = document.getElementById('upload-group')
const header = document.getElementById('filename')

uploadInput.addEventListener('change', readFile)

function readFile() {
  // TODO: check if file exists
  const currentFile = uploadInput.files[0]

  let reader = new FileReader()
  reader.readAsText(currentFile)

  reader.onload = function() {
    parseFile(reader.result)

    // ???? 
    // and the trmove somewhere
    uploadGroup.classList.add('uploaded')
  }

  reader.onerror = function() {
    // TODO: error
    console.log(reader.error);
  }
}

function parseFile(readerResult) {
  const result = JSON.parse(readerResult)
  console.log(result)
  header.textContent = result.name
  // fields 
  populateFields(result.fields)
  // refs IF exists, TODO: check
  populateRefs(result.references)
  // buttons IF exists
  populateBtns(result.buttons)
}


function populateFields(fields) {
  // console.log(fields);
  for (let i = 0; i < fields.length; i++) {
    // console.log(fields[i]);
    let myFormGroup = document.createElement('div')
    myFormGroup.classList.add('form-group')

    let myLabel = document.createElement('label')
    // TODO: add for attr for label AND input

    let myInput = document.createElement('input')
    myInput.classList.add('form-control')


    myLabel.textContent = fields[i].label

    // ?? add func for parsing inputs ?
    // AND check if attrs exists
    myInput.type = fields[i].input.type
    myInput.required = fields[i].input.required
    myInput.placeholder = fields[i].input.placeholder
    // mask!
    // multiple
    // filetype
    // colors


    myFormGroup.appendChild(myLabel)
    myFormGroup.appendChild(myInput)
    form.appendChild(myFormGroup)
  }
}


function populateRefs(refs) {
  let myRefsContainer = document.createElement('div')
  myRefsContainer.classList.add('refs-container')


  for (let i = 0; i < refs.length; i++) {
    console.log(refs[i]);
    let myFormGroup = document.createElement('div')
    // ?
    myFormGroup.classList.add('form-group')


    if (refs[i].input) {
      console.log(refs[i].input);
      myFormGroup.classList.add('form-check')
  
      let myInput = document.createElement('input')
      myInput.classList.add('form-check-input')


      // ?? add func for parsing inputs ?
      // AND check if attrs exists
      myInput.type = refs[i].input.type
      myInput.required = refs[i].input.required
      myInput.checked = refs[i].input.checked

      myFormGroup.appendChild(myInput)

    }

    if (refs[i].label) {
      console.log(refs[i].label);
      
      let myLabel = document.createElement('label')
      myLabel.classList.add('form-check-label')
      
      myLabel.textContent = refs[i].label

      myFormGroup.appendChild(myLabel)
    }


    // what it is?
    if (refs[i]['text without ref']) {
      console.log(refs[i]['text without ref']);

      let myPar = document.createElement('p')
      // myPar.classList.add('???') add class anotherr
      myPar.classList.add('check__text')
      myPar.textContent = refs[i]['text without ref']


      // ?
      myFormGroup.appendChild(myPar)
    }

    // what it is?
    if (refs[i].text) {
      console.log(refs[i].text);
      
      let myPar2 = document.createElement('p')
      // myDiv.classList.add('???') add class
      myPar2.classList.add('check__text')
      myPar2.textContent = refs[i].text

      // ?
      myFormGroup.appendChild(myPar2)
    }

    // what it is?
    if (refs[i].ref) {
      console.log(refs[i].ref);
      // ????
    }

    myRefsContainer.appendChild(myFormGroup)
    form.appendChild(myRefsContainer)
  }
}


function populateBtns(btns) {
  let myBtnsContainer = document.createElement('div')
  myBtnsContainer.classList.add('btns-container')

  for (let i = 0; i < btns.length; i++) {
    let myBtn = document.createElement('button')
    myBtn.classList.add('btn', 'btn-primary', ) // and classes another

    myBtn.textContent = btns[i].text

    myBtnsContainer.appendChild(myBtn)
  }

  form.appendChild(myBtnsContainer)
}