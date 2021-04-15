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



function readFile() {
  const currentFile = uploadButton.files[0]

  let reader = new FileReader()
  reader.readAsText(currentFile)

  reader.onload = function() {
    parseFile(reader.result)
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
    mainUploadForm.append(divError)
  }
}



function readImgFile(e, allowedTypes) {

  let oldPreviewContainer = document.getElementsByClassName('preview-container')
  while(oldPreviewContainer.length > 0){
    oldPreviewContainer[0].parentNode.removeChild(oldPreviewContainer[0]);
  }


  let cuurentPreviewContainer = document.createElement('div')
  cuurentPreviewContainer.classList.add('preview-container')



  const currentFiles = e.target.files

  for (const file of currentFiles) {
    let isAnyFileCorrectType = false

    for (const iterator of allowedTypes) {
      if (file.type.includes(iterator)) {
        isAnyFileCorrectType = true
        let readerImg = new FileReader()

        readerImg.readAsDataURL(file)
      
        readerImg.onload = function() {

        let preview
          if (file.type.includes('image/')) {
            preview = document.createElement('img')
            preview.setAttribute('src', readerImg.result)
          } else {
            preview = document.createElement('span')
            preview.textContent = file.name
          }
          
          preview.classList.add('preview')
          preview.setAttribute('id', `preview${e.target.id}`) 
          
          cuurentPreviewContainer.appendChild(preview)
          // e.target.after(preview)

        }
      }
    }

    if (!isAnyFileCorrectType) {
      e.target.value = ''
      alert(`Допустимые форматы файлов: ${allowedTypes.join(', ')}`)
    }
  }

  e.target.after(cuurentPreviewContainer)
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
        case 'color':
          myInput.classList.add('custom-field')
          break;
        default:
          myInput.classList.add('form-control')
          break;
      }

      // mask
      if (attr === 'mask') {
        parseInputWithMask(myInput, fields[i].input[attr])
      }
      

      // "technologies"
      if (attr === 'type' && fields[i].input[attr] === 'technology') {
        myInput = parseCustomInput('checkbox', fields[i].input['technologies'], 'technologies')
      }

      // filetype
      if (attr === 'type' && fields[i].input[attr] === 'file') {
        if (fields[i].input.filetype) {
          setAcceptedFileTypes(myInput, fields[i].input.filetype)
        } else {
          let allImgTypes = ["png", "jpg", "jpeg"]
          setAcceptedFileTypes(myInput, allImgTypes)
        }
      }

      // colors
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


function setAcceptedFileTypes(input, initFiletypes) {
  let imgTypes = Object.values(initFiletypes).map(key => `.${key}`).join(', ')
  input.setAttribute('accept', imgTypes)
  input.addEventListener('change', e => readImgFile(e, initFiletypes))
}


function parseInputWithMask(input, mask) {
  input.type = 'text'
  input.placeholder = mask

  function inputHandler() {
    const value = input.value;

    const literalPattern = /[9\*]/;

    const numberPattern = /[0-9]/;

    let newValue = "";

    const maskLength = mask.length;
    let valueIndex = 0;
    let maskIndex = 0;

    while (maskIndex < maskLength) {
      if (maskIndex >= value.length) break;

      if (mask[maskIndex] === "9" && value[valueIndex].match(numberPattern) === null) break; 

      while (mask[maskIndex].match(literalPattern) === null) {
        if (value[valueIndex] === mask[maskIndex]) break;
        newValue += mask[maskIndex++];
      }
      newValue += value[valueIndex++];
      maskIndex++;
    }

    input.value = newValue;
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
    myBtn.classList.add('btn', 'btn-primary')

    myBtn.textContent = btns[i].text

    
    btns[i].text.toLowerCase() === 'cancel' ? 
      myBtn.classList.add('btn-danger') : myBtn.classList.add('btn-success')

    myBtnsContainer.append(myBtn)
  }

  form.append(myBtnsContainer)
}



function resetForm() {
  mainUploadForm.classList.remove('hide')
  resetBtn.classList.add('hide')
  formContainer.classList.add('hide')

  uploadButton.value = ''
  form.textContent = ''
  header.textContent = ''
}