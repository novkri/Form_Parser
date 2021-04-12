const formContainer = document.getElementById('form-container')
const form = document.getElementById('form')
const header = document.getElementById('filename')

const uploadInput = document.getElementById('upload')
const uploadGroup = document.getElementById('upload-group')

const resetBtn = document.getElementById('resetBtn')


uploadInput.addEventListener('change', readFile)
resetBtn.addEventListener('click', resetForm)


formContainer.classList.add('hide')

let divError = document.createElement('div')
divError.classList.add('alert', 'alert-danger')


function readFile() {
  const currentFile = uploadInput.files[0]

  let reader = new FileReader()
  reader.readAsText(currentFile)

  reader.onload = function() {
    parseFile(reader.result)
  }

  reader.onerror = function() {
    console.log(reader.error);
  }
}

function parseFile(readerResult) {
  divError.textContent = 'Загрузите файл в формате json'

  try {
    const result = JSON.parse(readerResult)

    formContainer.classList.remove('hide')
    uploadGroup.classList.add('hide')
    resetBtn.classList.remove('hide')


    if (uploadGroup.contains(divError)) {
      uploadGroup.removeChild(divError)
    }

    header.textContent = result.name

    // fields 
    populateFields(result.fields)
    // refs IF exists, TODO: check
    populateRefs(result.references)
    // buttons IF exists
    populateBtns(result.buttons)
  } catch (error) {
    uploadGroup.appendChild(divError)
  }
}

function createMyElem(tag, classes, text, ...attributes) {
  let node = document.createElement(tag)
  node.textContent = text
  node.classList.add(...classes)

  if (attributes) {
    for (let i = 0; i < attributes.length; i++) {
      const {nameAttr, valueAttr} = attributes[i]
      node.setAttribute(nameAttr, valueAttr)
    }
  }
  return node
}

function populateFields(fields) {
  for (let i = 0; i < fields.length; i++) {
    let myFormGroup = createMyElem('div', ['form-group'])


    let myLabel = createMyElem('label', [], fields[i].label, {nameAttr: 'for', valueAttr: i})

    // let myInput = document.createElement('input')
    // myInput.classList.add('form-control')
    // myInput.setAttribute('id', i)
    let myInput = createMyElem('input', ['form-control'], '', {nameAttr: 'id', valueAttr: i})

    // myLabel.textContent = fields[i].label


    for (const attr in fields[i].input) {
      // console.log(attr, fields[i].input[attr]);

      // parse mask
      if (attr === 'mask') {
        parseInputWithMask(myInput, fields[i].input[attr])
      }
      

      // parse multiple select  "technologies"
      if (attr === 'type' && fields[i].input[attr] === 'technology') {
        // OR 
        // myInput = document.createElement('select')
        // myInput.classList.add('custom-select')
        // myInput.setAttribute('id', i)
        // parseSelect(myInput, fields[i].input['technologies'])

        myInput = parseSelectWithCheckboxes(myInput, fields[i].input['technologies'])
      }


      // parse file filetype
      // parse color colors
      myInput[attr] = fields[i].input[attr]
    }


    myFormGroup.appendChild(myLabel)
    myFormGroup.appendChild(myInput)
    form.appendChild(myFormGroup)
  }
}

function parseInputWithMask(input, mask) {
  input.type = 'text'
  input.placeholder = mask

  function inputHandler() {
    const value = input.value;

    const literalPattern = /[9\*]/;

    const numberPattern = /[0-9]/;

    let newValue = "";

    try {
      const maskLength = mask.length;
      let valueIndex = 0;
      let maskIndex = 0;

      while (maskIndex < maskLength) {
        if (maskIndex >= value.length) break;

        // Если сопоставлений не было, метод вернёт значение null.
        if (mask[maskIndex] === "9" && value[valueIndex].match(numberPattern) === null) break; 

        while (mask[maskIndex].match(literalPattern) === null) {
          if (value[valueIndex] === mask[maskIndex]) break;
          newValue += mask[maskIndex++];
        }
        newValue += value[valueIndex++];
        maskIndex++;
      }

      input.value = newValue;
    } catch (e) {
      console.log(e);
    }
  }

  input.addEventListener('input', e => inputHandler(e));
}

