function validateForm() {
    var x = document.forms["editProduct"]["ingredient[]"].value;
    var y = document.forms["editProduct"]["qtya[]"].value;
    if((x == "") && (y=="")){
        return true;
    }
    if( (x == "") || (y == "")){
      alert("All fields must be field out");
      return false;
    }
   
  }
