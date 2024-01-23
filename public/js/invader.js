/**
* @file Génère une grille pour faire du Pixel Art
* @author Fabien TAVERNIER <fabien.tavernier@oclock.io>
*/

/*
  On modularise notre code
*/

const app = {
  invader: document.getElementById('invader'),
  configForm: document.querySelector('.configuration'),

  styles: [
    'empty',
    'plain',
    'light',
    'highlight',
  ],
  currentStyle: 'empty',

  options: {
    gridSize: 8,
    pixelWidth: 24
  },

  init() {
    app.addGrid();
    app.addConfigForm();
    app.addPalette();
  },

  createRow() {
    // on crée la ligne
    const row = document.createElement('div');
    // row.className = 'row';
    row.classList.add('row');
    
    // pour chaque ligne, on ajoute les cellules, les cases, les pixels
    for (let pixelIndex = 0; pixelIndex < app.options.gridSize; pixelIndex++) {
      const pixel = app.createPixel();
      
      // on l'ajoute à la ligne actuelle
      row.appendChild(pixel);
    }
    
    return row;
  },
  createPixel() {
    // on crée le pixel
    const pixel = document.createElement('div');
    pixel.classList.add('pixel', 'pixel--empty'); // « vide » par défaut
    
    // on définit la taille du pixel
    pixel.style.height = app.options.pixelWidth + 'px';
    pixel.style.width = app.options.pixelWidth + 'px';
    
    // on écoute le click
    pixel.addEventListener('click', app.handlePixelClick);
    
    return pixel;
  },

  createInput(attributes) {
    const input = document.createElement('input');
    
    input.type = 'number';
    input.classList.add('config-input');
    
    // on dynamise la création des propriétés de `input`
    for (const property in attributes) {
      // console.log(property);
      input[property] = attributes[property];
    }
    
    return input;
  },

  addGrid() {
    for (let rowIndex = 0; rowIndex < app.options.gridSize; rowIndex++) {
      const row = app.createRow();
      
      // on l'ajoute au conteneur
      app.invader.appendChild(row);
    }
  },
  addConfigForm() {
    const gridSizeInput = app.createInput({
      name: 'gridSize',
      placeholder: 'Taille de la grille',
      ariaLabel: 'Taille de la grille',    
      min: 1,
    });
    
    const pixelWidthInput = app.createInput({
      name: 'pixelWidth',
      placeholder: 'Taille des pixels',
      ariaLabel: 'Taille des pixels',    
      min: 12,
      step: 12,
    });
    
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Valider';
    
    // `append` permet d'ajouter un élément
    // ou une liste d'éléments (et même du texte seul)
    // à un parent
    app.configForm.append(gridSizeInput, pixelWidthInput, button);
  
    app.configForm.addEventListener('submit', app.handleConfigSubmit);
  },
  addPaletteButton(style) {
    // console.log(style);
    const button = document.createElement('button');
    button.classList.add('palette-color', 'palette-color--' + style);
    button.type = 'button';
  
    // SI le style est le même que le style courant
    if (style === app.currentStyle) {
      // ALORS j'ajoute la lasse active
      button.classList.add('palette-color--active');
    }
  
    // on associe le bouton à son style
    // afin de retrouver facilement cette information
    // → « data-attributes » = attributs personnalisés
    button.dataset.style = style;
  
    button.addEventListener('click', app.handleColorClick);
  
    document.querySelector('.palette').appendChild(button);
  },
  addPalette() {
    const palette = document.createElement('div');
    palette.classList.add('palette');
  
    document.body.appendChild(palette);
    
    // POUR CHAQUE style défini dans `STYLES`,
    // on exécute des instructions : ici, on crée un bouton
    // → array function `Array.prototype.forEach`
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
    // STYLES.forEach(function (style) {
    //   console.log(style);
    // });
    // STYLES.forEach(function (style) { addPaletteButton(style); } );
    app.styles.forEach(app.addPaletteButton);
  },

  handlePixelClick(event) {
    // on récupère le pixel sur lequel on a cliqué
    // = cible du click
    const pixel = event.target;
    
    // on supprime la couleur actuelle du pixel
    // comme on ne sait pas de quelle couleur il est,
    // on fait toutes les options
    app.styles.forEach(function (style) {
      pixel.classList.remove('pixel--' + style);
    });
  
    // on lui ajoute la classe de la couleur courante
    pixel.classList.add('pixel--' + app.currentStyle);
  },
  handleConfigSubmit(event) {
    // on empêche le comportement par défaut d'une soumission
    // = chargement de la page ou d'une autre page (action="XXX")
    event.preventDefault();
  
    /*
      Pour récupérer les valeurs d'un formulaire :
  
      1. on cible les éléments avec querySelector ou getElementXXXX
  
        const gridSizeInput = document.querySelector('input[name="gridSize"]');
        console.log(gridSizeInput.value);
  
      2. form.childNodes = NodeList ~ array
        → je vais cibler mes éléments `input` puis récupérer leur valeur
  
        ```js
            console.log(event.target.childNodes);
            for (const element of event.target.childNodes) {
              console.log(element);
              if (element.tagName === 'INPUT') {
                console.log(element.value);
              }
            }
          ```
  
          OU
      
          `event.target.childNodes[0].value` et `event.target.childNodes[1].value`
  
      3. form.children = HTMLCollection ~ object
        → `event.target.children.nameOfTheInput` (name="nameOfTheInput")
  
      4. FormData (https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData)
    */
    const formData = new FormData(app.configForm);
    const fields = Object.fromEntries(formData);
    // console.log(fields); // output: { gridSize: '1', pixelWidth: '12' }
  
    // SI la valeur existe dans les données de formulaire,
    //    ALORS je remplace mon option
    if (fields.gridSize) {
      // options.gridSize = parseInt(fields.gridSize, 10);
      app.options.gridSize = Number(fields.gridSize);
    }
    if (fields.pixelWidth) {
      app.options.pixelWidth = Number(fields.pixelWidth);
    }
  
    // console.log(options);
  
    // on supprime la grille actuelle
    app.clearGrid();
  
    // on en re-crée une
    app.addGrid();
  },
  handleColorClick(event) {
    // on supprime la classe active de la couleur sélectionnée
    document
      .querySelector('.palette-color--active')
      .classList.remove('palette-color--active');
  
    // on ajoute la classe `active`
    const clickedColor = event.target;
    clickedColor.classList.add('palette-color--active');
  
    // on définit cette couleur comme style courant
    app.currentStyle = clickedColor.dataset.style;
    console.log(app.currentStyle);
  },

  clearGrid() {
    app.invader.innerHTML = '';
  }
};

app.init();