function parseSelectWithCheckboxes(input, techArr) {
  let parentDiv = document.createElement('div')

  for (const option in techArr) {
    let groupDiv = createMyElem('div', ['form-check'])
    // let groupDiv = document.createElement('div')
    // groupDiv.classList.add('form-check')

    let myCheckBox = createMyElem('input', ['form-check-input'], '', { nameAttr: 'value', valueAttr: techArr[option] }, { nameAttr: 'id', valueAttr: techArr[option] })
    // let myCheckBox = document.createElement('input')
    myCheckBox.type = 'checkbox'
    // myCheckBox.setAttribute('value', techArr[option])
    // myCheckBox.setAttribute('id', techArr[option])
    // myCheckBox.classList.add('form-check-input')

    let myCheckboxLabel = createMyElem('label', ['form-check-label'], techArr[option], { nameAttr: 'for', valueAttr: techArr[option] })
    // let myCheckboxLabel = document.createElement('label')
    // myCheckboxLabel.setAttribute('for', techArr[option])
    // myCheckboxLabel.textContent = techArr[option]
    // myCheckboxLabel.classList.add('form-check-label')


    groupDiv.appendChild(myCheckBox)
    groupDiv.appendChild(myCheckboxLabel)
    parentDiv.appendChild(groupDiv)
  }

  return parentDiv
}

// function parseSelect(input, techArr) {
//   for (const option in techArr) {
//     let myOption = document.createElement('option')
//     myOption.textContent = techArr[option]
//     myOption.value = techArr[option]

//     input.appendChild(myOption)
//   }
// }


function populateRefs(refs) {
  let myRefsContainer = createMyElem('div', ['refs-container'])
  // let myRefsContainer = document.createElement('div')
  // myRefsContainer.classList.add('refs-container')


  for (let i = 0; i < refs.length; i++) {
    // console.log(refs[i]);
    let myFormGroup = createMyElem('div', ['form-group'])
    // let myFormGroup = document.createElement('div')
    // myFormGroup.classList.add('form-group')


    if (refs[i].input) {
      // console.log(refs[i].input);
      myFormGroup.classList.add('form-check')
  
      let myInput = createMyElem('input', ['form-check-input'])
      // let myInput = document.createElement('input')
      // myInput.classList.add('form-check-input')


      // ?? add func for parsing inputs ?
      // AND check if attrs exists
      let {type, required, checked} = {...refs[i].input}

      myInput.type = type
      myInput.required = required
      checked === true ? myInput.setAttribute('checked', checked) : ''
      // myInput.type = refs[i].input.type
      // myInput.required = refs[i].input.required
      // myInput.checked = refs[i].input.checked

      myFormGroup.appendChild(myInput)

    }

    if (refs[i].label) {
      // console.log(refs[i].label);
      
      let myLabel = createMyElem('label', ['form-check-label'], refs[i].label)
      // let myLabel = document.createElement('label')
      // myLabel.classList.add('form-check-label')
      // myLabel.textContent = refs[i].label

      myFormGroup.appendChild(myLabel)
    }


    // what it is?
    if (refs[i]['text without ref']) {
      // console.log(refs[i]['text without ref']);

      let myPar = createMyElem('p', ['check__text'], refs[i]['text without ref'])
      // let myPar = document.createElement('p')
      // myPar.classList.add('check__text')
      // myPar.textContent = refs[i]['text without ref']

      myFormGroup.appendChild(myPar)
    }

    // what it is?
    if (refs[i].text) {
      // console.log(refs[i].text);
      
      let myPar2 = createMyElem('p', ['check__text'])
      // let myPar2 = document.createElement('p')
      // myPar2.classList.add('check__text')
      myPar2.textContent = refs[i].text

      myFormGroup.appendChild(myPar2)
    }

    // what it is?
    if (refs[i].ref) {
      // console.log(refs[i].ref);
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

    // not sure !!!
    myBtn.classList.add('btn-success')
    if (btns[i].text.toLowerCase() === 'cancel' ) {
      myBtn.classList.add('btn-danger')
    }

    myBtnsContainer.appendChild(myBtn)
  }

  form.appendChild(myBtnsContainer)
}


// reset
function resetForm() {
  uploadGroup.classList.remove('hide')
  resetBtn.classList.add('hide')

  uploadInput.value = ''
  form.textContent = ''
  header.textContent = ''
  formContainer.classList.add('hide')
}