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
    uploadGroup.append(divError)
  }
}

// ???
function readImgFile(e, allowedTypes, filetypes) {
  const currentFiles = e.target.files

  

  for (const file of currentFiles) {
    console.log(filetypes.join(', '));
    // ?
    if (allowedTypes.includes(file.type)) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      console.log(reader.result);
      // todo something with result...
      
    } else {
      e.target.value = ''
      alert(`Допустимые форматы файлов: ${filetypes.join(', ')}`);
      console.log('error');
    }

    
  }
}

function populateFields(fields) {
  for (let i = 0; i < fields.length; i++) {
    let myFormGroup = document.createElement('div')
    myFormGroup.classList.add('form-group')

    let myLabel = document.createElement('label')
    myLabel.setAttribute('for', i)

    let myInput = document.createElement('input')
    myInput.classList.add('form-control')
    myInput.setAttribute('id', i)


    myLabel.textContent = fields[i].label


    for (const attr in fields[i].input) {
      myInput[attr] = fields[i].input[attr]

      // mask
      if (attr === 'mask') {
        parseInputWithMask(myInput, fields[i].input[attr])
      }
      

      // multiple select  "technologies"
      if (attr === 'type' && fields[i].input[attr] === 'technology') {
        myInput = parseSelectWithCheckboxes(fields[i].input['technologies'])
        // myInput.replaceWith(...parseSelectWithCheckboxes(fields[i].input['technologies']))
      
      }

      // parse file filetype
      if (attr === 'type' && fields[i].input[attr] === 'file') {
        myInput.classList.replace('form-control', 'form-control-file')

        if (fields[i].input.filetype) {
          let imgTypes = Object.values(fields[i].input.filetype).map(key => `image/${key}`)
          let typesString = imgTypes.join(', ')
          myInput.setAttribute('accept', typesString)

          myInput.addEventListener('change', e => readImgFile(e, imgTypes, fields[i].input.filetype))
        }
      }

      // parse color colors
    }


    myFormGroup.append(myLabel)
    myFormGroup.append(myInput)
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

function parseSelectWithCheckboxes(techArr) {
  let parentDiv = document.createElement('div')
  // let result = []

  for (const option in techArr) {
    let groupDiv = document.createElement('div')
    groupDiv.classList.add('form-check')

    let myCheckBox = document.createElement('input')
    myCheckBox.type = 'checkbox'
    myCheckBox.setAttribute('value', techArr[option])
    myCheckBox.setAttribute('id', techArr[option])
    myCheckBox.classList.add('form-check-input')

    let myCheckboxLabel = document.createElement('label')
    myCheckboxLabel.setAttribute('for', techArr[option])
    myCheckboxLabel.textContent = techArr[option]
    myCheckboxLabel.classList.add('form-check-label')


    groupDiv.append(myCheckBox)
    groupDiv.append(myCheckboxLabel)
    // result.push(groupDiv)
    parentDiv.append(groupDiv)
  }

  // return result
  return parentDiv
}


function populateRefs(refs) {
  let myRefsContainer = document.createElement('div')
  myRefsContainer.classList.add('refs-container')


  for (let i = 0; i < refs.length; i++) {
    let myFormGroup = document.createElement('div')

    myFormGroup.classList.add('form-group')


    if (refs[i].input) {
      myFormGroup.classList.add('form-check')
  
      let myInput = document.createElement('input')
      myInput.classList.add('form-check-input')

      let {type, required, checked} = refs[i].input
      myInput.type = type
      myInput.required = required
      myInput.checked = checked === true ? checked : ''

      myFormGroup.append(myInput)

    }

    if (refs[i].label) {
      console.log(refs[i].label);
      
      let myLabel = document.createElement('label')
      myLabel.classList.add('form-check-label')
      
      myLabel.textContent = refs[i].label

      myFormGroup.append(myLabel)
    }


    if (refs[i]['text without ref']) {
      let myPar = document.createElement('p')
      myPar.classList.add('check__text')
      myPar.textContent = refs[i]['text without ref']

      myFormGroup.append(myPar)
    }

    if (refs[i].text) {
      let myPar2 = document.createElement('p')
      myPar2.classList.add('check__text')
      myPar2.textContent = refs[i].text

      myFormGroup.append(myPar2)
    }

    // what it is?
    if (refs[i].ref) {
      // console.log(refs[i].ref);
      // ????
    }

    myRefsContainer.append(myFormGroup)
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
  uploadGroup.classList.remove('hide')
  resetBtn.classList.add('hide')

  uploadInput.value = ''
  form.textContent = ''
  header.textContent = ''
  formContainer.classList.add('hide')
}