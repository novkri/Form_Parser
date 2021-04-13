const formContainer = document.getElementById('form-container')
const form = document.getElementById('form')
const header = document.getElementById('filename')

const uploadButton = document.getElementById('upload')
const mainUploadForm = document.getElementById('upload-group')

const resetBtn = document.getElementById('resetBtn')


uploadButton.addEventListener('change', readFile)
resetBtn.addEventListener('click', resetForm)

formContainer.classList.add('hide')

let divError = document.createElement('div')
divError.classList.add('alert', 'alert-danger')

let reader = new FileReader()

function readFile() {
  const currentFile = uploadButton.files[0]

  // let reader = new FileReader()
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
    mainUploadForm.classList.add('hide')
    resetBtn.classList.remove('hide')


    if (mainUploadForm.contains(divError)) {
      mainUploadForm.removeChild(divError)
    }

    header.textContent = result.name

    result.fields ? populateFields(result.fields) : ''
    result.references ? populateRefs(result.references) : ''
    result.buttons ? populateBtns(result.buttons) : ''

  } catch (error) {
    console.log(error);
    mainUploadForm.append(divError)
  }
}



function readImgFile(e, allowedTypes, filetypes) {
  const currentFiles = e.target.files

  for (const file of currentFiles) {
    // ?
    if (allowedTypes.includes(file.type)) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      console.log(reader.result);
      // todo something with result...
      
    } else {
      e.target.value = ''
      alert(`Допустимые форматы файлов: ${filetypes.join(', ')}`);
    }
  }
}


function populateFields(fields) {
  for (let i = 0; i < fields.length; i++) {
    let myFormGroup = document.createElement('div')
    myFormGroup.classList.add('form-group')

    let myLabel = document.createElement('label')
    myLabel.setAttribute('for', i)
    myLabel.textContent = fields[i].label

    let myInput = document.createElement('input')
    myInput.setAttribute('id', i)

    let myCheckBoxContainer


    for (const attr in fields[i].input) {
      myInput[attr] = fields[i].input[attr]

      switch (fields[i].input.type) {
        case 'checkbox':
          myCheckBoxContainer = document.createElement('div')
          myCheckBoxContainer.classList.add('form-check')

          myInput.classList.add('form-check-input')

          fields[i].input.checked === 'true' ? myInput.checked = true : myInput.checked = false 
          break;
        case 'file': 
          myInput.classList.add('form-control-file')
          break;
        case 'technology':
          myInput.classList.add('technology')
          break;
        // ?
        case 'color':
          myInput.classList.add('color')
          break;
        default:
          myInput.classList.add('form-control')
          break;
      }

      // mask
      if (attr === 'mask') {
        parseInputWithMask(myInput, fields[i].input[attr])
      }
      

      // multiple select "technologies"
      if (attr === 'type' && fields[i].input[attr] === 'technology') {
        myInput = parseCustomInput('checkbox', fields[i].input['technologies'], 'technologies')
      }

      //  filetype
      if (attr === 'type' && fields[i].input[attr] === 'file' && fields[i].input.filetype) {
        let imgTypes = Object.values(fields[i].input.filetype).map(key => `image/${key}`)
        let typesString = imgTypes.join(', ')
        myInput.setAttribute('accept', typesString)

        myInput.addEventListener('change', e => readImgFile(e, imgTypes, fields[i].input.filetype))
      }

      // parse color colors
      if (attr === 'type' && fields[i].input[attr] === 'color') {
        myInput = parseCustomInput('radio', fields[i].input['colors'], 'colors')
      }
    }

    if (myCheckBoxContainer) {
      myCheckBoxContainer.append(myInput)
      myCheckBoxContainer.append(myLabel)
      myFormGroup.append(myCheckBoxContainer)
    } else {
      myFormGroup.append(myLabel)
      myFormGroup.append(myInput)
    }
    
    form.append(myFormGroup)
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

function parseCustomInput(buttonsType, data, type) {
  let parentDiv = document.createElement('div')

  for (const option in data) {
    let groupDiv = document.createElement('div')
    groupDiv.classList.add('form-check')

    let myButton = document.createElement('input')
    myButton.type = buttonsType
    myButton.setAttribute('value', data[option])
    myButton.setAttribute('id', data[option])
    myButton.setAttribute('name', `select${buttonsType}`)
    myButton.classList.add('form-check-input')

    let myButtonLabel = document.createElement('label')
    myButtonLabel.setAttribute('for', data[option])

    switch (type) {
      case 'technologies':
        myButtonLabel.textContent = data[option]
        myButtonLabel.classList.add('form-check-label')
        break;
      case 'colors':
        myButtonLabel.classList.add('form-check-label', 'color-label')
        myButtonLabel.style.backgroundColor = data[option]
        break;
      default:
        break;
    }


    groupDiv.append(myButton)
    groupDiv.append(myButtonLabel)
    parentDiv.append(groupDiv)
  }

  return parentDiv
}



function populateRefs(refs) {
  let myRefsContainer = document.createElement('div')
  myRefsContainer.classList.add('refs-container')


  for (let i = 0; i < refs.length; i++) {
    let myRefsGroup = document.createElement('div')
    myRefsGroup.classList.add('form-group', 'refs-group')


    if (refs[i].input) {
      myRefsGroup.classList.add('form-check')
      myRefsContainer.classList.add('with-checkbox')

      let myInput = document.createElement('input')
      myInput.classList.add('form-check-input')

      let {type, required, checked} = refs[i].input
      myInput.type = type
      myInput.required = required
      checked === 'true' ? myInput.checked = true : myInput.checked = false 

      myRefsGroup.append(myInput)
    }

    if (refs[i].label) {
      let myLabel = document.createElement('label')
      myLabel.classList.add('form-check-label')
      
      myLabel.textContent = refs[i].label

      myRefsGroup.append(myLabel)
    }


    if (refs[i]['text without ref']) {
      let myPar = document.createElement('p')
      myPar.classList.add('ref__text')
      myPar.textContent = refs[i]['text without ref']

      myRefsGroup.append(myPar)
    }

    if (refs[i].text) {
      let myPar2 = document.createElement('a')
      myPar2.classList.add('ref__link')
      myPar2.textContent = refs[i].text
      myPar2.setAttribute('href', `/${refs[i].ref}`)
      myRefsGroup.append(myPar2)
    }

    myRefsContainer.append(myRefsGroup)
    form.append(myRefsContainer)
  }
}


function populateBtns(btns) {
  let myBtnsContainer = document.createElement('div')
  myBtnsContainer.classList.add('btns-container')

  for (let i = 0; i < btns.length; i++) {
    let myBtn = document.createElement('button')
    myBtn.classList.add('btn', 'btn-primary', )

    myBtn.textContent = btns[i].text

    myBtn.classList.add('btn-success')
    if (btns[i].text.toLowerCase() === 'cancel' ) {
      myBtn.classList.add('btn-danger')
    }

    myBtnsContainer.append(myBtn)
  }

  form.append(myBtnsContainer)
}


// reset
function resetForm() {
  reader.abort()
  mainUploadForm.classList.remove('hide')
  resetBtn.classList.add('hide')
  formContainer.classList.add('hide')

  uploadButton.value = ''
  form.textContent = ''
  header.textContent = ''
}