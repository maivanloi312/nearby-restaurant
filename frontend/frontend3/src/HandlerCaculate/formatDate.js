const getFormattedDate=(dateString) =>{
    const date = new Date(dateString);  
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return day+'/'+month + '/'  + year;
  }
  const formattedDateFromParse=(dateString)=>{
    const date = new Date(dateString);  
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return `${month}-${day}-${year}`
  }
  const checkURL=(url)=> {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
const compareValidDate=(date)=>{
  const date1 = new Date();
    const date2 = new Date(date);
   
    if(date1.getTime() > date2.getTime()){
       return false
    }
    return true
}
const validatePhoneNumber=(phone)=>{
  var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  if(phone.match(phoneno)) {
    return true;
  }
  return false;
}
const validateCityOrPostalCode=(code)=>{
  return /^([0-9]{5})$/.test(code);
}
const validateFullName=(name)=>{
  
  var re = /^[a-zA-Z ]{2,}$/g;// regex here
    return re.test(removeAscent(name))
}
const removeAscent= (str)=> {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

const validateEmail=(email)=> {
  var re =  /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  return re.test(email);
}
const  formatterMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});
  export {getFormattedDate,checkURL,formattedDateFromParse,compareValidDate,validatePhoneNumber,validateCityOrPostalCode,validateFullName,validateEmail,formatterMoney}