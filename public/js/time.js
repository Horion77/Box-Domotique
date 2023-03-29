function afficherHeureEtDate() {
    const dateActuelle = new Date();
  
    // Afficher l'heure
    const heure = dateActuelle.getHours();
    const minutes = dateActuelle.getMinutes();
    const secondes = dateActuelle.getSeconds();
    const heureActuelle = heure + ':' + minutes + ':' + secondes;
    document.getElementById('heure').textContent = heureActuelle;
  
    // Afficher la date avec la police "Roboto Slab"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = dateActuelle.toLocaleDateString('fr-FR', options)
      .replace(/\b\w/g, (c) => c.toUpperCase()); // convertir les premières lettres en majuscule
    const dateElement = document.getElementById('date');
    dateElement.textContent = date;
    dateElement.style.fontFamily = 'Roboto Slab';
  }
  
  setInterval(afficherHeureEtDate, 1000);